<?php
/**
 * Single Common Template
 * 
 * 投稿詳細ページの共通テンプレート
 */
get_header();
?>

<div class="p-single">

  <?php get_template_part('template-parts/layout/header'); ?>

  <div class="l-wrapper">
    <main class="l-main">
      <div class="l-contents">

        <?php get_template_part('template-parts/breadcrumb'); ?>

        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
          <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

            <header class="entry-header">
              <h1 class="entry-title"><?php the_title(); ?></h1>
              <div class="entry-meta">
                <time datetime="<?php the_time('Y-m-d'); ?>"><?php the_time('Y.m.d'); ?></time>
                <?php if (has_category()) : ?>
                  <span class="categories"><?php the_category(', '); ?></span>
                <?php endif; ?>
              </div>
            </header>

            <?php if (has_post_thumbnail()) : ?>
              <div class="entry-thumbnail">
                <?php the_post_thumbnail('large'); ?>
              </div>
            <?php endif; ?>

            <div class="entry-content">
              <?php the_content(); ?>
            </div>

            <?php
            // 前後の投稿へのリンク
            the_post_navigation([
              'prev_text' => '&laquo; %title',
              'next_text' => '%title &raquo;',
            ]);
            ?>

          </article>
        <?php endwhile; endif; ?>

      </div>
    </main>
  </div>

  <?php get_template_part('template-parts/layout/footer'); ?>

</div>

<?php get_footer(); ?>
