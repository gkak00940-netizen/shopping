# js 폴더

화면 동작 파일. 모든 페이지가 `data.js` → `common.js` → 화면별 파일 순서로 불러온다.

| 파일 | 쓰는 페이지 | 내용 | 상태 |
| --- | --- | --- | --- |
| `data.js` | 모든 페이지 | `CATEGORIES`(품목 5개), `PRODUCTS`(상품 5개: 이름·산지·옵션·가격·이모지·사진 경로·배지·인기·제철), `REVIEWS`(후기 3개) | 상품 v1.00 / 후기 v1.01 추가 / 상품 설명·보관 방법은 아직 (4-1) |
| `common.js` | 모든 페이지 | `BASE_PATH`(하위 폴더 경로 맞춤), 장바구니(`Cart`, localStorage `goheung_cart`), 장바구니 패널, 글자 크기(`goheung_font`), 알림, 맨 위로, 가격 표시 등 공통 도구 | v1.00 완성 (수정 안 함) |
| `main.js` | `index.html` | 상품 목록 그리기·분류·검색·정렬, 수량·장바구니 담기·바로 구매, 하위 페이지에서 넘어온 `?category=` `?q=` 적용 | v1.00 + v1.01(`applyUrlParams`) / 바로 구매 변경은 아직 (5-2) |
| `product.js` | `html/product.html` | `?id=`로 상품을 찾아 사진·배지·이름·산지·옵션·가격·합계·후기 채우기 | 완료: 표시 / 아직: 상품 없음 처리(4-2), 수량·담기(5-1), 바로 구매(5-2) |
| `order.js` | `html/order.html` | 주석만 (할 일 목록) | 아직 (5-3 ~ 5-5, 6-4) |
| `order-complete.js` | `html/order-complete.html` | 주석만 | 아직 (6-5, 9-2) |
| `order-check.js` | `html/order-check.html` | 주석만 | 아직 (6-6, 9-3) |

## 규칙

- 각 파일 맨 위 주석에 "지금 하는 일 / 앞으로 할 일(단계 번호)"을 적어 둔다.
- 상품 가격을 바꾸면 Supabase `products` 표도 같이 고친다.
- 메인의 후기는 `index.html`에 직접 쓰여 있으므로, 후기를 바꾸면 `REVIEWS`와 두 곳을 고친다.
- Supabase 연결 파일 `supabase-config.js`는 BUILD_STEPS 6-3단계에서 추가 예정 (공개 키만 넣는다).
