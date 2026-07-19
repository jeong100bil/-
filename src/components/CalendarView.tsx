import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Room, Reservation } from '../types';
import { ROOMS } from '../data';

interface CalendarViewProps {
  reservations: Reservation[];
  onSelectDateAndRoom: (date: string, room: Room | null) => void;
}

export default function CalendarView({ reservations, onSelectDateAndRoom }: CalendarViewProps) {
  // Current local time metadata says 2026-07-19
  const [currentYear, setCurrentYear] = React.useState(2026);
  const [currentMonth, setCurrentMonth] = React.useState(7); // July (1-indexed)
  const [selectedRoomId, setSelectedRoomId] = React.useState<string>('all');

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate days for the current displayed month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfWeek = (year: number, month: number) => {
    // month is 1-indexed, so month-1 for Date constructor
    return new Date(year, month - 1, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  // Pad arrays with empty days for prefix of first week
  const blankDays = Array(firstDayOfWeek).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  // Check if a specific date (YYYY-MM-DD) has an active reservation
  const checkReservationStatus = (day: number) => {
    const formattedMonth = String(currentMonth).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const targetDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

    // Filter reservations by selected room ID if applicable
    const activeBookings = reservations.filter((r) => r.status === 'confirmed');

    const relevantBookings = selectedRoomId === 'all' 
      ? activeBookings 
      : activeBookings.filter((r) => r.roomId === selectedRoomId);

    // Find if the targetDate falls inside check-in & check-out
    // Check-out day is usually available for check-in of a new guest, so we count [checkIn, checkOut - 1] as occupied
    const matchedBookings = relevantBookings.filter((booking) => {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      const targetDate = new Date(targetDateStr);
      
      // Clear time elements
      checkInDate.setHours(0,0,0,0);
      checkOutDate.setHours(0,0,0,0);
      targetDate.setHours(0,0,0,0);

      // It is occupied if checkIn <= targetDate < checkOut
      return targetDate >= checkInDate && targetDate < checkOutDate;
    });

    if (matchedBookings.length > 0) {
      // If we filtered to all, check if ALL rooms are booked on this date.
      if (selectedRoomId === 'all') {
        // If the number of matching distinct booked rooms equals total rooms, it is fully booked.
        const distinctBookedRoomIds = Array.from(new Set(matchedBookings.map(b => b.roomId)));
        if (distinctBookedRoomIds.length >= ROOMS.length) {
          return { status: 'occupied', detail: '전체 마감', bookings: matchedBookings };
        } else {
          return { status: 'partial', detail: `${ROOMS.length - distinctBookedRoomIds.length}개 객실 남음`, bookings: matchedBookings };
        }
      }
      return { status: 'occupied', detail: '예약 마감', bookings: matchedBookings };
    }

    return { status: 'available', detail: '예약 가능', bookings: [] };
  };

  // Helper to trigger booking on click
  const handleDateClick = (day: number) => {
    const formattedMonth = String(currentMonth).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

    const resCheck = checkReservationStatus(day);
    if (resCheck.status === 'occupied') {
      return; // Already occupied, do nothing
    }

    // Pre-select the room if it was selected in the filter (and is not 'all')
    const selectedRoom = selectedRoomId === 'all' ? null : ROOMS.find(r => r.id === selectedRoomId) || null;
    onSelectDateAndRoom(dateStr, selectedRoom);
  };

  return (
    <section id="calendar" className="py-24 bg-brand-warm/30 border-t border-brand-warm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-sage font-semibold">Live Reservation</span>
          <h2 className="font-serif text-3xl sm:text-4.5xl italic text-brand-green">
            실시간 <span className="text-brand-gold">예약 현황</span>
          </h2>
          <div className="w-12 h-[2px] bg-brand-gold mx-auto" />
          <p className="max-w-xl mx-auto font-sans text-sm text-brand-charcoal/70 leading-relaxed font-light">
            원하시는 객실과 투숙 일정을 직접 선택해 보세요.<br />
            실시간으로 남은 방 현황이 반영되어 바로 안전한 예약이 가능합니다.
          </p>
        </div>

        {/* Room Filters & Legend bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 bg-white p-5 rounded-3xl border border-brand-warm shadow-sm">
          {/* Room Filter Segment */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="font-sans text-xs text-brand-sage mr-2 font-medium">객실별 검색:</span>
            <button
              onClick={() => setSelectedRoomId('all')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedRoomId === 'all'
                  ? 'bg-brand-green text-brand-cream'
                  : 'bg-brand-cream hover:bg-brand-warm text-brand-charcoal border border-brand-warm'
              }`}
            >
              전체 객실 보기
            </button>
            {ROOMS.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedRoomId === room.id
                    ? 'bg-brand-green text-brand-cream'
                    : 'bg-brand-cream hover:bg-brand-warm text-brand-charcoal border border-brand-warm'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>

          {/* Legends */}
          <div className="flex items-center gap-4 text-xs font-sans text-brand-charcoal/80 shrink-0 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-brand-green-light" />
              <span>예약 가능</span>
            </div>
            {selectedRoomId === 'all' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#E5AA6B]" />
                <span>부분 마감</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-300" />
              <span>예약 완료</span>
            </div>
          </div>
        </div>

        {/* Calendar Core Frame */}
        <div className="bg-white rounded-3xl overflow-hidden border border-brand-warm shadow-md shadow-brand-green/5">
          {/* Month Header Banner */}
          <div className="bg-brand-green text-brand-cream px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-brand-gold" />
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide">
                {currentYear}년 {monthNames[currentMonth - 1]}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-brand-green-light text-brand-cream/90 hover:text-brand-cream transition-colors"
                title="이전 달"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bg-brand-green-light text-brand-cream/90 hover:text-brand-cream transition-colors"
                title="다음 달"
              >
                <ChevronRight className="h-5 w-5 animate-pulse" />
              </button>
            </div>
          </div>

          {/* Days Grid Heading */}
          <div className="grid grid-cols-7 border-b border-brand-warm bg-brand-warm/25 py-3 text-center font-sans text-xs font-semibold text-brand-charcoal/80">
            <span className="text-[#D35F5F]">일</span>
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span className="text-[#5F89D3]">토</span>
          </div>

          {/* Days Grid Core */}
          <div className="grid grid-cols-7 bg-brand-cream/35">
            {/* Blank padding days */}
            {blankDays.map((_, i) => (
              <div
                key={`blank-${i}`}
                className="aspect-square border-b border-r border-brand-warm/60 last:border-r-0 bg-brand-warm/5"
              />
            ))}

            {/* Calendar Days */}
            {daysArray.map((day) => {
              const resCheck = checkReservationStatus(day);
              const isToday = 
                new Date().getDate() === day && 
                new Date().getMonth() + 1 === currentMonth && 
                new Date().getFullYear() === currentYear;

              // Color rules
              let bgColor = 'hover:bg-brand-warm/50 cursor-pointer';
              let textColor = 'text-brand-charcoal';
              let badgeBg = '';
              let badgeText = '';

              if (resCheck.status === 'occupied') {
                bgColor = 'bg-slate-50 cursor-not-allowed';
                textColor = 'text-brand-charcoal/30';
                badgeBg = 'bg-slate-200';
                badgeText = 'text-slate-500';
              } else if (resCheck.status === 'partial') {
                bgColor = 'bg-amber-50/50 hover:bg-amber-50 cursor-pointer';
                textColor = 'text-brand-charcoal';
                badgeBg = 'bg-amber-100 text-amber-800';
                badgeText = 'text-amber-800';
              } else {
                bgColor = 'bg-emerald-50/30 hover:bg-brand-green-light/10 cursor-pointer';
                badgeBg = 'bg-brand-green/10';
                badgeText = 'text-brand-green';
              }

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square border-b border-r border-brand-warm/60 last:border-r-0 p-2 flex flex-col justify-between transition-all duration-300 relative ${bgColor}`}
                >
                  {/* Day Number and Today Indicator */}
                  <div className="flex items-center justify-between">
                    <span className={`font-serif text-sm sm:text-base font-bold ${textColor}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] bg-brand-gold text-brand-charcoal px-1.5 py-0.5 rounded font-sans tracking-tight font-medium">
                        오늘
                      </span>
                    )}
                  </div>

                  {/* Status Banner */}
                  <div className="text-right">
                    <span className={`inline-block text-[9px] sm:text-[10px] px-1.5 py-1 rounded-md font-sans font-medium tracking-tight ${badgeBg} ${badgeText}`}>
                      {resCheck.status === 'occupied' ? (
                        <span className="flex items-center gap-0.5 justify-end">
                          <AlertCircle className="h-2.5 w-2.5" />
                          {resCheck.detail}
                        </span>
                      ) : resCheck.status === 'partial' ? (
                        <span>{resCheck.detail}</span>
                      ) : (
                        <span className="flex items-center gap-0.5 justify-end">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {resCheck.detail}
                        </span>
                      )}
                    </span>

                    {/* Simple overlay info of booked rooms for all views to show occupancy */}
                    {resCheck.status !== 'available' && (
                      <div className="hidden sm:block mt-1 text-[8px] text-right text-brand-charcoal/50 leading-none truncate max-w-full">
                        {resCheck.bookings.map(b => b.roomName.split(' ')[0]).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip Box */}
        <div className="mt-6 flex gap-3 items-start bg-brand-green/5 border border-brand-green/15 p-4 rounded-2xl max-w-2xl mx-auto">
          <AlertCircle className="h-5 w-5 text-brand-sage shrink-0 mt-0.5" />
          <p className="text-xs text-brand-green font-sans leading-relaxed">
            <strong>예약 방법 안내</strong>: 달력에서 원하시는 날짜의 <strong>[예약 가능]</strong> 셀을 클릭하시면 해당 날짜를 체크인 기준으로 설정한 예약 신청 페이지가 열립니다. 전체 객실 보기 모드에서는 비어있는 임의의 객실을 선택하실 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
