// =============================================================================
// common.js - エントリーポイント
// =============================================================================
// 各モジュールを読み込んで初期化

import { initHeaderScroll } from './modules/header-scroll.js';
import { initHamburgerMenu } from './modules/hamburger-menu.js';

// DOMContentLoadedで初期化（iOS Safari対応）
function initAll() {
  initHeaderScroll();
  initHamburgerMenu();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  // 既に読み込み済みの場合（iOS Safari対応のため少し遅延）
  if (document.readyState === 'complete') {
    // 完全に読み込み済みの場合は即座に実行
    initAll();
  } else {
    // 読み込み中の場合はDOMContentLoadedを待つ
    document.addEventListener('DOMContentLoaded', initAll);
  }
}
