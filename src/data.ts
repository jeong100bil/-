import { Room, Review, FAQ, Reservation } from './types';

export const ROOMS: Room[] = [
  {
    id: 'forest-dome',
    name: '포레스트 스카이 돔',
    subName: 'Forest Sky Dome',
    type: 'Luxury Dome',
    description: '360도 투명 창으로 쏟아지는 별빛과 울창한 숲을 만끽하는 프라이빗 돔형 텐트',
    longDescription: '소나무 숲 한가운데 자리 잡은 포레스트 스카이 돔은 자연과의 완벽한 교감을 선사합니다. 천장에 넓게 디자인된 투명 천창을 통해 낮에는 푸른 하늘과 흔들리는 나뭇가지를, 밤에는 은하수와 별빛을 침대에 누워 편안하게 감상하실 수 있습니다. 최고급 친환경 편백나무 가구와 프리미엄 구스다운 침구, 야외 개별 감성 노천탕이 준비되어 있습니다.',
    capacityMin: 2,
    capacityMax: 4,
    priceWeekday: 220000,
    priceWeekend: 280000,
    size: '52㎡',
    bedType: '이탈리아산 수제 킹 매트리스 1개',
    images: [
      'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=1200'
    ],
    amenities: [
      '개별 프라이빗 스파/노천탕',
      '최고급 빔프로젝터 & 스크린',
      '마샬 블루투스 스피커',
      '개별 잔디 마당 & 바비큐 데크',
      '시그니처 드립커피 세트',
      '다이슨 드라이기',
      '친환경 어메니티 패키지',
      '냉난방 에어컨 & 온돌 난방'
    ],
    features: ['#자연친화적', '#별빛조망', '#감성인테리어', '#개별노천탕']
  },
  {
    id: 'luxury-safari',
    name: '루미에르 사파리',
    subName: 'Lumiere Luxury Safari',
    type: 'Premium Safari',
    description: '빈티지 감성의 최고급 인테리어와 압도적인 넓은 데크를 품은 정통 럭셔리 사파리',
    longDescription: '넓은 거실과 아늑한 침실이 완벽하게 분리된 최고급 사파리 텐트입니다. 가죽 소파와 황동 조명, 에스닉한 패브릭 소품들이 자아내는 빈티지하면서도 세련된 가을/겨울 감성의 실내 공간은 머무는 것만으로도 특별한 휴식이 됩니다. 대형 개별 테라스 데크에는 최고급 웨버 그릴과 야외 시네마, 벽난로 스타일의 불멍 구역이 별도 마련되어 있습니다.',
    capacityMin: 2,
    capacityMax: 4,
    priceWeekday: 240000,
    priceWeekend: 310000,
    size: '65㎡',
    bedType: '호텔식 퀸 매트리스 2개',
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200'
    ],
    amenities: [
      '초대형 개별 테라스 데크',
      '감성 에탄올 벽난로',
      '야외 대형 빔프로젝터',
      '웨버 프리미엄 가스그릴',
      '발뮤다 더 팟 & 토스터',
      '호텔식 구스 침구류',
      '독립형 화장실 & 샤워실',
      '일리 캡슐 머신'
    ],
    features: ['#빈티지무드', '#초대형데크', '#가족추천', '#야외시네마']
  },
  {
    id: 'cozy-cabin',
    name: '하울림 포레스트 캐빈',
    subName: 'Howlim Forest Cabin',
    type: 'Nordic Cabin',
    description: '북유럽 목조 오두막 스타일과 따스한 감성 불멍 캠핑을 동시에 즐기는 하이브리드 캐빈',
    longDescription: '친환경 가문비나무로 지어진 아담하고 단단한 북유럽풍 포레스트 캐빈입니다. 나무 본연의 따스한 질감과 은은하게 퍼지는 피톤치드 향이 지친 몸과 마음에 편안한 이완을 가져다줍니다. 실내 다락방 구조로 아이들이나 연인들에게 색다른 재미와 로맨틱한 분위기를 제공하며, 전용 정원에 마련된 돌담 모닥불 가든에서 완벽한 프라이빗 불멍을 누리실 수 있습니다.',
    capacityMin: 2,
    capacityMax: 3,
    priceWeekday: 190000,
    priceWeekend: 250000,
    size: '42㎡',
    bedType: '퀸 매트리스 1개 & 다락 토퍼 1개',
    images: [
      'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&q=80&w=1200'
    ],
    amenities: [
      '프라이빗 돌담 모닥불 가든',
      '다락방 아지트 스페이스',
      '우드 버닝 스토브(장작 난로)',
      '레트로LP 턴테이블',
      '드롱기 가전 풀세트',
      '개별 숲속 바비큐장',
      '핀란드식 건식 사우나 쿠폰',
      '친환경 고체 에코 어메니티'
    ],
    features: ['#북유럽감성', '#피톤치드', '#LP턴테이블', '#돌담불멍']
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    roomName: '포레스트 스카이 돔',
    author: '김민지',
    rating: 5,
    content: '가본 글램핑장 중에서 제일 깨끗하고 예뻐요! 밤에 돔 침대에 누워서 진짜 밤하늘 별 보는데 눈물 날 뻔 했습니다.. 노천탕도 물이 따끈따끈하고 편백 향이 은은해서 피로가 싹 풀렸어요. 가을에 꼭 다시 갈게요!',
    date: '2026-07-15'
  },
  {
    id: '2',
    roomName: '루미에르 사파리',
    author: '박준서',
    rating: 5,
    content: '가족들과 함께 방문했는데 넓은 데크 덕분에 정말 여유로웠습니다. 빔프로젝터로 야외에서 영화 본 게 오랫동안 기억에 남을 것 같네요. 침구도 웬만한 5성급 호텔보다 푹신해서 부모님이 무척 만족해하셨어요.',
    date: '2026-07-10'
  },
  {
    id: '3',
    roomName: '하울림 포레스트 캐빈',
    author: '이지은',
    rating: 5,
    content: '나무 향기가 너무 가득해서 들어서자마자 기분이 맑아졌어요. 빈티지 턴테이블로 클래식 들으며 모닥불 불멍하는 시간은 잊지 못할 힐링이었습니다. 도심 속 소음에서 벗어나고 싶으신 분들께 정말 강추해요!',
    date: '2026-07-08'
  },
  {
    id: '4',
    roomName: '포레스트 스카이 돔',
    author: '최영호',
    rating: 4,
    content: '시설이나 뷰는 압도적입니다. 개별 바베큐 데크도 깔끔하고 어메니티 하나하나 신경 쓰신 게 느껴집니다. 에어컨 아주 빵빵해서 여름인데도 시원하게 잘 쉬고 왔습니다.',
    date: '2026-07-02'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    category: '예약 및 인원',
    question: '최대 수용 인원을 초과하여 입실할 수 있나요?',
    answer: '안전사고 예방과 쾌적한 시설 관리를 위해 규정된 최대 인원 외의 추가 인원(영유아 포함)은 입실이 엄격히 제한됩니다. 규정 초과 시 당일 입실이 거부될 수 있으며 환불되지 않으니 인원 준수를 꼭 부탁드립니다.'
  },
  {
    id: 'faq-2',
    category: '준비물 및 비품',
    question: '기본 어메니티나 식기류는 준비되어 있나요?',
    answer: '기본적인 호텔식 수건, 다이슨 드라이기, 친환경 샴푸/린스/바디워시를 제공합니다. 또한 인덕션, 전자레인지, 냉장고, 식기 세트(와인잔, 오프너 포함)가 전용 주방에 갖춰져 있습니다. 개인 칫솔과 치약만 지참해주시면 됩니다.'
  },
  {
    id: 'faq-3',
    category: '바비큐 및 불멍',
    question: '개인 캠핑 장비나 화로대, 장작을 직접 가져와도 되나요?',
    answer: '글램핑장의 안전 및 산불 방지를 위해 화재 위험이 있는 개인 화로, 버너, 전기그릴, 부탄가스, 장작, 숯 등의 반입 및 개인 사용을 금지하고 있습니다. 바비큐와 모닥불 불멍은 현장에서 제공되는 안전 검증된 공식 옵션을 예약 및 신청해 주시기 바랍니다.'
  },
  {
    id: 'faq-4',
    category: '체크인/아웃',
    question: '체크인 및 체크아웃 시간은 어떻게 되나요?',
    answer: '체크인은 오후 3시(15:00)부터 가능하며, 체크아웃은 오전 11시(11:00)까지입니다. 원활한 객실 청소 및 방역 관리를 위해 체크아웃 시간 준수를 양해 부탁드립니다.'
  }
];

// Generate dynamic reservation dummy data starting from today
export const getInitialReservations = (): Reservation[] => {
  const reservations: Reservation[] = [];
  const today = new Date();
  
  // Helper to format date
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  
  // Set some booked slots for Forest Sky Dome
  const d1 = new Date(today);
  const d2 = new Date(today);
  d2.setDate(today.getDate() + 1);
  
  const d3 = new Date(today);
  d3.setDate(today.getDate() + 3);
  const d4 = new Date(today);
  d4.setDate(today.getDate() + 4);

  reservations.push({
    id: 'res-dome-1',
    roomId: 'forest-dome',
    roomName: '포레스트 스카이 돔',
    guestName: '홍*동',
    guestPhone: '010-1234-****',
    checkIn: formatDate(d1),
    checkOut: formatDate(d2),
    guestCount: 2,
    optionBarbecue: true,
    optionCampfire: true,
    totalPrice: 470000,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    bookingDate: '2026-07-18 14:22:10',
    status: 'confirmed'
  });

  reservations.push({
    id: 'res-dome-2',
    roomId: 'forest-dome',
    roomName: '포레스트 스카이 돔',
    guestName: '이*민',
    guestPhone: '010-9876-****',
    checkIn: formatDate(d3),
    checkOut: formatDate(d4),
    guestCount: 2,
    optionBarbecue: true,
    optionCampfire: false,
    totalPrice: 440000,
    paymentMethod: 'pay',
    paymentStatus: 'paid',
    bookingDate: '2026-07-17 11:05:43',
    status: 'confirmed'
  });

  // Set some booked slots for Lumiere Safari
  const d5 = new Date(today);
  d5.setDate(today.getDate() + 1);
  const d6 = new Date(today);
  d6.setDate(today.getDate() + 3);

  reservations.push({
    id: 'res-safari-1',
    roomId: 'luxury-safari',
    roomName: '루미에르 사파리',
    guestName: '박*현',
    guestPhone: '010-5555-****',
    checkIn: formatDate(d5),
    checkOut: formatDate(d6),
    guestCount: 4,
    optionBarbecue: true,
    optionCampfire: true,
    totalPrice: 620000,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    bookingDate: '2026-07-16 18:30:11',
    status: 'confirmed'
  });

  // Set cozy cabin booked slot
  const d7 = new Date(today);
  d7.setDate(today.getDate() + 2);
  const d8 = new Date(today);
  d8.setDate(today.getDate() + 4);

  reservations.push({
    id: 'res-cabin-1',
    roomId: 'cozy-cabin',
    roomName: '하울림 포레스트 캐빈',
    guestName: '최*서',
    guestPhone: '010-8888-****',
    checkIn: formatDate(d7),
    checkOut: formatDate(d8),
    guestCount: 2,
    optionBarbecue: false,
    optionCampfire: true,
    totalPrice: 400000,
    paymentMethod: 'transfer',
    paymentStatus: 'paid',
    bookingDate: '2026-07-15 09:12:00',
    status: 'confirmed'
  });

  return reservations;
};
