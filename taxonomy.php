<?php
/**
 * Taxonomy Template
 * 
 * タクソノミーアーカイブページ用テンプレート
 */
get_header();
?>

<div class="p-taxonomy">

  <?php get_template_part('template-parts/layout/header'); ?>

  <div class="l-wrapper">
    <main class="l-main">
      <div class="l-contents">

        <header class="archive-header">
          <h1 class="archive-title"><?php single_term_title(); ?></h1>
        </header>

        <?php get_template_part('template-parts/breadcrumb'); ?>

        <?php if (have_posts()) : ?>
          <div class="post-list">
            <?php while (have_posts()) : the_post(); ?>
              <article id="post-<?php the_ID(); ?>" <?php post_class('post-item'); ?>>
                <a href="<?php the_permalink(); ?>" class="post-link">
                  <?php if (has_post_thumbnail()) : ?>
                    <div class="post-thumbnail">
                      <?php the_post_thumbnail('medium'); ?>
                    </div>
                  <?php endif; ?>
                  <div class="post-content">
                    <h2 class="post-title"><?php the_title(); ?></h2>
                    <time class="post-date" datetime="<?php the_time('Y-m-d'); ?>"><?php the_time('Y.m.d'); ?></time>
                    <div class="post-excerpt"><?php the_excerpt(); ?></div>
                  </div>
                </a>
              </article>
            <?php endwhile; ?>
          </div>

          <?php render_pagination(); ?>
        <?php else : ?>
          <p>記事が見つかりませんでした。</p>
        <?php endif; ?>

      </div>
    </main>
  </div>

  <?php get_template_part('template-parts/layout/footer'); ?>

</div>

<?php get_footer(); ?>
