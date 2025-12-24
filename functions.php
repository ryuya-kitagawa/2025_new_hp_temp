<?php
/**
 * Theme Functions
 * 
 * WordPressテーマの基本機能を定義
 */

// テーマ初期化とユーティリティ関数
$includes = [
  'admin/init.php',
  'admin/functions-util.php',
];

foreach ($includes as $file) {
  if (file_exists(get_theme_file_path($file))) {
    require_once get_theme_file_path($file);
  }
}
