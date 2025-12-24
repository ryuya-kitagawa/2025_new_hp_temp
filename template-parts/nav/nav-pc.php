<?php
/**
 * PC Navigation
 * 
 * PC用のナビゲーションメニュー
 */
?>

<nav class="l-nav <?= (!is_front_page() || !is_home()) ? '_white' : '' ?> __pc">
    <ul class="lists">
        <li class="items">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="link">
                <?php if (is_front_page() || is_home()) { ?><p class="en">Home</p><?php } ?>
                <p class="ja">トップ</p>
            </a>
        </li>
        <?php
        // 固定ページへのリンクを動的に生成（例）
        $nav_pages = get_pages(['sort_column' => 'menu_order']);
        foreach ($nav_pages as $nav_page) {
            if ($nav_page->post_parent == 0) { // 親ページのみ
        ?>
            <li class="items">
                <a href="<?php echo esc_url(get_permalink($nav_page->ID)); ?>" class="link">
                    <?php if (is_front_page() || is_home()) { ?><p class="en"><?php echo esc_html($nav_page->post_title); ?></p><?php } ?>
                    <p class="ja"><?php echo esc_html($nav_page->post_title); ?></p>
                </a>
            </li>
        <?php
            }
        }
        ?>
    </ul>
</nav>

