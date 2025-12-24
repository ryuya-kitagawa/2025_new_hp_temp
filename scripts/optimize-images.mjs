import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join, resolve, extname, basename, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcImgDir = resolve(__dirname, '../assets/src/img');
const distImgDir = resolve(__dirname, '../assets/dist/img');
const distWebpDir = resolve(__dirname, '../assets/dist/webp');
const manifestPath = resolve(__dirname, '../assets/dist/image-manifest.json');

const SIZE_WARN_KB = 500;
const SP_WIDTH = 768;
const PC_WIDTH_MV = 1920;    // *_mv 系
const PC_WIDTH_DEFAULT = 1600; // それ以外

// dist/img と dist/webp をクリーンアップ（古いファイルを削除）
if (existsSync(distImgDir)) {
    rmSync(distImgDir, { recursive: true });
    console.log('✓ dist/img をクリーンアップしました');
}
if (existsSync(distWebpDir)) {
    rmSync(distWebpDir, { recursive: true });
    console.log('✓ dist/webp をクリーンアップしました');
}

// ディレクトリを作成
mkdirSync(distImgDir, { recursive: true });
mkdirSync(distWebpDir, { recursive: true });

/**
 * 画像ファイルを再帰的に取得
 */
function getImageFiles(dir, fileList = []) {
    const files = readdirSync(dir);

    files.forEach((file) => {
        const filePath = join(dir, file);
        const st = statSync(filePath);

        if (st.isDirectory()) {
            getImageFiles(filePath, fileList);
        } else {
            const ext = extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

/**
 * 用途別 最大幅（PC側の“上書きリサイズ”に使う）
 */
function getPcMaxWidthByName(fileName) {
    const lower = fileName.toLowerCase();
    if (lower.includes('_mv')) return PC_WIDTH_MV;
    return PC_WIDTH_DEFAULT;
}

/**
 * distPath のディレクトリがなければ作る
 */
function ensureDirForFile(filePath) {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}

/**
 * dist 側の相対パスを作る
 */
function toDistPathFromSrcFile(srcFile) {
    const rel = relative(srcImgDir, srcFile);
    return join(distImgDir, rel);
}

/**
 * webp 側のパスを作る（ディレクトリ構造維持）
 * - PC版: distWebpDir + relDir + base.webp
 * - SP版: distWebpDir + relDir + base-sp.webp
 */
function toWebpPathFromRelative(relPath, { isSp = false } = {}) {
    const relDir = dirname(relPath);
    const base = basename(relPath, extname(relPath));
    const file = isSp ? `${base}-sp.webp` : `${base}.webp`;
    return join(distWebpDir, relDir, file);
}

/**
 * SP版のファイル名（distImgDir 側）
 * 例: about_mv.png -> about_mv-sp.png
 */
function toSpDistPathFromDistPath(distPath) {
    const dir = dirname(distPath);
    const ext = extname(distPath);
    const base = basename(distPath, ext);
    return join(dir, `${base}-sp${ext}`);
}

/**
 * 画像を「切らずに」縮小する（幅だけ指定、拡大しない）
 */
async function resizeInsideOnly(inputPath, outputPath, maxWidth) {
    const img = sharp(inputPath);
    const meta = await img.metadata();

    // 画像が壊れてる/読めない等
    if (!meta || !meta.width) return false;

    // 小さい画像は触らない（拡大しない）
    if (meta.width <= maxWidth) return false;

    const buf = await img
        .resize({
            width: maxWidth,
            fit: 'inside',            // 切らない
            withoutEnlargement: true, // 拡大しない
        })
        .toBuffer();

    ensureDirForFile(outputPath);
    await sharp(buf).toFile(outputPath);
    return true;
}

/**
 * WebP生成（PC/SP）
 */
async function generateWebpFromDist(distPath, relPath, { isSp = false } = {}) {
    const webpPath = toWebpPathFromRelative(relPath, { isSp });
    ensureDirForFile(webpPath);

    // quality はここで管理（必要なら調整）
    await sharp(distPath)
        .webp({ quality: 70, effort: 6 })
        .toFile(webpPath);

    return webpPath;
}

/**
 * サイズ計測（KB）
 */
function sizeKB(filePath) {
    const st = statSync(filePath);
    return st.size / 1024;
}

/**
 * 500KB超を列挙
 */
function listOverSize(files, thresholdKB) {
    const over = [];
    for (const f of files) {
        try {
            const kb = sizeKB(f);
            if (kb > thresholdKB) over.push({ path: f, kb });
        } catch (_) {
            // ignore
        }
    }
    return over;
}

/**
 * 追加圧縮（最後の詰め）
 * - PNG: sharp の png最適化（圧縮レベル+パレット化）
 * - JPEG: quality 少し下げ
 * ※ 構図は一切触らない（リサイズなし）
 */
async function tightenCompression(filePath) {
    const ext = extname(filePath).toLowerCase();

    if (!['.png', '.jpg', '.jpeg'].includes(ext)) return false;

    const before = statSync(filePath).size;

    const img = sharp(filePath);
    const meta = await img.metadata();
    if (!meta) return false;

    let pipeline = sharp(filePath);

    if (ext === '.png') {
        // 透明の有無は保持したまま、できるだけ軽量化
        pipeline = pipeline.png({
            compressionLevel: 9,
            palette: true,     // 効く画像は劇的に軽くなる
            adaptiveFiltering: true,
        });
    } else {
        // JPEGはちょい攻める（80→72）
        pipeline = pipeline.jpeg({
            quality: 72,
            mozjpeg: true,
        });
    }

    const buf = await pipeline.toBuffer();

    // 改善しないなら書き換えない
    if (buf.length >= before) return false;

    await sharp(buf).toFile(filePath);
    return true;
}

async function optimizeImages() {
    console.log('画像最適化を開始します...');

    const imageFiles = getImageFiles(srcImgDir);

    if (imageFiles.length === 0) {
        console.log('最適化する画像ファイルが見つかりませんでした。');
        return;
    }

    console.log(`${imageFiles.length}個の画像ファイルを処理します...`);

    // 1) 画像圧縮（jpg, png, gif, svg）→ dist/img へ
    try {
        await imagemin(imageFiles, {
            destination: distImgDir,
            plugins: [
                imageminMozjpeg({
                    quality: 80,
                }),
                // ここは「警告ゼロ」寄せで少し強めに
                imageminPngquant({
                    quality: [0.55, 0.75],
                    speed: 1,
                }),
                imageminGifsicle({
                    interlaced: false,
                }),
                imageminSvgo({
                    plugins: [
                        { name: 'removeViewBox', active: true },
                        { name: 'cleanupIDs', active: false },
                    ],
                }),
            ],
        });
        console.log('✓ 画像圧縮が完了しました');
    } catch (error) {
        console.error('画像圧縮エラー:', error);
    }

    // dist に実際に存在するファイル一覧（src基準で組み立て）
    const distRasterRelPaths = [];
    const distRasterFiles = [];
    for (const srcFile of imageFiles) {
        const ext = extname(srcFile).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext)) continue;

        const rel = relative(srcImgDir, srcFile);
        const distPath = join(distImgDir, rel);

        if (existsSync(distPath)) {
            distRasterRelPaths.push(rel);
            distRasterFiles.push(distPath);
        }
    }

    // 2) 安全リサイズ（PC版を“同名で上書き”＝既存参照を壊さない）
    console.log('\n--- 安全リサイズ（PC上書き + SP派生） ---');

    const spGenerated = [];
    const pcTouched = [];

    for (const rel of distRasterRelPaths) {
        const distPath = join(distImgDir, rel);
        const ext = extname(distPath).toLowerCase();

        // raster のみ（gif/svg は対象外）
        if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

        const baseName = basename(distPath);
        const pcMaxWidth = getPcMaxWidthByName(baseName);

        // PC版：同名で上書き（切らない）
        const didPcResize = await resizeInsideOnly(distPath, distPath, pcMaxWidth);
        if (didPcResize) {
            pcTouched.push(rel);
            console.log(`PC RESIZE: ${rel} (maxW=${pcMaxWidth})`);
        }

        // SP版：別名で生成（-sp）
        const spPath = toSpDistPathFromDistPath(distPath);
        const didSpResize = await resizeInsideOnly(distPath, spPath, SP_WIDTH);
        if (didSpResize) {
            spGenerated.push({ rel, spPath });
            console.log(`SP GEN:   ${relative(distImgDir, spPath)} (maxW=${SP_WIDTH})`);
        } else {
            // SP用が作れない（既に小さい等）場合は生成しない
        }
    }

    // 3) WebP生成（PC+SP）
    console.log('\n--- WebP生成（PC + SP） ---');

    // PC版WebP：jpg/jpeg/png のみ
    const webpTargets = distRasterRelPaths.filter((rel) => {
        const ext = extname(rel).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(ext);
    });

    const generatedWebps = [];
    for (const rel of webpTargets) {
        const distPath = join(distImgDir, rel);
        try {
            const webpPath = await generateWebpFromDist(distPath, rel, { isSp: false });
            generatedWebps.push(webpPath);
        } catch (e) {
            console.error(`WebP変換エラー(PC) (${rel}):`, e.message);
        }
    }

    // SP版WebP：SP画像が生成できたものだけ
    for (const item of spGenerated) {
        const { rel, spPath } = item;
        try {
            // rel をそのまま使って、webpは -sp.webp にする
            const webpPath = toWebpPathFromRelative(rel, { isSp: true });
            ensureDirForFile(webpPath);

            await sharp(spPath)
                .webp({ quality: 70, effort: 6 })
                .toFile(webpPath);

            generatedWebps.push(webpPath);
        } catch (e) {
            console.error(`WebP変換エラー(SP) (${rel}):`, e.message);
        }
    }

    console.log('✓ WebP変換が完了しました');

    // 4) manifest生成（src / srcset / webp srcset）
    // 使い方：テーマ側でこのJSONを読み、srcsetを出す
    const manifest = {};
    for (const rel of webpTargets) {
        const distPath = join(distImgDir, rel);
        const ext = extname(rel);
        const base = basename(rel, ext);
        const relDir = dirname(rel);

        const spRel = join(relDir, `${base}-sp${ext}`);
        const spDistPath = join(distImgDir, spRel);

        const hasSp = existsSync(spDistPath);

        const pcImgUrl = `./img/${rel.replaceAll('\\', '/')}`;
        const spImgUrl = `./img/${spRel.replaceAll('\\', '/')}`;

        const pcWebpRelPath = relative(distWebpDir, toWebpPathFromRelative(rel, { isSp: false }))
            .replaceAll('\\', '/');
        const spWebpRelPath = relative(distWebpDir, toWebpPathFromRelative(rel, { isSp: true }))
            .replaceAll('\\', '/');

        const pcWebpUrl = `./webp/${pcWebpRelPath}`;
        const spWebpUrl = `./webp/${spWebpRelPath}`;

        // srcset 文字列（存在するものだけ）
        const imgSrcset = hasSp
            ? `${spImgUrl} ${SP_WIDTH}w, ${pcImgUrl} ${getPcMaxWidthByName(basename(rel))}w`
            : `${pcImgUrl} ${getPcMaxWidthByName(basename(rel))}w`;

        const webpSrcset = hasSp && existsSync(toWebpPathFromRelative(rel, { isSp: true }))
            ? `${spWebpUrl} ${SP_WIDTH}w, ${pcWebpUrl} ${getPcMaxWidthByName(basename(rel))}w`
            : `${pcWebpUrl} ${getPcMaxWidthByName(basename(rel))}w`;

        manifest[`img/${rel.replaceAll('\\', '/')}`] = {
            src: pcImgUrl,
            srcset: imgSrcset,
            webp: {
                src: pcWebpUrl,
                srcset: webpSrcset,
            },
            hasSp,
        };
    }

    try {
        ensureDirForFile(manifestPath);
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
        console.log(`\n✓ image-manifest.json を出力しました: ${manifestPath}`);
    } catch (e) {
        console.warn('manifest出力に失敗:', e.message);
    }

    // 5) サイズチェック → 追加圧縮 → 再チェック（警告ゼロ寄せ）
    console.log('\n--- 画像サイズ情報（500KB超チェック） ---');

    // dist/img 以下の raster（png/jpg/jpeg）と、dist/webp 以下の webp を対象にする
    const sizeCheckTargets = [];

    // dist/img の対象
    for (const rel of distRasterRelPaths) {
        const p = join(distImgDir, rel);
        const ex = extname(p).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ex) && existsSync(p)) sizeCheckTargets.push(p);

        // SP版
        const spP = toSpDistPathFromDistPath(p);
        if (existsSync(spP)) sizeCheckTargets.push(spP);
    }

    // dist/webp の対象（生成済みのみ）
    for (const p of generatedWebps) {
        if (existsSync(p)) sizeCheckTargets.push(p);
    }

    // 1回目
    let over = listOverSize(sizeCheckTargets, SIZE_WARN_KB);

    if (over.length === 0) {
        console.log('✓ すべての画像が500KB以下です。');
    } else {
        console.log(`⚠ 500KB超: ${over.length}件`);

        // 追加圧縮を試す（png/jpg/jpegのみ。webpはquality固定のため基本触らない）
        console.log('\n--- 追加圧縮（可能な限り警告ゼロへ） ---');

        // webp はここでは触らない（必要なら後で quality を下げる）
        const retryTargets = over
            .map((o) => o.path)
            .filter((p) => ['.png', '.jpg', '.jpeg'].includes(extname(p).toLowerCase()));

        let tightened = 0;
        for (const p of retryTargets) {
            try {
                const ok = await tightenCompression(p);
                if (ok) {
                    tightened++;
                    console.log(`TIGHTEN: ${relative(resolve(__dirname, '..'), p).replaceAll('\\', '/')} -> ${sizeKB(p).toFixed(2)}KB`);
                }
            } catch (e) {
                // ignore
            }
        }

        console.log(`✓ 追加圧縮: ${tightened}件 改善しました`);

        // 2回目
        over = listOverSize(sizeCheckTargets, SIZE_WARN_KB);

        if (over.length === 0) {
            console.log('\n✓ すべての画像が500KB以下になりました（警告ゼロ）。');
        } else {
            console.log(`\n⚠ まだ500KB超が残っています: ${over.length}件`);
            for (const o of over) {
                console.log(`⚠ ${relative(resolve(__dirname, '..'), o.path).replaceAll('\\', '/')}: ${o.kb.toFixed(2)}KB`);
            }
            console.log('\n残る原因は多くが「(1)幅が既に小さいがPNGが重い」「(2)写真なのにPNG」なので、画像素材側でJPEG化 or WebP優先配信を検討すると確実です。');
        }
    }

    console.log('\n画像最適化が完了しました！');
}

optimizeImages().catch(console.error);
