/* =========================================================
   S2 상품 상세 스크립트 (html/product.html)

   지금 하는 일
   - 4-2단계(일부): 주소의 ?id= 번호로 상품을 찾아
                    사진·배지·상품명·산지·옵션·가격·합계를 채우기

   앞으로 할 일
   - 4-2단계(나머지): 없는 번호면 #detailEmpty 만 보이기
   - 5-1단계: 수량 − / +, 합계 금액 갱신, 장바구니 담기
   - 5-2단계: 바로 구매 → order.html?buy=상품번호&qty=수량
   ========================================================= */

// 주소에서 상품 번호 읽기 (product.html?id=1 → 1)
function getProductIdFromUrl() {
  const params = new URLSearchParams(location.search);
  return params.get('id');
}

// 내용을 채운 칸은 [임시] 표시(class="temp")를 지웁니다.
function fillText(id, text) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.classList.remove('temp');
}

/* ---------- 상품 사진 ----------
   img/products/ 에 사진이 있으면 사진을 보여 주고,
   아직 없으면 메인 상품 카드처럼 배경색 + 이모지를 보여 줍니다. */
function renderDetailImage(p) {
  const box = document.getElementById('detailImage');
  box.style.background = p.color;
  box.innerHTML = `
    <span class="detail-emoji" aria-hidden="true">${p.emoji}</span>
    <img src="${BASE_PATH}${p.image}" alt="${escapeHTML(p.name)}"
         onload="document.getElementById('photoNotice').remove()"
         onerror="this.remove()">
    <p class="temp detail-photo-notice" id="photoNotice">[임시] 실제 상품 사진 준비 중</p>`;
}

/* ---------- 상품 정보 + 가격 ---------- */
function renderDetailInfo(p) {
  const rate = getDiscountRate(p);

  document.getElementById('detailBadges').innerHTML =
    p.badges.map(b => `<span class="badge">${escapeHTML(b)}</span>`).join('');

  fillText('detailName', p.name);
  fillText('detailOrigin', '📍 ' + p.origin);
  fillText('detailOption', p.option);
  fillText('detailSalePrice', formatPrice(p.salePrice));

  // 할인이 있을 때만 할인율과 정가를 보여 줍니다.
  if (rate > 0) {
    fillText('detailRate', rate + '%');
    fillText('detailPrice', formatPrice(p.price));
  } else {
    document.getElementById('detailRate').hidden = true;
    document.getElementById('detailPrice').hidden = true;
  }

  // 처음 수량은 1개 → 합계 = 판매가 (수량 변경은 5-1단계)
  fillText('detailTotal', formatPrice(p.salePrice));

  // 브라우저 탭 제목에도 상품명 표시
  document.title = `${p.name} - 고흥장터`;
}

/* ---------- 고객 후기 ----------
   data.js 의 REVIEWS 에서 이 상품의 후기만 골라 보여 줍니다.
   후기가 없으면 "아직 등록된 후기가 없습니다" 를 보여 줍니다. */
function renderReviews(p) {
  const reviews = REVIEWS.filter(r => r.productId === p.id);
  const list = document.getElementById('reviewList');

  document.getElementById('reviewCount').textContent = `(${reviews.length})`;
  document.getElementById('reviewEmpty').hidden = reviews.length > 0;

  list.innerHTML = reviews.map(r => `
    <li>
      <p class="stars" aria-label="별점 5점 만점에 ${r.rating}점">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</p>
      <p class="review-text">${escapeHTML(r.text)}</p>
      <p class="review-meta">${escapeHTML(r.author)}님 (${escapeHTML(r.age)})</p>
    </li>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const product = findProduct(getProductIdFromUrl());
  if (!product) return; // 없는 번호 처리는 4-2단계 나머지에서

  renderDetailImage(product);
  renderDetailInfo(product);
  renderReviews(product);
});
