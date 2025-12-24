<?php
/**
 * Front Page Template
 * 
 * トップページ用テンプレート
 */
get_header();
?>

<div class="p-top">

  <?php get_template_part('template-parts/layout/header'); ?>

  <div class="l-wrapper">

    <main class="l-main">

      <div class="l-contents">
        
        <section class="l-mv">
          <h1 class="mv-title"><?php bloginfo('name'); ?></h1>
          <p class="mv-description"><?php bloginfo('description'); ?></p>
        </section>

        <?php if (have_posts()) : ?>
          <section class="l-sec l-posts">
            <h2 class="section-title">最新記事</h2>
            <div class="post-list">
              <?php while (have_posts()) : the_post(); ?>
                <article class="post-item">
                  <a href="<?php the_permalink(); ?>" class="post-link">
                    <?php if (has_post_thumbnail()) : ?>
                      <div class="post-thumbnail">
                        <?php the_post_thumbnail('medium'); ?>
                      </div>
                    <?php endif; ?>
                    <div class="post-content">
                      <h3 class="post-title"><?php the_title(); ?></h3>
                      <time class="post-date" datetime="<?php the_time('Y-m-d'); ?>"><?php the_time('Y.m.d'); ?></time>
                    </div>
                  </a>
                </article>
              <?php endwhile; ?>
            </div>
          </section>
        <?php endif; ?>

      </div>
    </main>

  </div>

  <?php get_template_part('template-parts/layout/footer'); ?>

</div>

<?php get_footer(); ?>
