import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sassGlob } from './vite-plugin-sass-glob.js'

// ESMで __dirname を作る
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// パス定義
const assetsPath = resolve(__dirname, 'assets')
const srcPath = resolve(assetsPath, 'src')
const distPath = resolve(assetsPath, 'dist')

// watchモードかどうかを判定（環境変数またはコマンドライン引数）
const isWatch = process.argv.includes('--watch')

export default defineConfig({
  plugins: [
    sassGlob(),
  ],
  base: './',
  build: {
    outDir: distPath,
    emptyOutDir: false,
    sourcemap: isWatch,
    rollupOptions: {
      input: {
        style: resolve(srcPath, 'sass/style.scss'),
        common: resolve(srcPath, 'js/common.js'),
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/style.css'
          }
          if (assetInfo.name) {
            const ext = assetInfo.name.split('.').pop()
            if (['woff', 'woff2', 'ttf', 'eot', 'otf'].includes(ext)) {
              return `fonts/[name][extname]`
            }
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
    minify: 'terser',
    terserOptions: isWatch
      ? undefined
      : {
        compress: {
          drop_console: false,
        },
      },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";\n`,
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
        includePaths: ['node_modules', resolve(srcPath, 'sass')],
      },
    },
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': srcPath,
    },
  },
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
})
