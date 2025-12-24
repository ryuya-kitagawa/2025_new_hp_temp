// Viteプラグイン: SCSSのglobパターン（@use "dir/*"）をサポート
import { readdirSync, statSync, existsSync } from 'fs';
import { join, resolve, dirname, extname } from 'path';

function expandGlobImports(content, filePath, sassPath) {
  // @use "dir/*" パターンを検出
  const globPattern = /@use\s+["']([^"']+)\/\*["']/g;
  let result = content;
  const matches = [];
  
  // すべてのマッチを収集
  let match;
  const patternStr = content;
  while ((match = globPattern.exec(patternStr)) !== null) {
    matches.push({
      pattern: match[0],
      globPath: match[1],
      index: match.index,
    });
  }

  // 後ろから前に処理（インデックスがずれないように）
  for (let i = matches.length - 1; i >= 0; i--) {
    const { pattern, globPath, index } = matches[i];
    const fullGlobPath = resolve(sassPath, globPath);
    
    if (!existsSync(fullGlobPath)) {
      console.warn(`[sass-glob] Directory not found: ${fullGlobPath}`);
      continue;
    }

    // ディレクトリ内のSCSSファイルを取得
    // _で始まるファイルも含める（SCSSの慣習）
    const filesList = readdirSync(fullGlobPath)
      .filter(file => {
        const filePath = join(fullGlobPath, file);
        if (!statSync(filePath).isFile()) return false;
        if (extname(file) !== '.scss') return false;
        return true;
      })
      .sort();

    if (filesList.length === 0) {
      console.warn(`[sass-glob] No SCSS files found in: ${fullGlobPath}`);
      continue;
    }

    const files = filesList
      .map(file => {
        const name = file.replace(/\.scss$/, '');
        // 相対パスを計算
        const relativePath = join(globPath, name).replace(/\\/g, '/');
        return `@use "${relativePath}";`;
      })
      .join('\n');

    // globパターンを展開された@use文に置き換え（インデックスを使用して正確に置換）
    const before = result.substring(0, index);
    const after = result.substring(index + pattern.length);
    result = before + files + after;
  }

  return result;
}

export function sassGlob() {
  const sassPath = resolve(process.cwd(), 'assets/src/sass');

  return {
    name: 'vite-plugin-sass-glob',
    enforce: 'pre',
    transform(code, id, options) {
      const filePath = id.split('?')[0];
      if (!filePath.endsWith('.scss')) {
        return null;
      }

      const cleanedCode = code.replace(/^@use\s+"sass:math";\s*\n?/, '');
      const expanded = expandGlobImports(cleanedCode, id, sassPath);

      if (expanded !== cleanedCode) {
        const globPattern = /@use\s+["']([^"']+)\/\*["']/g;
        let match;
        while ((match = globPattern.exec(cleanedCode)) !== null) {
          const globPath = match[1];
          const fullGlobPath = resolve(sassPath, globPath);
          if (existsSync(fullGlobPath)) {
            const filesList = readdirSync(fullGlobPath)
              .filter(file => {
                const filePath = join(fullGlobPath, file);
                if (!statSync(filePath).isFile()) return false;
                if (extname(file) !== '.scss') return false;
                return true;
              });
            
            filesList.forEach(file => {
              const watchFilePath = join(fullGlobPath, file);
              this.addWatchFile(watchFilePath);
            });
          }
        }

        const finalCode = code.startsWith('@use "sass:math";') 
          ? `@use "sass:math";\n${expanded}`
          : expanded;
        
        return {
          code: finalCode,
          map: null,
        };
      }

      return null;
    },
  };
}

