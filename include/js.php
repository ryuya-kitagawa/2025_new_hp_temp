<?php
// バージョンクエリ取得用ヘルパー関数（重複定義を防ぐ）
if (!function_exists('get_js_url_with_version')) {
  function get_js_url_with_version($filename)
  {
    $js_file = get_template_directory() . '/assets/dist/js/' . $filename;
    $js_version = file_exists($js_file) ? filemtime($js_file) : null;
    $base_url = get_template_directory_uri() . '/assets/dist/js/' . $filename;
    return $js_version ? $base_url . '?v=' . $js_version : $base_url;
  }
}

// 二重読み込み防止：このファイルが既に読み込まれている場合は処理を中断
// get_template_part() は毎回新しいスコープで読み込むため、グローバル変数を使用
global $theme_js_included;
if (isset($theme_js_included) && $theme_js_included) {
  return;
}
$theme_js_included = true;

// 共通JS（全ページ）
$common_js_url = get_js_url_with_version('common.js');
?>
<script src="<?php echo esc_url($common_js_url); ?>"></script>