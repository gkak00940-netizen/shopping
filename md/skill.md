---
name: goheung-market-build
description: 고흥장터(고흥 농산물 비회원 직거래 쇼핑몰) 프로젝트를 이어서 기획·점검·제작할 때 사용한다. 기획 문서(PROJECT_PLAN, wireframe, BUILD_SPEC, BUILD_STEPS)를 기준으로 한 단계씩 만들고, 범위를 늘리지 않으며, 임시 콘텐츠 표시·초보자용 코드·Supabase 보안 규칙을 지키는 작업 방식을 정리한 것이다.
---

# 고흥장터 제작 Skill

고흥 농가의 유자·석류·햅쌀·마늘·김을 **회원가입 없이** 주문하는 쇼핑몰.
주 사용자는 **50~60대** — "혼자서 주문을 끝낼 수 있게"가 모든 판단의 기준이다.

---

## 1. 작업 전에 반드시 읽을 문서

| 문서 | 역할 | 언제 보나 |
| --- | --- | --- |
| `PROJECT_PLAN.md` | 목적, 사용자, 핵심 기능(F1~F7), 제외 범위, User Flow | 기능을 추가·변경하려 할 때 |
| `wireframe.html` | 화면별 Section 순서와 버튼 위치 | 화면 구조를 만들 때 |
| `BUILD_SPEC.md` | 개발 명세 (Section 콘텐츠, CTA 동작, DB 구조, PC·휴대폰 배치) | **모든 작업의 기준** |
| `BUILD_STEPS.md` | 작은 작업 단위 순서 (1~9 묶음) | "몇 단계를 진행해줘" 요청을 받았을 때 |
| `supabase/*.sql` | 표·RLS·서버 함수 | DB 작업 때 |

현재 진행 상황은 `git log --oneline`과 `BUILD_STEPS.md`를 대조해서 확인한다.

---

## 2. 작업 원칙 (사용자와 합의한 규칙)

1. **한 번에 한 단계만.** 요청받은 BUILD_STEPS 단계(또는 Section)만 만든다. 전체 사이트를 한 번에 만들지 않는다.
2. **범위를 키우지 않는다.** PROJECT_PLAN·BUILD_SPEC에 없는 기능은 추가하지 않는다. 필요해 보이면 만들지 말고 먼저 제안한다.
3. **사용자가 기획 밖의 변경을 요청하면** 만들고 나서 "문서에 없던 내용"임을 알리고, 문서(PLAN·wireframe·SPEC·STEPS)를 함께 고칠지 묻는다. 승인하면 4개 문서를 모두 같은 내용으로 맞춘다.
4. **다른 Section은 건드리지 않는다.** 요청받은 부분만 수정하고, 손대지 않은 것과 그 이유를 보고한다.
5. **사실을 지어내지 않는다.** 준비되지 않은 텍스트·이미지·후기는 만들지 말고 임시 콘텐츠로 표시한다 (3번 참고).
6. **문제부터 말한다.** 점검 요청에는 문제점 → 꼭 필요한 수정만 제안 순서로 답한다.
7. **결정이 필요한 것은 묻는다.** 문서에 정해지지 않은 동작은 추천안과 함께 묻고, 마음대로 정하지 않는다.
8. **끝나면 보고한다.** 만든 파일 / 수정한 파일 / 손대지 않은 것 / 직접 확인할 방법을 알려 준다. 브라우저로 확인하지 못했으면 그렇다고 말한다.
9. **코드를 쓰지 말라는 단계에서는 문서만 만든다.**

---

## 3. 코드 작성 규칙

### 초보자가 고치기 쉬운 코드
- 프레임워크·빌드 도구 없이 **HTML + CSS + 순수 JavaScript**.
- 파일·함수 맨 위에 한국어 주석으로 "지금 하는 일 / 앞으로 할 일(단계 번호)"을 적는다.
- 공통 영역(헤더·푸터·장바구니 패널 등)은 include 없이 각 페이지에 **복사**해서 넣는다. 고칠 때는 `index.html`과 `html/*.html` 8곳을 모두 고친다.

### 임시 콘텐츠 표시
- 임시 글자는 `[임시]`로 시작하고 `class="temp"`를 붙인다 (빨간 점선 상자로 보임, `css/sub.css`).
- 조건에 따라 보이는 영역(결과 없음 등)을 미리 보여 줄 때는 `[임시 확인용]` 문구를 붙인다.
- 실제 내용으로 바꾸면 `temp` class를 지운다. JS로 채울 때는 `classList.remove('temp')`.
- BUILD_SPEC에 확정된 문구(배송 안내, 입금 계좌, 오류 문구 등)는 임시 표시 없이 실제 내용으로 쓴다.

### 폴더 구조
```
index.html               S1 메인 (v1.00)
html/                    하위 페이지: product, order, order-complete, order-check, notice, terms, privacy
css/common.css           공통 (v1.00, 색·글자 크기 변수)
css/main.css             메인 전용
css/sub.css              하위 페이지 공통 (.temp, 기본 여백)
css/product.css · order.css · info.css   화면별
js/data.js               PRODUCTS, CATEGORIES, REVIEWS (화면 표시용 고정 데이터)
js/common.js             BASE_PATH, Cart, 장바구니 패널, 글자 크기, 토스트, 맨 위로
js/main.js               메인 상품 목록·분류·검색·정렬 (?category=, ?q= 받기)
js/product.js · order.js · order-complete.js · order-check.js   화면별
supabase/schema.sql      표·RLS (functions.sql 은 서버 함수)
img/main/ · img/products/  사진 (없으면 배경색 + 이모지로 대체)
```

### 꼭 기억할 동작
- 하위 페이지 경로는 `../` 기준. JS에서는 `common.js`의 `BASE_PATH`를 쓴다.
- 하위 페이지의 품목 메뉴 → `../index.html?category=yuja#products`, 검색 → `<form action="../index.html" method="get">`의 `q`.
- 상품 상세는 `product.html?id=번호`. 순서: 사진·정보·구매 영역 → **고객 후기** → 상품 설명 → 배송·교환 안내.
- **바로 구매**는 장바구니에 담지 않고 `order.html?buy=상품번호&qty=수량`으로 이동, 그 상품만 주문한다.
- 메인 "고객 후기"는 HTML에 직접, 상세 후기는 `data.js REVIEWS`에 있다 → 후기 수정 시 두 곳을 고친다.

### 디자인 기준 (v1.00 유지)
- 본문 최대 폭 1240px, 기본 글자 18px (크게 20 / 아주 크게 22), 버튼 높이 52px 이상.
- 초록 `--green` = CTA, 노랑 `--yellow` = 제철·포인트, 빨강 `--red` = 할인·오류.
- **한 화면에 강조색 CTA는 1개만.** 전화번호는 모두 `tel:` 링크.
- 휴대폰 구간: 1024px / 768px / 400px. 768px 이하에서 하단 메뉴 5칸(홈·전체상품·장바구니·전화주문·주문조회).
- 세부 디자인·움직임·hover 효과는 8단계 전까지 넣지 않는다.

---

## 4. Supabase 규칙 (비회원 주문)

- **저장소 구분:** 주문 = Supabase / 장바구니·글자 크기 = localStorage / 방금 한 주문 요약 = sessionStorage `goheung_last_order` / 상품·후기 표시 = `data.js`.
- **표:** `products`(가격), `orders`, `order_items`, `order_lookup_attempts`. 모두 RLS 켜고 정책 없음 + anon·authenticated 권한 회수.
- **서버 함수만 공개:** `create_order`(가격은 서버에서 `products`로 다시 계산), `get_orders(휴대폰, 비밀번호)`. 둘 다 `security definer`, anon에는 이 두 함수 실행 권한만.
- **주문 조회 = 휴대폰 번호 + 주문 조회 비밀번호(숫자 4자리).** 비밀번호는 `pgcrypto`로 해시 저장. 같은 번호로 5번 틀리면 10분 잠금. 결과는 주문 목록(주문번호·주문일·상품·금액·상태)만, 받는 분·주소는 돌려주지 않는다.
- **S5 주문 완료는 서버에서 다시 불러오지 않는다** (주문번호만으로 남의 주문이 보이면 안 됨). sessionStorage 값과 `?no=`가 같을 때만 보여 준다.
- **키:** 화면 코드에는 Project URL + publishable(anon) key만. secret/service_role key는 절대 코드·채팅·git에 넣지 않는다.
- **가격 변경 시** `data.js`와 `products` 표를 함께 고친다.
- 주문 상태(입금 대기 → 배송 준비 → 배송 중)는 판매자가 Supabase Table Editor에서 바꾼다. 관리자 페이지는 만들지 않는다.
- SQL은 여러 번 실행해도 안전하게 (`if not exists`, `on conflict`) 작성하고, 사용자가 SQL Editor에서 직접 실행한다. 붙여 넣기 어려워하면 클립보드에 복사해 준다.

---

## 5. 범위에서 제외 (만들지 않음)

회원가입·로그인 / 카드·간편결제 / 주소 검색 API / 관리자 페이지 / 후기 작성 / 문자 인증 (다음 버전 후보)

---

## 6. 작업 흐름 (지금까지 쓴 순서)

| 단계 | 요청 예시 | 결과물 |
| --- | --- | --- |
| 기획 점검 | "PROJECT_PLAN과 wireframe을 점검해줘. 코드는 쓰지 마" | 목적·화면·CTA·불필요 Section·막히는 부분 점검 → 꼭 필요한 수정 제안 |
| 개발 명세 | "BUILD_SPEC.md를 만들어줘" | 14개 항목 명세 (확정된 내용만) |
| 작업 분할 | "작은 단계로 나눠줘" | BUILD_STEPS.md (있으면 좋은 기능은 마지막) |
| 기본구조 | "기본구조만 만들어줘" | 폴더, 빈 페이지, Section 뼈대, `[임시]` 표시 |
| Header·Navigation | "기획된 메뉴만 사용해서" | 공통 영역 복사, 링크 정리 |
| 콘텐츠 Section | "가장 중요한 Section 하나" | 실제 데이터 사용, 없는 것은 임시 표시 |
| DB 설계 변경 | "수파베이스와 관련해 어느 쪽이 좋을까" | 의견 → 승인 → 문서·SQL 반영 |

의견을 물으면 선택지를 표로 비교하고 **추천 1개와 이유**를 말한다. 승인을 받은 뒤에 적용한다.

---

## 7. Git 규칙

- 원격: `https://github.com/gkak00940-netizen/shopping.git`, 브랜치 `main`.
- 버전 커밋: 메시지 `vX.YY 요약` + 본문에 변경 목록, 같은 이름의 주석 태그 `vX.YY` ("버전 X.YY"). (v1.00 메인 화면, v1.01 하위 페이지·헤더·상품 상세)
- 커밋 작성자: `euni1219 <qwerasdf8445@gmail.com>` (저장소 설정에 지정됨).
- 커밋·push는 사용자가 요청할 때만. push할 때는 `git push origin main vX.YY`로 태그도 함께.
