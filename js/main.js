/* =========================================================
   메인 화면 스크립트 (index.html)
   - 제철 추천 배너 버튼
   - 상품 목록 그리기 / 분류 / 검색 / 정렬
   - 상품 카드 수량 선택, 장바구니 담기, 바로 구매
   ========================================================= */

const state = {
  category: 'all',
  keyword: '',
  sort: 'popular'
};

/* ---------- 상품 카드 ---------- */
function productCardHTML(p) {
  const rate = getDiscountRate(p);
  const detailUrl = `${BASE_PATH}html/product.html?id=${p.id}`;
  const badges = p.badges.map(b => `<span class="badge">${escapeHTML(b)}</span>`).join('');

  return `
    <li class="product-card" data-id="${p.id}">
      <a href="${detailUrl}" class="product-thumb" style="background:${p.color}">
        <span class="thumb-emoji" aria-hidden="true">${p.emoji}</span>
        <img src="${BASE_PATH}${p.image}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.remove()">
        ${badges ? `<span class="badges">${badges}</span>` : ''}
      </a>
      <div class="product-body">
        <p class="product-origin">📍 ${escapeHTML(p.origin)}</p>
        <h3 class="product-name"><a href="${detailUrl}">${escapeHTML(p.name)}</a></h3>
        <p class="product-option">${escapeHTML(p.option)}</p>
        <div class="product-price">
          ${rate ? `<span class="rate">${rate}%</span>` : ''}
          <strong>${formatPrice(p.salePrice)}</strong>
          ${rate ? `<del>${formatPrice(p.price)}</del>` : ''}
        </div>
        <div class="product-actions">
          <div class="qty-box" role="group" aria-label="${escapeHTML(p.name)} 수량 선택">
            <button type="button" data-action="minus" aria-label="수량 줄이기">−</button>
            <span class="qty-num" aria-live="polite">1</span>
            <button type="button" data-action="plus" aria-label="수량 늘리기">+</button>
          </div>
          <button type="button" class="btn btn-primary btn-cart" data-action="cart">장바구니 담기</button>
          <button type="button" class="btn btn-outline btn-buy" data-action="buy">바로 구매</button>
        </div>
      </div>
    </li>`;
}

/* ---------- 전체 상품 (분류/검색/정렬 반영) ---------- */
function getFilteredProducts() {
  const keyword = state.keyword.trim().replace(/\s/g, '').toLowerCase();

  let result = PRODUCTS.filter(p => {
    const inCategory = state.category === 'all'
      || (state.category === 'season' ? p.season : p.category === state.category);
    const text = (p.name + p.option + p.origin + CATEGORIES[p.category]).replace(/\s/g, '').toLowerCase();
    const inKeyword = !keyword || text.includes(keyword);
    return inCategory && inKeyword;
  });

  const sorters = {
    popular: (a, b) => b.popular - a.popular,
    low: (a, b) => a.salePrice - b.salePrice,
    high: (a, b) => b.salePrice - a.salePrice,
    discount: (a, b) => getDiscountRate(b) - getDiscountRate(a)
  };
  return result.sort(sorters[state.sort]);
}

function renderProducts() {
  const products = getFilteredProducts();
  document.getElementById('productList').innerHTML = products.map(productCardHTML).join('');
  document.getElementById('emptyResult').hidden = products.length > 0;

  // 결과 안내 문구
  const labels = { all: '전체 상품', season: '제철 상품' };
  const label = labels[state.category] || CATEGORIES[state.category];
  const keywordText = state.keyword ? `'${escapeHTML(state.keyword)}' 검색 결과 · ` : '';
  document.getElementById('resultText').innerHTML =
    `${keywordText}${label} <strong>${products.length}</strong>개`;

  // 탭 선택 표시
  document.querySelectorAll('#filterTabs [data-category]').forEach(tab => {
    tab.setAttribute('aria-selected', String(tab.dataset.category === state.category));
  });
  document.querySelectorAll('.gnb [data-category]').forEach(link => {
    link.classList.toggle('is-active', link.dataset.category === state.category);
  });
}

function setCategory(category, scroll = true) {
  state.category = category;
  renderProducts();
  if (scroll) {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  }
}

function searchKeyword(keyword) {
  state.keyword = keyword.trim();
  state.category = 'all';
  document.getElementById('searchInput').value = state.keyword;
  renderProducts();
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

/* ---------- 상품 카드 버튼 (수량 / 담기 / 바로구매) ---------- */
function initProductActions() {
  document.querySelectorAll('.product-grid').forEach(grid => {
    grid.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const card = btn.closest('.product-card');
      const id = Number(card.dataset.id);
      const qtyEl = card.querySelector('.qty-num');
      let qty = Number(qtyEl.textContent);

      switch (btn.dataset.action) {
        case 'plus':
          qtyEl.textContent = Math.min(qty + 1, 99);
          break;
        case 'minus':
          qtyEl.textContent = Math.max(qty - 1, 1);
          break;
        case 'cart':
          Cart.add(id, qty);
          qtyEl.textContent = 1;
          showToast(`✅ <strong>${escapeHTML(findProduct(id).name)}</strong> ${qty}개를 장바구니에 담았습니다.`, true);
          break;
        case 'buy':
          Cart.add(id, qty);
          location.href = `${BASE_PATH}html/order.html`;
          break;
      }
    });
  });
}

/* ---------- 분류 / 검색 / 정렬 ---------- */
function initFilters() {
  // 상단 메뉴, 분류 탭, 카테고리 바로가기 버튼
  document.querySelectorAll('.gnb [data-category], #filterTabs [data-category], .cate-grid [data-category]')
    .forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const fromTab = el.closest('#filterTabs');
        setCategory(el.dataset.category, !fromTab);
      });
    });

  // 제철 추천 배너 버튼 → 제철 상품만 보기
  document.getElementById('seasonLink').addEventListener('click', e => {
    e.preventDefault();
    state.keyword = '';
    document.getElementById('searchInput').value = '';
    setCategory('season');
  });

  // 검색
  document.getElementById('searchForm').addEventListener('submit', e => {
    e.preventDefault();
    searchKeyword(document.getElementById('searchInput').value);
  });

  // 정렬
  document.getElementById('sortSelect').addEventListener('change', e => {
    state.sort = e.target.value;
    renderProducts();
  });

  // 결과 없음 → 초기화
  document.getElementById('resetFilter').addEventListener('click', () => {
    state.keyword = '';
    state.category = 'all';
    document.getElementById('searchInput').value = '';
    renderProducts();
  });
}

/* ---------- 제철 배너 사진 슬라이드 ----------
   4초마다 다음 사진으로 바꿉니다. [멈춤] 버튼으로 멈추고 다시 재생할 수 있습니다.
   기기에서 "움직임 줄이기"를 켠 사용자에게는 자동으로 바꾸지 않습니다. */
const SLIDE_INTERVAL = 4000; // 사진이 바뀌는 간격 (1000 = 1초)

function initSeasonSlider() {
  const slider = document.getElementById('seasonSlider');
  if (!slider) return;

  // 파일이 없는 사진은 빼고 남은 사진만 돌립니다.
  slider.querySelectorAll('.season-slide').forEach(img => {
    img.addEventListener('error', () => img.remove());
  });

  const pauseBtn = document.getElementById('seasonPause');
  let current = 0;
  let timer = null;

  function showNext() {
    const slides = slider.querySelectorAll('.season-slide');
    if (slides.length < 2) return;
    slides[current % slides.length].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
  }

  function play() {
    timer = setInterval(showNext, SLIDE_INTERVAL);
    pauseBtn.textContent = '❚❚ 멈춤';
    pauseBtn.setAttribute('aria-pressed', 'false');
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    pauseBtn.textContent = '▶ 재생';
    pauseBtn.setAttribute('aria-pressed', 'true');
  }

  pauseBtn.addEventListener('click', () => (timer ? stop() : play()));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stop();
  } else {
    play();
  }
}

/* ---------- 하위 페이지에서 넘어온 품목·검색어 적용 ----------
   하위 페이지의 품목 메뉴는 index.html?category=yuja#products,
   검색은 index.html?q=검색어 로 이동합니다. */
function applyUrlParams() {
  const params = new URLSearchParams(location.search);
  const keyword = params.get('q');
  const category = params.get('category');

  if (keyword) {
    searchKeyword(keyword);
  } else if (category === 'all' || CATEGORIES[category]) {
    setCategory(category);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initProductActions();
  initFilters();
  initSeasonSlider();
  applyUrlParams();
});
