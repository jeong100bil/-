import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, Users, Flame, Coffee, Calendar, Bath, Eye, Sparkles } from 'lucide-react';
import { Room } from '../types';
import { ROOMS } from '../data';

interface RoomListProps {
  onOpenBooking: (room: Room) => void;
}

export default function RoomList({ onOpenBooking }: RoomListProps) {
  const [selectedDetailRoom, setSelectedDetailRoom] = React.useState<Room | null>(null);
  const [activeImageIndexes, setActiveImageIndexes] = React.useState<Record<string, number>>({});

  const nextImage = (roomId: string, imagesLength: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % imagesLength,
    }));
  };

  const prevImage = (roomId: string, imagesLength: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + imagesLength) % imagesLength,
    }));
  };

  return (
    <section id="rooms" className="py-24 bg-brand-cream border-t border-brand-warm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-sage font-semibold">Special Sanctuary</span>
          <h2 className="font-serif text-3xl sm:text-4.5xl italic text-brand-green">
            자연과 스며든 <span className="text-brand-gold">고요의 객실</span>
          </h2>
          <div className="w-12 h-[2px] bg-brand-gold mx-auto" />
          <p className="max-w-xl mx-auto font-sans text-sm text-brand-charcoal/70 leading-relaxed font-light">
            오직 당신을 위해 엄선된 프라이빗 포레스트 스테이.<br />
            개별 테라스, 고급 어메니티, 완벽히 독립된 자연 경관을 선사합니다.
          </p>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ROOMS.map((room) => {
            const currentImgIndex = activeImageIndexes[room.id] || 0;
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md shadow-brand-green/5 border border-brand-warm flex flex-col group h-full hover:shadow-xl hover:shadow-brand-green/10 transition-all duration-300"
              >
                {/* Image Slideshow Frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-warm">
                  <img
                    src={room.images[currentImgIndex]}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Soft Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                  {/* Room Type Tag on top-left */}
                  <span className="absolute top-4 left-4 bg-brand-green/90 text-brand-cream text-[10px] tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-md">
                    {room.type}
                  </span>

                  {/* Size Indicator on top-right */}
                  <span className="absolute top-4 right-4 bg-black/40 text-brand-cream text-xs px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                    <Maximize2 className="h-3 w-3" /> {room.size}
                  </span>

                  {/* Left / Right Navigators */}
                  <button
                    onClick={(e) => prevImage(room.id, room.images.length, e)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-brand-charcoal p-1.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => nextImage(room.id, room.images.length, e)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-brand-charcoal p-1.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {room.images.map((_, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          currentImgIndex === i ? 'bg-brand-gold scale-125 w-3' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  {/* Name and Capacity */}
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">
                        {room.name}
                      </h3>
                      <span className="flex items-center gap-1 font-sans text-xs text-brand-sage">
                        <Users className="h-3.5 w-3.5" /> 기준 {room.capacityMin}인 / 최대 {room.capacityMax}인
                      </span>
                    </div>
                    <span className="text-xs text-brand-sage uppercase tracking-widest block mt-0.5 font-light">
                      {room.subName}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs text-brand-charcoal/70 leading-relaxed font-light flex-grow">
                    {room.description}
                  </p>

                  {/* Tags / Features */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-brand-warm/60 text-brand-sage text-[10px] px-2 py-0.5 rounded-md font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <hr className="border-brand-warm" />

                  {/* Pricing and Action Area */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-brand-sage block font-sans uppercase">Starting at</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-xl font-bold text-brand-green">
                          {room.priceWeekday.toLocaleString()}
                        </span>
                        <span className="text-xs text-brand-charcoal/60 font-sans font-light">원~</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDetailRoom(room)}
                        className="flex items-center gap-1.5 text-xs text-brand-sage hover:text-brand-green font-medium tracking-wide px-3 py-2.5 rounded-xl border border-brand-warm hover:bg-brand-warm/45 transition-all duration-300"
                        title="자세히 보기"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        둘러보기
                      </button>
                      <button
                        onClick={() => onOpenBooking(room)}
                        className="bg-brand-green text-brand-cream text-xs font-semibold tracking-wide px-4 py-2.5 rounded-xl hover:bg-brand-green-light transition-all duration-300 shadow-md shadow-brand-green/10"
                      >
                        예약하기
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Room Immersive Detail Dialog */}
      <AnimatePresence>
        {selectedDetailRoom && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailRoom(null)}
              className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-brand-cream rounded-3xl overflow-hidden shadow-2xl z-10 border border-brand-warm max-h-[90vh] flex flex-col"
            >
              {/* Image Header with close button */}
              <div className="relative h-64 sm:h-96 w-full shrink-0">
                <img
                  src={selectedDetailRoom.images[0]}
                  alt={selectedDetailRoom.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-brand-cream/10 to-black/35" />
                <button
                  onClick={() => setSelectedDetailRoom(null)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-brand-charcoal p-2 rounded-full transition-colors z-20 shadow-md"
                >
                  <ChevronLeft className="h-5 w-5 rotate-185" />
                  <span className="sr-only">Close</span>
                </button>

                <div className="absolute bottom-6 left-6 text-left">
                  <span className="bg-brand-gold text-brand-charcoal text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-full shadow-sm">
                    {selectedDetailRoom.type}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold text-brand-green mt-2 drop-shadow-sm">
                    {selectedDetailRoom.name}
                  </h3>
                  <span className="text-xs sm:text-sm text-brand-green-light block tracking-widest mt-0.5 font-serif font-medium">
                    {selectedDetailRoom.subName}
                  </span>
                </div>
              </div>

              {/* Scrollable details area */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-grow">
                {/* Layout details row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-brand-warm shadow-sm">
                  <div className="text-center border-r border-brand-warm last:border-0">
                    <span className="text-[10px] text-brand-sage uppercase block">객실 크기</span>
                    <span className="font-serif text-sm font-bold text-brand-green mt-1 block">{selectedDetailRoom.size}</span>
                  </div>
                  <div className="text-center sm:border-r border-brand-warm last:border-0">
                    <span className="text-[10px] text-brand-sage uppercase block">침대 구성</span>
                    <span className="font-serif text-sm font-bold text-brand-green mt-1 block">{selectedDetailRoom.bedType}</span>
                  </div>
                  <div className="text-center border-r border-brand-warm last:border-0">
                    <span className="text-[10px] text-brand-sage uppercase block">기본 / 최대 인원</span>
                    <span className="font-serif text-sm font-bold text-brand-green mt-1 block">기준 {selectedDetailRoom.capacityMin}인 / 최대 {selectedDetailRoom.capacityMax}인</span>
                  </div>
                  <div className="text-center last:border-0">
                    <span className="text-[10px] text-brand-sage uppercase block">구조 형태</span>
                    <span className="font-serif text-sm font-bold text-brand-green mt-1 block">독립 개별동형</span>
                  </div>
                </div>

                {/* Narrative Intro */}
                <div className="space-y-3">
                  <h4 className="font-serif text-lg font-bold text-brand-green flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-gold" /> 공간의 가치
                  </h4>
                  <p className="font-sans text-sm text-brand-charcoal/80 leading-relaxed font-light whitespace-pre-line bg-white/50 p-5 rounded-2xl border border-brand-warm">
                    {selectedDetailRoom.longDescription}
                  </p>
                </div>

                {/* Pricing rules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-brand-warm space-y-2">
                    <h5 className="font-serif text-sm font-bold text-brand-green">주중 요금 (일~목)</h5>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl font-bold text-brand-gold">{selectedDetailRoom.priceWeekday.toLocaleString()}</span>
                      <span className="text-xs text-brand-charcoal/60 font-sans">원</span>
                    </div>
                    <p className="text-[11px] text-brand-sage">기준 인원 초과 시 1인당 20,000원의 추가 요금이 발생합니다.</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-brand-warm space-y-2">
                    <h5 className="font-serif text-sm font-bold text-brand-green">주말 요금 (금~토, 공휴일 전날)</h5>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl font-bold text-brand-gold">{selectedDetailRoom.priceWeekend.toLocaleString()}</span>
                      <span className="text-xs text-brand-charcoal/60 font-sans">원</span>
                    </div>
                    <p className="text-[11px] text-brand-sage">기준 인원 초과 시 동일하게 추가 요금이 자동 가산됩니다.</p>
                  </div>
                </div>

                {/* Amenities Grid */}
                <div className="space-y-4">
                  <h4 className="font-serif text-lg font-bold text-brand-green flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-brand-gold" /> 어메니티 및 편의 장비
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedDetailRoom.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white/60 px-4 py-3 rounded-xl border border-brand-warm text-xs text-brand-charcoal hover:border-brand-gold transition-colors"
                      >
                        <Bath className="h-3.5 w-3.5 text-brand-sage shrink-0" />
                        <span className="font-sans font-light leading-snug">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Header */}
              <div className="p-6 bg-brand-warm border-t border-brand-warm shrink-0 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <span className="text-xs text-brand-sage font-light">숲과 하나되는 휴식처</span>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-brand-green">{selectedDetailRoom.name}</h4>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedDetailRoom(null)}
                    className="flex-1 sm:flex-none text-xs text-brand-charcoal hover:bg-brand-cream border border-brand-sage/30 px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    창 닫기
                  </button>
                  <button
                    onClick={() => {
                      const targetRoom = selectedDetailRoom;
                      setSelectedDetailRoom(null);
                      onOpenBooking(targetRoom);
                    }}
                    className="flex-1 sm:flex-none bg-brand-green text-brand-cream text-xs font-bold tracking-wider px-8 py-3 rounded-xl hover:bg-brand-green-light transition-all shadow-md shadow-brand-green/10"
                  >
                    바로 예약하기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
