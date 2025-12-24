# 2025_new_hp_temp - WordPress開発用テンプレート

WordPressテーマ開発用のスターターテンプレートです。Vite + Sass構成に対応しています。

## セットアップ

```bash
npm install
```

## 開発・ビルドコマンド

### 開発モード（watch）

```bash
npm run watch
```

SCSSとJavaScriptを監視し、変更時に自動コンパイルします。ソースマップが生成されます。

### 本番ビルド

```bash
npm run build
```

以下の処理を実行します：
1. SCSS/JSのコンパイル・最適化
2. 画像最適化（圧縮・WebP生成）

## 出力先

すべての成果物は `assets/dist/` 配下に出力されます：

```
assets/dist/
├── css/
│   └── style.css
├── js/
│   └── common.js
├── img/
├── webp/
└── fonts/
```

**注意：** `assets/dist/` は `.gitignore` に含まれており、ビルド生成物として扱われます。ビルド前に `npm run build` を実行してください。

## 画像処理

画像の物理解像度は変更しません。圧縮・WebP生成・SVG最適化のみを行います。

- **JPEG**: mozjpeg（quality: 80）
- **PNG**: pngquant（quality: [0.65, 0.8]）
- **GIF**: gifsicle最適化
- **SVG**: svgo最適化
- **WebP**: sharp（quality: 70, method: 6）

500KBを超える画像がある場合は警告が表示されます。

## ファイル構成

```
assets/
├── src/              # ソースファイル
│   ├── sass/         # SCSSファイル
│   ├── js/           # JavaScriptファイル
│   └── img/          # 元画像
└── dist/             # ビルド成果物（出力先・gitignore対象）
    ├── css/
    ├── js/
    ├── img/
    ├── webp/
    └── fonts/

template-parts/       # テンプレートパーツ
├── layout/           # レイアウト関連（header.php, footer.php）
├── nav/              # ナビゲーション関連
└── breadcrumb.php    # パンくずリスト

contents/             # コンテンツテンプレート
├── page/             # 固定ページテンプレート
│   └── sample.php    # サンプルページ
├── archive/          # アーカイブテンプレート
└── single/           # 投稿詳細テンプレート

admin/                # テーマ機能
├── init.php          # テーマ初期化
└── functions-util.php # ユーティリティ関数
```

## トラブルシューティング

### ビルドエラーが発生する場合

```bash
rm -rf node_modules
npm install
```

### キャッシュをクリア

```bash
rm -rf assets/dist
npm run build
```

## テンプレートの使い方

### 基本テンプレート

- `front-page.php`: トップページ
- `page.php`: 固定ページ
- `single.php`: 投稿詳細
- `archive.php`: アーカイブ一覧
- `404.php`: 404エラーページ
- `header.php`: ヘッダー
- `footer.php`: フッター

### テンプレートパーツ

`template-parts/` ディレクトリに共通パーツを配置しています：

```php
<?php get_template_part('template-parts/layout/header'); ?>
<?php get_template_part('template-parts/layout/footer'); ?>
<?php get_template_part('template-parts/breadcrumb'); ?>
```

### ユーティリティ関数

テーマで使用できるヘルパー関数：

- `img_dir()`: 画像ディレクトリURLを出力
- `webp_dir()`: WebP画像ディレクトリURLを出力
- `css_dir()`: CSSディレクトリURLを出力
- `js_dir()`: JSディレクトリURLを出力
- `render_pagination()`: ページネーションを出力
- `get_current_post_type()`: 現在の投稿タイプを取得

## 開発ガイドライン

- ソースファイルは `assets/src/` 配下に配置
- ビルド後は `assets/dist/` に出力される
- PHPテンプレートでは `assets/dist/` を参照
- `template-parts/` に共通パーツを配置
- カスタム投稿タイプが必要な場合は `functions.php` に追加
