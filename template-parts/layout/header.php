<?php
/**
 * Header Template Part
 * 
 * ヘッダー部分のテンプレート
 */
// ヘッダーのクラスとロゴ画像のサフィックスを判定
$header_suffix = '_white'; // デフォルト（下層ページなど）

if (is_front_page() || is_home()) {
	$header_suffix = ''; // トップページはサフィックスなし
} elseif (is_single()) {
	$header_suffix = '_white_bg'; // 記事詳細は _white_bg
}
?>

<header class="l-header <?= $header_suffix ?> _fixed" data-header>
	<div class="inner">
		<a href="<?php echo esc_url(home_url('/')); ?>" class="logo">
			<?php if (has_custom_logo()) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<picture>
					<source media="(min-width: 768px)" srcset="<?php webp_dir() ?>/logo<?= $header_suffix ?>.png.webp" type="image/webp">
					<source media="(min-width: 768px)" srcset="<?php img_dir() ?>/logo<?= $header_suffix ?>.png">
					<source media="(max-width: 767px)" srcset="<?php webp_dir() ?>/logo<?= $header_suffix ?>.png.webp" type="image/webp">
					<source media="(max-width: 767px)" srcset="<?php img_dir() ?>/logo<?= $header_suffix ?>.png">
					<source srcset="<?php webp_dir() ?>/logo<?= $header_suffix ?>.png.webp" type="image/webp">
					<img src="<?php img_dir() ?>/logo<?= $header_suffix ?>.png" alt="<?php bloginfo('name'); ?>">
				</picture>
			<?php endif; ?>
		</a>
		<?php
		if (wp_is_mobile()) {
			get_template_part('template-parts/nav/nav-sp');
		} else {
			get_template_part('template-parts/nav/nav-pc');
		}
		?>
	</div>
</header>

