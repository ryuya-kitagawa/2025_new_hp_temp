<?php
/**
 * Index Template (Fallback)
 * 
 * フォールバック用テンプレート
 */
get_header();
?>

<div class="p-index">

  <?php get_template_part('template-parts/layout/header'); ?>

  <div class="l-wrapper">
    <main class="l-main">
      <div class="l-contents">
        <?php
        if (have_posts()) :
          while (have_posts()) : the_post();
            the_content();
          endwhile;
        else :
          echo '<p>コンテンツが見つかりませんでした。</p>';
        endif;
        ?>
      </div>
    </main>
  </div>

  <?php get_template_part('template-parts/layout/footer'); ?>

</div>

<?php get_footer(); ?>
