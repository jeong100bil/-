export interface Room {
  id: string;
  name: string;
  subName: string;
  type: string;
  description: string;
  longDescription: string;
  capacityMin: number;
  capacityMax: number;
  priceWeekday: number;
  priceWeekend: number;
  size: string; // e.g. "45㎡"
  bedType: string; // e.g. "퀸 침대 2개"
  images: string[];
  amenities: string[];
  features: string[];
}

export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestPhone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestCount: number;
  optionBarbecue: boolean;
  optionCampfire: boolean;
  totalPrice: number;
  paymentMethod: 'card' | 'transfer' | 'pay';
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  bookingDate: string; // YYYY-MM-DD HH:mm:ss
  status: 'confirmed' | 'cancelled';
}

export interface Review {
  id: string;
  roomName: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}
