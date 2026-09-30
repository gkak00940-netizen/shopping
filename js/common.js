/* =========================================================
   공통 스크립트 (모든 페이지에서 사용)
   - 장바구니 저장/계산
   - 장바구니 패널 열기/닫기
   - 글자 크기 조절
   - 알림 메시지(토스트), 맨 위로 버튼
   ========================================================= */

// html 폴더 안의 페이지에서도 경로가 맞도록 기준 경로를 구합니다.
const BASE_PATH = location.pathname.includes('/html/') ? '../' : '';

const FREE_SHIPPING_MIN = 30000; // 무료배송 기준 금액
const SHIPPING_FEE = 3000;       // 기본 배송비
const CART_KEY = 'goheung_cart';
const FONT_KEY = 'goheung_font';

/* ---------- 공통 유틸 ---------- */
function formatPrice(num) {
  return num.toLocaleString('ko-KR') + '원';
}

function findProduct(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function getDiscountRate(product) {
  if (product.salePrice >= product.price) return 0;
  return Math.round((1 - product.salePrice / product.price) * 100);
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

// localStorage 는 브라우저 설정에 따라 막힐 수 있어 안전하게 감쌉니다.
function storageGet(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { /* 저장 실패 시 무시 */ }
}

/* ---------- 장바구니 ---------- */
const Cart = {
  // [{ id: 1, qty: 2 }, ...]
  items: storageGet(CART_KEY, []).filter(item => findProduct(item.id)),

  save() {
    storageSet(CART_KEY, this.items);
    updateCartUI();
  },

  add(id, qty = 1) {
    const found = this.items.find(item => item.id === id);
    if (found) {
      found.qty = Math.min(found.qty + qty, 99);
    } else {
      this.items.push({ id, qty });
    }
    this.save();
  },

  setQty(id, qty) {
    const found = this.items.find(item => item.id === id);
    if (!found) return;
    found.qty = Math.max(1, Math.min(qty, 99));
    this.save();
  },

  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
  },

  count() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  },

  productTotal() {
    return this.items.reduce((sum, item) => {
      return sum + findProduct(item.id).salePrice * item.qty;
    }, 0);
  },

  shipping() {
    const total = this.productTotal();
    if (total === 0 || total >= FREE_SHIPPING_MIN) return 0;
    return SHIPPING_FEE;
  }
};

/* ---------- 장바구니 화면 ---------- */
function updateCartUI() {
  // 뱃지 숫자
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    const count = Cart.count();
    el.textContent = count;
    el.classList.toggle('is-show', count > 0);
  });

  const list = document.getElementById('cartItems');
  if (!list) return;

  const empty = document.getElementById('cartEmpty');
  const orderBtn = document.getElementById('orderBtn');
  const hasItem = Cart.items.length > 0;

  empty.hidden = hasItem;
  orderBtn.classList.toggle('is-disabled', !hasItem);
  orderBtn.setAttribute('aria-disabled', String(!hasItem));

  list.innerHTML = Cart.items.map(item => {
    const p = findProduct(item.id);
    return `
      <li class="cart-item" data-id="${p.id}">
        <div class="cart-thumb" style="background:${p.color}" aria-hidden="true">${p.emoji}</div>
        <div class="cart-info">
          <p class="cart-name">${escapeHTML(p.name)}</p>
          <p class="cart-option">${escapeHTML(p.option)}</p>
          <div class="qty-box" role="group" aria-label="${escapeHTML(p.name)} 수량">
            <button type="button" data-cart-action="minus" aria-label="수량 줄이기">−</button>
            <span class="qty-num" aria-live="polite">${item.qty}</span>
            <button type="button" data-cart-action="plus" aria-label="수량 늘리기">+</button>
          </div>
        </div>
        <div class="cart-right">
          <strong class="cart-price">${formatPrice(p.salePrice * item.qty)}</strong>
          <button type="button" class="cart-del" data-cart-action="remove">삭제</button>
        </div>
      </li>`;
  }).join('');

  const productTotal = Cart.productTotal();
  const shipping = Cart.shipping();
  document.getElementById('sumProducts').textContent = formatPrice(productTotal);
  document.getElementById('sumShipping').textContent = shipping ? formatPrice(shipping) : '무료';
  document.getElementById('sumTotal').textContent = formatPrice(productTotal + shipping);

  const shipNotice = document.getElementById('shipNotice');
  if (!hasItem) {
    shipNotice.textContent = '';
  } else if (shipping > 0) {
    shipNotice.innerHTML = `<strong>${formatPrice(FREE_SHIPPING_MIN - productTotal)}</strong> 더 담으시면 <strong>무료배송</strong>!`;
  } else {
    shipNotice.innerHTML = '🎉 <strong>무료배송</strong> 상품입니다';
  }
}

function initCartPanel() {
  const panel = document.getElementById('cartPanel');
  if (!panel) return;
  const dim = document.getElementById('cartDim');
  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    dim.hidden = false;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    panel.focus();
  }

  function close() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    dim.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  window.openCart = open;

  document.querySelectorAll('.cart-open-btn').forEach(btn => btn.addEventListener('click', open));
  document.getElementById('cartClose').addEventListener('click', close);
  document.getElementById('keepShopping').addEventListener('click', close);
  dim.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
  });

  // 수량 변경 / 삭제
  document.getElementById('cartItems').addEventListener('click', e => {
    const btn = e.target.closest('[data-cart-action]');
    if (!btn) return;
    const id = Number(btn.closest('.cart-item').dataset.id);
    const item = Cart.items.find(i => i.id === id);
    const action = btn.dataset.cartAction;

    if (action === 'plus') Cart.setQty(id, item.qty + 1);
    if (action === 'minus') Cart.setQty(id, item.qty - 1);
    if (action === 'remove') {
      if (confirm(`'${findProduct(id).name}' 상품을 장바구니에서 뺄까요?`)) {
        Cart.remove(id);
        showToast('상품을 장바구니에서 뺐습니다.');
      }
    }
  });

  // 비어있으면 주문 막기
  document.getElementById('orderBtn').addEventListener('click', e => {
    if (Cart.items.length === 0) {
      e.preventDefault();
      showToast('장바구니에 상품을 먼저 담아 주세요.');
    }
  });
}

/* ---------- 알림 메시지 ---------- */
let toastTimer = null;
function showToast(message, withCartLink = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<span>${message}</span>` +
    (withCartLink ? '<button type="button" class="toast-btn">장바구니 보기</button>' : '');
  toast.classList.add('is-show');

  const btn = toast.querySelector('.toast-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      toast.classList.remove('is-show');
      if (window.openCart) window.openCart();
    });
  }

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 3500);
}

/* ---------- 글자 크기 조절 ---------- */
function initFontSize() {
  const buttons = document.querySelectorAll('[data-font]');
  const apply = size => {
    document.documentElement.dataset.fontSize = size;
    buttons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.font === size)));
    storageSet(FONT_KEY, size);
  };
  apply(storageGet(FONT_KEY, 'normal'));
  buttons.forEach(btn => btn.addEventListener('click', () => apply(btn.dataset.font)));
}

/* ---------- 맨 위로 ---------- */
function initToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-show', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

document.addEventListener('DOMContentLoaded', () => {
  initFontSize();
  initCartPanel();
  initToTop();
  updateCartUI();
});
