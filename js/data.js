/* =========================================================
   상품 데이터
   - 모든 페이지에서 공통으로 사용합니다.
   - 판매 상품: 유자, 석류, 햅쌀, 마늘, 김 (5가지)
   - image: img/products/ 폴더에 실제 사진을 넣으면 사진이 보이고,
            사진이 없으면 emoji 가 대신 보입니다.
   - season: true 인 상품은 '제철' 탭과 제철 배너 버튼에 나옵니다.
   ========================================================= */
const CATEGORIES = {
  yuja: '유자',
  pomegranate: '석류',
  rice: '햅쌀',
  garlic: '마늘',
  laver: '김'
};

const PRODUCTS = [
  {
    id: 1, category: 'yuja', name: '고흥 햇유자 생과', option: '2kg (중과 20~25개)',
    origin: '고흥군 풍양면', price: 29000, salePrice: 24900,
    emoji: '🍋', color: '#fff1b8', image: 'img/products/yuja.jpg',
    badges: ['제철', '베스트'], popular: 98, season: true
  },
  {
    id: 2, category: 'pomegranate', name: '고흥 석류', option: '3kg (10~12과)',
    origin: '고흥군 도양읍', price: 39000, salePrice: 34900,
    emoji: '🍎', color: '#ffd9d6', image: 'img/products/pomegranate.jpg',
    badges: ['제철'], popular: 85, season: true
  },
  {
    id: 3, category: 'rice', name: '고흥 간척지 쌀 (햅쌀)', option: '10kg / 2026년 햅쌀',
    origin: '고흥군 대서면', price: 38000, salePrice: 34900,
    emoji: '🍚', color: '#f5f2e8', image: 'img/products/rice.jpg',
    badges: ['햅쌀'], popular: 88, season: true
  },
  {
    id: 4, category: 'garlic', name: '고흥 햇 깐마늘', option: '1kg (손질 완료)',
    origin: '고흥군 도덕면', price: 15000, salePrice: 12900,
    emoji: '🧄', color: '#f3eee4', image: 'img/products/garlic.jpg',
    badges: ['베스트'], popular: 92
  },
  {
    id: 5, category: 'laver', name: '거금도 돌김 (전장)', option: '50매 × 1봉',
    origin: '고흥군 금산면 거금도', price: 18000, salePrice: 15900,
    emoji: '🌊', color: '#dde6ef', image: 'img/products/laver.jpg',
    badges: ['베스트'], popular: 90
  }
];

/* =========================================================
   고객 후기
   - 상품 상세 화면의 '고객 후기'에 해당 상품(productId)의 후기만 보입니다.
   - 메인 화면 '고객 후기' Section에 있는 3개와 같은 내용입니다.
   - rating: 별점 (1~5)
   ========================================================= */
const REVIEWS = [
  {
    productId: 1, rating: 5, author: '김**', age: '50대',
    text: '유자청 만들려고 주문했는데 알도 굵고 향이 정말 좋네요. 내년에도 여기서 살게요.'
  },
  {
    productId: 5, rating: 5, author: '정**', age: '60대',
    text: '전화로 주문했는데 친절하게 설명해 주셔서 쉽게 샀어요. 김이 바삭하고 고소해서 어머님도 좋아하십니다.'
  },
  {
    productId: 4, rating: 4, author: '최**', age: '40대',
    text: '깐마늘이 깨끗하게 손질되어 와서 바로 쓰기 좋았어요. 양도 넉넉합니다.'
  }
];
