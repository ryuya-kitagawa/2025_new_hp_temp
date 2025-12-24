import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync, rmSync } from 'fs';
import { join, resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const themeRoot = resolve(__dirname, '..');
const distThemeDir = resolve(themeRoot, 'dist-theme');

// 除外するファイル・ディレクトリ
const excludePatterns = [
  'node_modules',
  'dist-theme',
  '.git',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'postcss.config.js',
  'vite-plugin-sass-glob.js',
  'README.md',
  'lighthouse',
  '.cursorrules',
  // .htaccessは手動でコピーするため、除外パターンから削除
];

// 除外するディレクトリ（配下すべて）
const excludeDirs = [
  'node_modules',
  'dist-theme',
  '.git',
  'lighthouse',
  'scripts', // ビルドスクリプトは除外
];

// 除外するパスパターン（ネストされたディレクトリも対応）
const excludePathPatterns = [
  /assets[\/\\]src/, // assets/src 配下すべて
];

// ファイルをコピーする関数
function copyRecursive(src, dest, basePath = '') {
  if (!existsSync(src)) {
    return;
  }

  const stat = statSync(src);
  
  // パスパターンチェック（ネストされたディレクトリ対応）
  const relativePath = relative(themeRoot, src).replace(/\\/g, '/');
  for (const pattern of excludePathPatterns) {
    if (pattern.test(relativePath)) {
      return;
    }
  }
  
  if (stat.isDirectory()) {
    // ディレクトリ名をチェック
    const dirName = src.split(/[/\\]/).pop();
    if (excludeDirs.includes(dirName)) {
      return;
    }

    // dist-themeディレクトリを作成
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    // ディレクトリ内のファイルを再帰的にコピー
    const files = readdirSync(src);
    for (const file of files) {
      const srcPath = join(src, file);
      const destPath = join(dest, file);
      copyRecursive(srcPath, destPath, basePath || src);
    }
  } else {
    // ファイル名をチェック
    const fileName = src.split(/[/\\]/).pop();
    if (excludePatterns.includes(fileName)) {
      return;
    }

    // ディレクトリが存在しない場合は作成
    const destDir = dirname(dest);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    // ファイルをコピー
    copyFileSync(src, dest);
  }
}

async function buildDistTheme() {
  console.log('本番用テーマディレクトリ（dist-theme）を作成中...');

  // 既存のdist-themeを削除
  if (existsSync(distThemeDir)) {
    rmSync(distThemeDir, { recursive: true });
    console.log('既存のdist-themeを削除しました');
  }

  // dist-themeディレクトリを作成
  mkdirSync(distThemeDir, { recursive: true });

  // すべてのファイル・ディレクトリをコピー（除外パターンに該当するものは除外）
  const allItems = readdirSync(themeRoot);
  
  for (const item of allItems) {
    const srcPath = join(themeRoot, item);
    const destPath = join(distThemeDir, item);
    
    // 除外パターンをチェック
    if (excludePatterns.includes(item) || excludeDirs.includes(item)) {
      continue;
    }

    copyRecursive(srcPath, destPath);
  }

  // .htaccessを手動でコピー（セキュリティ対策用）
  const htaccessPath = join(themeRoot, '.htaccess');
  if (existsSync(htaccessPath)) {
    copyFileSync(htaccessPath, join(distThemeDir, '.htaccess'));
    console.log('.htaccessをコピーしました');
  }

  console.log(`✓ dist-themeディレクトリを作成しました: ${distThemeDir}`);
  console.log('本番環境へのアップロード準備が完了しました');
}

buildDistTheme().catch(console.error);

