// =============================================================================
// ハンバーガーメニュー
// =============================================================================

// モジュールスコープで初期化フラグを管理（クロージャーを使用）
const hamburgerMenuState = {
  isInitialized: false
};

export function initHamburgerMenu() {
  // 二重実行防止
  if (hamburgerMenuState.isInitialized) {
    console.log('[Hamburger Menu] 既に初期化済みです');
    return;
  }

  // 【重要】ビルド時の変数名圧縮による衝突を防ぐため、hum.js の変数名と異なる名前にする
  const hamburgerBtn = document.querySelector('.openbtn4');
  const hamburgerNav = document.querySelector('.l-spnav');
  const hamburgerBody = document.body;

  // デバッグ: 要素が見つからない場合に警告
  if (!hamburgerBtn) {
    console.warn('[Hamburger Menu] .openbtn4 が見つかりません');
    return;
  }
  if (!hamburgerNav) {
    console.warn('[Hamburger Menu] .l-spnav が見つかりません');
    return;
  }

  hamburgerMenuState.isInitialized = true;

  let hamburgerScrollPosition = 0;

  // デバッグ: 初期化成功をログに出力
  console.log('[Hamburger Menu] 初期化完了', { openBtn: hamburgerBtn, spNav: hamburgerNav });

  // トグル処理の共通関数
  // 【重要】ビルド時の変数名圧縮による衝突を防ぐため、パラメータ名を明確にする
  // 【重要】関数名が c に圧縮される可能性があるため、関数内の変数名は c 以外にする
  function toggleHamburgerMenu(toggleEventParam) {
    if (toggleEventParam) {
      // cancelableでない場合はpreventDefaultを呼ばない（スクロール中など）
      if (toggleEventParam.cancelable) {
        toggleEventParam.preventDefault();
      }
      toggleEventParam.stopPropagation();
    }

    console.log('[Hamburger Menu] ボタンがクリックされました');

    // 【重要】関数名 toggleHamburgerMenu が c に圧縮される可能性があるため、変数名を明確にする
    const hamburgerMenuOpeningFlag = !hamburgerBtn.classList.contains('active');

    // ボタンとメニューにactiveクラスを付け外し
    hamburgerBtn.classList.toggle('active');
    hamburgerNav.classList.toggle('active');

    console.log('[Hamburger Menu] クラスを切り替えました', {
      openBtnActive: hamburgerBtn.classList.contains('active'),
      spNavActive: hamburgerNav.classList.contains('active')
    });

    // 背景のスクロールを制御
    if (hamburgerMenuOpeningFlag) {
      // メニューを開く時：スクロール位置を保存して固定
      hamburgerScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      hamburgerBody.style.top = `-${hamburgerScrollPosition}px`;
      hamburgerBody.classList.add('no-scroll');
    } else {
      // メニューを閉じる時：スクロール位置を復元
      hamburgerBody.classList.remove('no-scroll');
      hamburgerBody.style.top = '';
      window.scrollTo(0, hamburgerScrollPosition);
    }
  }

  // 1. ボタンをクリック/タッチしたときの処理（iOS Safari対応）
  // 【重要】ブロックスコープで囲み、ビルド時の変数名圧縮による衝突を防ぐ
  {
    // touchstartを優先して即座に反応させる
    hamburgerBtn.addEventListener('touchstart', function (touchStartEvent) {
      toggleHamburgerMenu(touchStartEvent);
    }, { passive: false });

    // clickイベントも追加（デスクトップ対応）
    hamburgerBtn.addEventListener('click', function (clickEvent) {
      toggleHamburgerMenu(clickEvent);
    });
  }

  // 2. メニュー内のリンクをクリックしたときの処理
  // 【重要】ブロックスコープで囲み、forEachのコールバックパラメータの衝突を防ぐ
  {
    const hamburgerNavLinks = hamburgerNav.querySelectorAll('a');
    hamburgerNavLinks.forEach(function (hamburgerLinkElement) {
      hamburgerLinkElement.addEventListener('click', function () {
        hamburgerBtn.classList.remove('active');
        hamburgerNav.classList.remove('active');
        hamburgerBody.classList.remove('no-scroll');
        hamburgerBody.style.top = '';
        window.scrollTo(0, hamburgerScrollPosition);
      });
    });
  }
}

