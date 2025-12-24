<?php // すべてのページ 
?>
<!-- フォント読み込み最適化: preconnectのみ先に -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- フォントCSSは非同期読み込み（必要なウェイトのみ） -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap">
</noscript>

<!-- FontAwesomeは遅延読み込み -->
<script>
    // FontAwesomeを遅延読み込み
    window.addEventListener('load', function() {
        var script = document.createElement('script');
        script.src = 'https://kit.fontawesome.com/f0f73d4bc3.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    });
</script>

<?php
// バージョンクエリ（キャッシュバスト用）
$css_file = get_template_directory() . '/assets/dist/css/style.css';
$css_version = file_exists($css_file) ? filemtime($css_file) : null;
$css_url = get_template_directory_uri() . '/assets/dist/css/style.css' . ($css_version ? '?v=' . $css_version : '');
?>
<link rel="stylesheet" href="<?php echo esc_url($css_url); ?>">