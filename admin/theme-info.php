<?php
/**
 * Theme Info & Style Guide
 * 
 * テーマの説明とスタイルガイドを表示する管理画面ページ
 */

// 管理画面にメニューを追加
add_action('admin_menu', function() {
  add_theme_page(
    'テーマ情報',           // ページタイトル
    'テーマ情報',           // メニュータイトル
    'read',                 // 権限（すべての管理者）
    'theme-info',           // スラッグ
    'theme_info_page'       // コールバック関数
  );
});

// 管理画面ページの内容
function theme_info_page() {
  ?>
  <div class="wrap theme-info-page">
    <h1>テーマ情報・スタイルガイド</h1>
    
    <div class="theme-info-container">
      <!-- テーマ説明 -->
      <div class="theme-info-section">
        <h2>テーマについて</h2>
        <div class="theme-info-box">
          <h3>テーマ名: 2025_new_hp_temp</h3>
          <p>WordPress開発用テンプレートテーマです。Vite + Sass構成に対応しており、新規プロジェクトのベースとして使用できます。</p>
          
          <h4>主な特徴</h4>
          <ul>
            <li>Viteを使用した高速ビルド環境</li>
            <li>Sass（SCSS）による効率的なスタイル管理</li>
            <li>レスポンシブ対応の基本レイアウト</li>
            <li>最小限の構成で拡張しやすい設計</li>
          </ul>
        </div>
      </div>

      <!-- ディレクトリ構成 -->
      <div class="theme-info-section">
        <h2>ディレクトリ構成</h2>
        <div class="theme-info-box">
          <pre><code>2025_new_hp_temp/
├── admin/              # テーマ機能
│   ├── init.php        # テーマ初期化
│   └── functions-util.php  # ユーティリティ関数
├── assets/
│   ├── src/            # ソースファイル
│   │   ├── sass/       # SCSSファイル
│   │   ├── js/         # JavaScriptファイル
│   │   └── img/        # 画像ファイル（空）
│   └── dist/           # ビルド成果物（gitignore）
├── contents/           # コンテンツテンプレート
│   ├── page/           # 固定ページ
│   ├── archive/        # アーカイブ
│   └── single/         # 投稿詳細
├── template-parts/     # テンプレートパーツ
│   ├── layout/         # レイアウト（header, footer）
│   └── nav/            # ナビゲーション
├── functions.php       # メイン関数ファイル
├── style.css          # テーマ情報
└── package.json       # npm設定</code></pre>
        </div>
      </div>

      <!-- セットアップ手順 -->
      <div class="theme-info-section">
        <h2>セットアップ手順</h2>
        <div class="theme-info-box">
          <ol>
            <li><strong>依存関係のインストール</strong><br>
              <code>npm install</code>
            </li>
            <li><strong>開発モードでビルド</strong><br>
              <code>npm run watch</code><br>
              SCSSとJavaScriptを監視し、変更時に自動コンパイル
            </li>
            <li><strong>本番用ビルド</strong><br>
              <code>npm run build</code><br>
              SCSS/JSのコンパイル・最適化と画像最適化を実行
            </li>
            <li><strong>テーマの有効化</strong><br>
              WordPress管理画面でテーマを有効化
            </li>
          </ol>
        </div>
      </div>

      <!-- スタイルガイド -->
      <div class="theme-info-section">
        <h2>スタイルガイド</h2>
        
        <div class="theme-info-box">
          <h3>色</h3>
          <div class="style-guide-colors">
            <div class="color-item">
              <div class="color-box" style="background: #333;"></div>
              <div class="color-info">
                <strong>プライマリーカラー</strong><br>
                <code>#333</code> - テキスト、ヘッダー、フッター
              </div>
            </div>
            <div class="color-item">
              <div class="color-box" style="background: #666;"></div>
              <div class="color-info">
                <strong>セカンダリーカラー</strong><br>
                <code>#666</code> - サブテキスト
              </div>
            </div>
            <div class="color-item">
              <div class="color-box" style="background: #999;"></div>
              <div class="color-info">
                <strong>テキスト（薄）</strong><br>
                <code>#999</code> - メタ情報など
              </div>
            </div>
            <div class="color-item">
              <div class="color-box" style="background: #f5f5f5;"></div>
              <div class="color-info">
                <strong>背景色</strong><br>
                <code>#f5f5f5</code> - メイン背景
              </div>
            </div>
            <div class="color-item">
              <div class="color-box" style="background: #fff; border: 1px solid #ddd;"></div>
              <div class="color-info">
                <strong>カード背景</strong><br>
                <code>#fff</code> - コンテンツカード
              </div>
            </div>
          </div>
        </div>

        <div class="theme-info-box">
          <h3>タイポグラフィ</h3>
          <div class="typography-examples">
            <div class="typography-item">
              <h1 style="margin: 0.5em 0;">見出し1 (H1)</h1>
              <code>font-size: 2.4rem; font-weight: 700;</code>
            </div>
            <div class="typography-item">
              <h2 style="margin: 0.5em 0;">見出し2 (H2)</h2>
              <code>font-size: 2rem; font-weight: 700;</code>
            </div>
            <div class="typography-item">
              <h3 style="margin: 0.5em 0;">見出し3 (H3)</h3>
              <code>font-size: 1.8rem; font-weight: 600;</code>
            </div>
            <div class="typography-item">
              <p style="margin: 0.5em 0;">本文テキスト</p>
              <code>font-size: 1.6rem; line-height: 1.8;</code>
            </div>
            <div class="typography-item">
              <p style="margin: 0.5em 0; font-size: 1.4rem; color: #666;">小さいテキスト</p>
              <code>font-size: 1.4rem;</code>
            </div>
          </div>
        </div>

        <div class="theme-info-box">
          <h3>コンポーネント</h3>
          
          <h4>ボタン</h4>
          <div style="margin: 1em 0;">
            <button class="button button-primary" style="margin-right: 0.5em;">プライマリーボタン</button>
            <button class="button" style="margin-right: 0.5em;">セカンダリーボタン</button>
          </div>

          <h4>リンク</h4>
          <div style="margin: 1em 0;">
            <a href="#" style="color: #0066cc; text-decoration: underline;">通常のリンク</a>
          </div>

          <h4>カード</h4>
          <div style="background: #fff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 1em 0; max-width: 400px;">
            <h4 style="margin-top: 0;">カードタイトル</h4>
            <p>カードコンテンツのサンプルです。</p>
          </div>
        </div>
      </div>

      <!-- 使用方法 -->
      <div class="theme-info-section">
        <h2>使用方法</h2>
        <div class="theme-info-box">
          <h3>テンプレートパーツの使用</h3>
          <pre><code>&lt;?php get_template_part('template-parts/layout/header'); ?&gt;
&lt;?php get_template_part('template-parts/layout/footer'); ?&gt;
&lt;?php get_template_part('template-parts/breadcrumb'); ?&gt;</code></pre>

          <h3>ユーティリティ関数</h3>
          <ul>
            <li><code>img_dir()</code> - 画像ディレクトリURLを出力</li>
            <li><code>webp_dir()</code> - WebP画像ディレクトリURLを出力</li>
            <li><code>css_dir()</code> - CSSディレクトリURLを出力</li>
            <li><code>js_dir()</code> - JSディレクトリURLを出力</li>
            <li><code>render_pagination()</code> - ページネーションを出力</li>
            <li><code>get_current_post_type()</code> - 現在の投稿タイプを取得</li>
          </ul>

          <h3>カスタマイズ方法</h3>
          <ol>
            <li><strong>スタイルのカスタマイズ</strong><br>
              <code>assets/src/sass/</code>配下のファイルを編集し、<code>npm run build</code>でビルド
            </li>
            <li><strong>JavaScriptの追加</strong><br>
              <code>assets/src/js/</code>配下にファイルを追加し、<code>common.js</code>からインポート
            </li>
            <li><strong>画像の追加</strong><br>
              <code>assets/src/img/</code>に画像を配置し、<code>npm run build</code>で最適化
            </li>
            <li><strong>テンプレートのカスタマイズ</strong><br>
              <code>template-parts/</code>配下のファイルを編集
            </li>
          </ol>
        </div>
      </div>

      <!-- トラブルシューティング -->
      <div class="theme-info-section">
        <h2>トラブルシューティング</h2>
        <div class="theme-info-box">
          <h3>ビルドエラーが発生する場合</h3>
          <pre><code>rm -rf node_modules
npm install</code></pre>

          <h3>キャッシュをクリア</h3>
          <pre><code>rm -rf assets/dist
npm run build</code></pre>

          <h3>スタイルが反映されない場合</h3>
          <ul>
            <li><code>npm run build</code>を実行してビルドされているか確認</li>
            <li>ブラウザのキャッシュをクリア</li>
            <li><code>assets/dist/</code>ディレクトリが存在するか確認</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <style>
    .theme-info-page {
      max-width: 1200px;
    }

    .theme-info-container {
      margin-top: 2rem;
    }

    .theme-info-section {
      margin-bottom: 3rem;
    }

    .theme-info-section h2 {
      font-size: 1.8rem;
      border-bottom: 2px solid #2271b1;
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .theme-info-section h3 {
      font-size: 1.4rem;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }

    .theme-info-section h4 {
      font-size: 1.2rem;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    .theme-info-box {
      background: #fff;
      border: 1px solid #c3c4c7;
      border-radius: 4px;
      padding: 1.5rem;
      box-shadow: 0 1px 1px rgba(0,0,0,.04);
    }

    .theme-info-box pre {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1rem;
      overflow-x: auto;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .theme-info-box code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: Consolas, Monaco, monospace;
      font-size: 0.9em;
    }

    .theme-info-box pre code {
      background: transparent;
      padding: 0;
    }

    .style-guide-colors {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .color-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .color-box {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .color-info {
      flex: 1;
    }

    .typography-examples {
      margin-top: 1rem;
    }

    .typography-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .typography-item:last-child {
      border-bottom: none;
    }

    .typography-item code {
      display: block;
      margin-top: 0.5rem;
      color: #666;
      font-size: 0.85rem;
    }

    .theme-info-box ul,
    .theme-info-box ol {
      margin-left: 2rem;
      line-height: 1.8;
    }

    .theme-info-box li {
      margin-bottom: 0.5rem;
    }
  </style>
  <?php
}

