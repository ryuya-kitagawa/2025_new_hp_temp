<?php
/**
 * Page Template
 * 
 * 固定ページ用テンプレート
 */
global $post;

$classname = '';
if ($post instanceof WP_Post && !empty($post->post_name)) {
  $classname = 'p-' . $post->post_name;
}
get_header();
?>

<div class="<?= esc_attr($classname); ?>">

  <?php get_template_part('template-parts/layout/header'); ?>

  <div class="l-wrapper">

    <main class="l-main">
      <div class="l-contents">
        
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
          <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="entry-header">
              <h1 class="entry-title"><?php the_title(); ?></h1>
            </header>

            <div class="entry-content">
              <?php the_content(); ?>
            </div>
          </article>
        <?php endwhile; endif; ?>

      </div>
    </main>

  </div>

  <?php get_template_part('template-parts/layout/footer'); ?>

</div>

<?php get_footer(); ?>
