// =============================================================================
// スクロールヘッダー
// =============================================================================
// フェーズ2：jQuery置換済み

// throttle関数（パフォーマンス対策）
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

let isInitialized = false;

export function initHeaderScroll() {
  // 二重実行防止
  if (isInitialized) {
    return;
  }
  isInitialized = true;
  const header = document.querySelector('.l-header');
  
  // ヘッダー要素が存在しない場合は何もしない
  if (!header) {
    return;
  }

  // スクロール処理
  const handleScroll = () => {
    // ------------------------------------
    // ★ 追加： _white_bg (記事詳細) がある場合はスクロール処理をしない
    // ------------------------------------
    if (header.classList.contains('_white_bg')) {
      return; // ここで処理終了
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isWhite = header.classList.contains('_white'); // 下層ページ判定
    const winWidth = window.innerWidth;

    // ------------------------------------
    // SP（<=767px）では TOPページの挙動を完全OFF
    // ------------------------------------
    if (winWidth <= 767 && !isWhite) {
      // TOPページの ._scrolled を削除して固定
      header.classList.remove('_scrolled');
      return; // ← TOPページは処理終了
    }

    // --- TOPページ（_white なし） ---
    if (!isWhite) {
      if (scrollTop > 0) {
        header.classList.add('_scrolled');
      } else {
        header.classList.remove('_scrolled');
      }
      return;
    }

    // --- 下層ページ（_white あり） ---
    let trigger = 0;
    const subClass = '_scrolled-sub';

    // 1920px 幅のときだけ 630px をトリガーに
    if (winWidth === 1920) {
      trigger = 630;
    }

    if (scrollTop > trigger) {
      header.classList.add(subClass);
    } else {
      header.classList.remove(subClass);
    }
  };

  // throttleでスクロールイベントを最適化（16ms = 約60fps）
  const throttledHandleScroll = throttle(handleScroll, 16);

  // スクロールイベントを登録
  window.addEventListener('scroll', throttledHandleScroll, { passive: true });
  
  // 初回実行（ページ読み込み時の状態を反映）
  handleScroll();
}
