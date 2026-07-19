import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoomList from './components/RoomList';
import CalendarView from './components/CalendarView';
import BookingModal from './components/BookingModal';
import AdminPanel from './components/AdminPanel';
import ReviewSection from './components/ReviewSection';
import FAQSection from './components/FAQSection';
import { Room, Reservation, Review } from './types';
import { getInitialReservations, REVIEWS } from './data';
import { Compass, Mail, Phone, MapPin, Tent, MessageSquare, ArrowUp, CalendarRange, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Persistence state
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  
  // Navigation & Scroll State
  const [activeSection, setActiveSection] = React.useState('hero');
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Modal / Interaction states
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = React.useState(false);

  // On mount, load data from localStorage or default
  React.useEffect(() => {
    try {
      const storedRes = localStorage.getItem('hurim_reservations');
      if (storedRes) {
        setReservations(JSON.parse(storedRes));
      } else {
        const initial = getInitialReservations();
        setReservations(initial);
        localStorage.setItem('hurim_reservations', JSON.stringify(initial));
      }

      const storedRev = localStorage.getItem('hurim_reviews');
      if (storedRev) {
        setReviews(JSON.parse(storedRev));
      } else {
        setReviews(REVIEWS);
        localStorage.setItem('hurim_reviews', JSON.stringify(REVIEWS));
      }
    } catch (e) {
      // Fallback
      setReservations(getInitialReservations());
      setReviews(REVIEWS);
    }
  }, []);

  // Sync to localStorage helper
  const updateReservations = (newRes: Reservation[]) => {
    setReservations(newRes);
    try {
      localStorage.setItem('hurim_reservations', JSON.stringify(newRes));
    } catch (e) {
      console.error(e);
    }
  };

  const updateReviews = (newRev: Review[]) => {
    setReviews(newRev);
    try {
      localStorage.setItem('hurim_reviews', JSON.stringify(newRev));
    } catch (e) {
      console.error(e);
    }
  };

  // Scroll detection for active navigation and "back to top" button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      const sections = ['hero', 'rooms', 'calendar', 'reviews', 'faq'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Callback to open booking modal with room pre-selected
  const handleOpenBookingWithRoom = (room: Room) => {
    setSelectedRoom(room);
    setSelectedDate(null);
    setIsBookingOpen(true);
  };

  // Callback to open booking from calendar date selection
  const handleSelectCalendarSlot = (date: string, room: Room | null) => {
    setSelectedDate(date);
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  // Add reservation
  const handleAddReservation = (res: Reservation) => {
    updateReservations([res, ...reservations]);
  };

  // Add offline reservation (Admin override)
  const handleAddReservationOffline = (res: Reservation) => {
    updateReservations([res, ...reservations]);
  };

  // Cancel reservation
  const handleCancelReservation = (id: string) => {
    const updated = reservations.map((r) => 
      r.id === id ? { ...r, status: 'cancelled' as const, paymentStatus: 'cancelled' as const } : r
    );
    updateReservations(updated);
  };

  // Add review
  const handleAddReview = (review: Review) => {
    updateReviews([review, ...reviews]);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal flex flex-col font-sans selection:bg-brand-gold/30 selection:text-brand-green">
      
      {/* Sticky header navbar */}
      <Navbar
        onNavigate={handleNavigate}
        activeSection={activeSection}
        isAdmin={isAdminMode}
        setIsAdmin={(mode) => {
          setIsAdminMode(mode);
          if (mode) {
            setIsAdminPanelOpen(true);
          }
        }}
      />

      {/* Hero Section */}
      <Hero onNavigate={handleNavigate} />

      {/* Core Brand Narrative Section (Pre-Room Intro) */}
      <section className="py-24 bg-brand-cream/40 border-t border-b border-brand-warm/50 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Tent className="h-[500px] w-[500px] text-brand-green" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-brand-sage uppercase tracking-[0.2em] text-[11px] font-semibold">
            <Compass className="h-4 w-4 shrink-0 animate-spin-slow" /> The True Rest
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl italic text-brand-green leading-tight max-w-3xl mx-auto">
            인공의 소음을 거두어내고,<br />
            맑은 <span className="text-brand-gold">소나무 향</span>으로 채우는 하루
          </h2>
          <div className="w-12 h-[2px] bg-brand-gold mx-auto" />
          <p className="max-w-2xl mx-auto font-sans text-sm sm:text-base text-brand-charcoal/70 leading-relaxed font-light">
            휴림(HURIM) 글램핑은 수목으로 둘러싸인 천혜의 요지에서 오직 당신만을 위한 완전한 고립과 평온을 추구합니다. 
            타인의 간섭이 차단된 드넓은 개별 데크와 따사로운 노천탕 스파, 포근한 침구 위로 쏟아지는 밤하늘 은하수가 
            도시의 소란에 지쳤던 영혼을 다정하게 위로할 것입니다.
          </p>
        </div>
      </section>

      {/* Rooms List Showcase */}
      <RoomList onOpenBooking={handleOpenBookingWithRoom} />

      {/* Live Availability Calendar */}
      <CalendarView 
        reservations={reservations} 
        onSelectDateAndRoom={handleSelectCalendarSlot} 
      />

      {/* Guest Reviews Section */}
      <ReviewSection reviews={reviews} onAddReview={handleAddReview} />

      {/* Collapsible FAQ and Rules of Stay */}
      <FAQSection />

      {/* Backoffice Administration Toggle Prompt */}
      {isAdminMode && (
        <div className="bg-brand-charcoal py-4 text-center border-t border-brand-warm shrink-0 z-40 fixed bottom-0 left-0 right-0 shadow-2xl flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-brand-gold text-xs font-sans">
            <Lock className="h-4 w-4" />
            <span>통합 관리자 모드가 활성화되어 있습니다.</span>
          </div>
          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="bg-brand-gold hover:bg-brand-cream text-brand-charcoal text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            백오피스 제어판 열기
          </button>
          <button
            onClick={() => setIsAdminMode(false)}
            className="text-brand-cream/60 hover:text-brand-cream text-xs underline font-sans"
          >
            모드 종료
          </button>
        </div>
      )}

      {/* Elegant Footer */}
      <footer className="bg-[#1E2E24] text-brand-cream/80 py-16 border-t border-brand-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Logo, contact grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Tent className="h-6 w-6 text-brand-gold" />
                <span className="font-serif text-xl font-bold text-brand-cream tracking-wider">HURIM</span>
              </div>
              <p className="text-xs text-brand-cream/60 leading-relaxed font-light">
                바쁜 숨을 고르고, 자연의 품에 안겨 진정한 내면의 조화를 경험하는 특별한 힐링 아일랜드.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-serif font-bold text-brand-gold tracking-wide">예약 및 고객센터</h5>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-brand-gold" /> 1588-1234</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-brand-gold" /> support@hurimcamp.com</p>
              <p className="text-brand-cream/50">전화 접수/상담: 10:00 ~ 18:00 (주말 휴무)</p>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-serif font-bold text-brand-gold tracking-wide">위치 안내</h5>
              <p className="flex items-start gap-2 leading-relaxed">
                <MapPin className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" /> 
                <span>강원특별자치도 홍천군 서면 반디 숲길 124-9</span>
              </p>
              <p className="text-brand-cream/50">체크인: 15시 | 체크아웃: 11시</p>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-serif font-bold text-brand-gold tracking-wide">이용 링크</h5>
              <div className="grid grid-cols-2 gap-2 text-brand-cream/65">
                <button onClick={() => handleNavigate('rooms')} className="text-left hover:text-brand-gold transition-colors">객실 보기</button>
                <button onClick={() => handleNavigate('calendar')} className="text-left hover:text-brand-gold transition-colors">실시간 예약</button>
                <button onClick={() => handleNavigate('reviews')} className="text-left hover:text-brand-gold transition-colors">이용 후기</button>
                <button onClick={() => handleNavigate('faq')} className="text-left hover:text-brand-gold transition-colors">자주 묻는 질문</button>
              </div>
            </div>
          </div>

          <hr className="border-brand-cream/10" />

          {/* Legal / Coprights row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-brand-cream/55 font-light">
            <div className="space-y-1 text-center md:text-left">
              <p>주식회사 휴림글램핑스테이 | 대표자: 정휴림 | 개인정보관리책임자: 김휴림</p>
              <p>사업자등록번호: 120-01-23456 | 통신판매업 신고번호: 제2026-강원홍천-0123호</p>
              <p>© 2026 HURIM Forest Glamping. All Rights Reserved.</p>
            </div>
            
            <div className="flex gap-4">
              <span className="hover:text-brand-gold cursor-pointer transition-colors">이용약관</span>
              <span>|</span>
              <span className="font-semibold text-brand-gold hover:underline cursor-pointer">개인정보처리방침</span>
              <span>|</span>
              <span className="hover:text-brand-gold cursor-pointer transition-colors">소방안전 가이드</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 md:bottom-8 right-6 z-40 bg-brand-green hover:bg-brand-green-light text-brand-cream p-3 rounded-full shadow-xl transition-all duration-300"
            title="맨 위로"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main reservation Modal workflow */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedRoom={selectedRoom}
        selectedDate={selectedDate}
        reservations={reservations}
        onAddReservation={handleAddReservation}
      />

      {/* Backoffice Administration Dashboard panel overlay */}
      <AnimatePresence>
        {isAdminPanelOpen && (
          <AdminPanel
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
            onAddReservationOffline={handleAddReservationOffline}
            onClose={() => setIsAdminPanelOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
