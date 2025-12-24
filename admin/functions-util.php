<?php
/**
 * Utility Functions
 * 
 * テーマで使用する汎用的なヘルパー関数
 */

// テーマディレクトリURLを出力
function tempath()
{
  echo TEMP_DIR;
}

// ホームURLを出力
function home_path()
{
  echo HOME_PATH;
}

// 画像ディレクトリURLを出力
function img_dir()
{
  echo TEMP_DIR . '/assets/dist/img';
}

// WebP画像ディレクトリURLを出力
function webp_dir()
{
  echo TEMP_DIR . '/assets/dist/webp';
}

// 画像ディレクトリURLを返す（出力しない）
function img_dir_str()
{
  return TEMP_DIR . '/assets/dist/img';
}

// CSSディレクトリURLを出力
function css_dir()
{
  echo TEMP_DIR . '/assets/dist/css';
}

// JSディレクトリURLを出力
function js_dir()
{
  echo TEMP_DIR . '/assets/dist/js';
}

/**
 * 現在の投稿タイプを取得するヘルパー
 */
function get_current_post_type()
{
  $post_type = get_post_type();
  if (is_tax()) {
    $term = get_queried_object();
    $taxonomy = get_taxonomy($term->taxonomy);
    if (!empty($taxonomy->object_type)) {
      $post_type = $taxonomy->object_type[0];
    }
  }
  return $post_type;
}

/**
 * 投稿タイプごとのラベル名を取得
 */
function get_post_type_label_name()
{
  $pt = get_post_type_object(get_current_post_type());
  return $pt ? $pt->label : '';
}

/**
 * 共通ページネーション出力
 *
 * @param WP_Query|null $query 対象クエリ（未指定ならメインクエリ）
 */
function render_pagination($query = null)
{
  if (!$query) {
    global $wp_query;
    $query = $wp_query;
  }

  // ページが1ページしかない場合は表示しない
  if ($query->max_num_pages <= 1) {
    return;
  }

  $paged = max(1, get_query_var('paged'));

  echo '<div class="c-pagination">';
  echo paginate_links([
    'base'      => str_replace(999999999, '%#%', esc_url(get_pagenum_link(999999999))),
    'format'    => '?paged=%#%',
    'current'   => $paged,
    'total'     => $query->max_num_pages,
    'mid_size'  => 2,
    'prev_text' => '&lt;',
    'next_text' => '&gt;',
    'type'      => 'list',
  ]);
  echo '</div>';
}
