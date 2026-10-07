-- =========================================================
-- 고흥장터 Supabase 표 만들기 (BUILD_SPEC 12번)
-- 사용 방법: Supabase → SQL Editor → New query → 전체 붙여 넣기 → Run
-- 여러 번 실행해도 안전합니다 (이미 있으면 건너뛰고, 상품 가격은 다시 맞춥니다).
-- =========================================================


-- ---------- 1. 상품 가격 (주문 금액 계산용) ----------
-- js/data.js 의 PRODUCTS 와 id·가격이 같아야 합니다.
create table if not exists public.products (
  id          int primary key,
  name        text not null,
  option      text not null,
  price       int  not null check (price >= 0),        -- 정가
  sale_price  int  not null check (sale_price >= 0),   -- 판매가 (주문 금액 계산 기준)
  is_active   boolean not null default true            -- 판매 중 여부
);


-- ---------- 2. 주문 ----------
create table if not exists public.orders (
  id                bigint generated always as identity primary key,
  order_no          text not null unique,                  -- 예) GH20261007-0001
  created_at        timestamptz not null default now(),
  type              text not null check (type in ('cart', 'buy')),  -- 장바구니 주문 / 바로 구매
  orderer_name      text not null,
  orderer_phone     text not null check (orderer_phone ~ '^[0-9]{10,11}$'),   -- 숫자만
  receiver_name     text not null,
  receiver_phone    text not null check (receiver_phone ~ '^[0-9]{10,11}$'),  -- 숫자만
  receiver_address  text not null,
  receiver_memo     text,                                  -- 배송 요청사항 (선택)
  depositor         text not null,                         -- 입금자명
  product_total     int  not null,                         -- 상품 금액 합계
  shipping          int  not null,                         -- 배송비 (0 또는 3000)
  total             int  not null,                         -- 입금하실 금액
  due_date          date not null,                         -- 입금 기한 (주문일 + 3일)
  status            text not null default '입금 대기'
                    check (status in ('입금 대기', '배송 준비', '배송 중')),
  agreed_at         timestamptz not null,                  -- 개인정보 수집·이용 동의 시각
  order_pw_hash     text not null                          -- 주문 조회 비밀번호(숫자 4자리)의 해시. 원래 숫자는 저장하지 않음
);

-- 이 파일을 이미 한 번 실행한 경우를 위해: 비밀번호 칸이 없으면 추가합니다.
alter table public.orders add column if not exists order_pw_hash text not null;

-- 휴대폰 번호로 주문을 찾을 때 빠르게
create index if not exists orders_orderer_phone_idx on public.orders (orderer_phone);


-- ---------- 3. 주문 상품 ----------
-- 주문 시점의 상품명·옵션·가격을 복사해 둡니다 (나중에 상품 정보가 바뀌어도 주문 내역은 그대로).
create table if not exists public.order_items (
  id            bigint generated always as identity primary key,
  order_id      bigint not null references public.orders(id) on delete cascade,
  product_id    int    not null references public.products(id),
  product_name  text   not null,
  option        text   not null,
  sale_price    int    not null,
  qty           int    not null check (qty between 1 and 99)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);


-- ---------- 4. 조회 실패 기록 (비밀번호 맞히기 방지) ----------
-- 같은 휴대폰 번호로 5번 틀리면 10분 동안 조회를 막습니다. (functions.sql 의 get_orders 가 사용)
create table if not exists public.order_lookup_attempts (
  phone         text primary key,                  -- 휴대폰 번호 (숫자만)
  fail_count    int  not null default 0,           -- 연속으로 틀린 횟수
  locked_until  timestamptz                        -- 이 시각까지 조회 막힘
);

-- 비밀번호 암호화(해시)에 쓰는 기능 켜기
create extension if not exists pgcrypto with schema extensions;


-- ---------- 5. 보안: RLS 켜기 + 공개 키 권한 회수 ----------
-- RLS를 켜고 정책(policy)을 하나도 만들지 않으면,
-- 사이트의 공개 키(publishable key)로는 표를 직접 읽거나 쓸 수 없습니다.
-- 주문 저장·조회는 functions.sql 의 서버 함수 2개(create_order, get_orders)로만 합니다.
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.order_lookup_attempts enable row level security;

revoke all on public.products, public.orders, public.order_items, public.order_lookup_attempts
  from anon, authenticated;


-- ---------- 6. 상품 5개 가격 입력 (js/data.js 와 같은 값) ----------
insert into public.products (id, name, option, price, sale_price) values
  (1, '고흥 햇유자 생과',       '2kg (중과 20~25개)',  29000, 24900),
  (2, '고흥 석류',              '3kg (10~12과)',       39000, 34900),
  (3, '고흥 간척지 쌀 (햅쌀)',  '10kg / 2026년 햅쌀',  38000, 34900),
  (4, '고흥 햇 깐마늘',         '1kg (손질 완료)',     15000, 12900),
  (5, '거금도 돌김 (전장)',     '50매 × 1봉',          18000, 15900)
on conflict (id) do update set
  name       = excluded.name,
  option     = excluded.option,
  price      = excluded.price,
  sale_price = excluded.sale_price;
