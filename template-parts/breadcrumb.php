<?php
/**
 * Breadcrumb Template Part
 * 
 * パンくずリスト
 */
?>

<div class="l-breadcrumbs">
  <?php
  if (function_exists('yoast_breadcrumb')) {
    yoast_breadcrumb('<nav class="breadcrumb">', '</nav>');
  } elseif (function_exists('bcn_display')) {
    bcn_display();
  } else {
    // フォールバック: シンプルなパンくずリスト
    ?>
    <nav class="breadcrumb">
      <a href="<?php echo esc_url(home_url('/')); ?>">HOME</a>
      <?php if (!is_front_page()) : ?>
        <?php if (is_single() || is_page()) : ?>
          <span>&gt;</span>
          <span><?php the_title(); ?></span>
        <?php elseif (is_archive()) : ?>
          <span>&gt;</span>
          <span><?php the_archive_title(); ?></span>
        <?php endif; ?>
      <?php endif; ?>
    </nav>
    <?php
  }
  ?>
</div>

