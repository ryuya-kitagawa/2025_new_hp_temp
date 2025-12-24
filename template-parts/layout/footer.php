<?php
/**
 * Footer Template Part
 * 
 * フッター部分のテンプレート
 */
?>

<footer class="l-footer p-footer" data-footer>
  <div class="inner">
    <div class="logo">
      <?php if (has_custom_logo()) : ?>
        <?php the_custom_logo(); ?>
      <?php else : ?>
        <picture>
          <source media="(min-width: 768px)" srcset="<?php webp_dir() ?>/footer_logo.png.webp" type="image/webp">
          <source media="(min-width: 768px)" srcset="<?php img_dir() ?>/footer_logo.png">
          <source media="(max-width: 767px)" srcset="<?php webp_dir() ?>/footer_logo.png.webp" type="image/webp">
          <source media="(max-width: 767px)" srcset="<?php img_dir() ?>/footer_logo.png">
          <source srcset="<?php webp_dir() ?>/footer_logo.png.webp" type="image/webp">
          <img src="<?php img_dir() ?>/footer_logo.png" alt="<?php bloginfo('name'); ?>">
        </picture>
      <?php endif; ?>
    </div>
  </div>

  <div class="copy_box">
    <p class="_copy">&copy;<?php echo date('Y'); ?> <?php bloginfo('name'); ?></p>
  </div>
</footer>

