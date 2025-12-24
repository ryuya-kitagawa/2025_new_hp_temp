<?php
/**
 * 404 Template
 * 
 * 404エラーページ用テンプレート
 */
get_header();
?>

<div class="p-404">

  <?php get_template_part('template-parts/layout/header'); ?>

  <div class="l-wrapper">

    <main class="l-main">
      <div class="l-contents">

        <section class="l-sec l-404">
          <h1 class="error-title">404 NOT FOUND</h1>
          <p class="error-text">お探しのページは見つかりませんでした。</p>
          <p class="error-description">URLが間違っているか、ページが削除された可能性があります。</p>
          <a href="<?php echo esc_url(home_url('/')); ?>" class="error-link">トップページへ戻る</a>
        </section>

      </div>
    </main>

  </div>

  <?php get_template_part('template-parts/layout/footer'); ?>

</div>

<?php get_footer(); ?>
