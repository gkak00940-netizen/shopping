# supabase 폴더

Supabase(`shopping` 프로젝트)에 실행할 SQL. 사이트 파일이 아니라 **Supabase → SQL Editor에 붙여 넣고 Run** 하는 파일이다. 여러 번 실행해도 안전하게 만들었다.

| 파일 | 내용 | 상태 |
| --- | --- | --- |
| `schema.sql` | 표 4개 + 보안 설정 + 상품 5개 가격 | 작성 완료 → **SQL Editor에서 실행 필요** |
| `functions.sql` | 서버 함수 `create_order`, `get_orders` | 아직 (BUILD_STEPS 6-2) |

## 표

| 표 | 내용 |
| --- | --- |
| `products` | 상품 가격. 주문 금액을 서버에서 다시 계산할 때 사용 (`js/data.js`와 값이 같아야 함) |
| `orders` | 주문 (주문번호 `GH날짜-순번`, 주문자·받는 분, 금액, 입금 기한, 상태, 주문 조회 비밀번호 해시) |
| `order_items` | 주문한 상품 (주문 당시 이름·옵션·가격·수량) |
| `order_lookup_attempts` | 주문 조회 실패 기록 (같은 휴대폰 번호로 5번 틀리면 10분 잠금) |

## 보안

- 4개 표 모두 RLS를 켜고 정책을 만들지 않았다 → 사이트의 공개 키로는 표를 직접 읽거나 쓸 수 없다.
- 주문 저장·조회는 서버 함수 2개로만 한다.
- 주문 조회 비밀번호는 원래 숫자를 저장하지 않고 암호화(해시)해서 저장한다.
- 사이트 코드에는 Project URL과 publishable key만 넣는다. **secret(service_role) key는 절대 넣지 않는다.**

## 운영

- 주문 확인·상태 변경(입금 대기 → 배송 준비 → 배송 중): Supabase **Table Editor**에서 `orders.status`를 바꾼다.
- 상품 가격 변경: `products` 표와 `js/data.js`를 함께 고친다.
