import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CalendarDays, Users, Flame, Coffee, CreditCard, Sparkles, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Room, Reservation } from '../types';
import { ROOMS } from '../data';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom: Room | null;
  selectedDate: string | null;
  reservations: Reservation[];
  onAddReservation: (reservation: Reservation) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedRoom,
  selectedDate,
  reservations,
  onAddReservation,
}: BookingModalProps) {
  // Form states
  const [roomId, setRoomId] = React.useState<string>('');
  const [checkIn, setCheckIn] = React.useState<string>('');
  const [checkOut, setCheckOut] = React.useState<string>('');
  const [guestName, setGuestName] = React.useState<string>('');
  const [guestPhone, setGuestPhone] = React.useState<string>('');
  const [guestCount, setGuestCount] = React.useState<number>(2);
  const [optionBarbecue, setOptionBarbecue] = React.useState<boolean>(false);
  const [optionCampfire, setOptionCampfire] = React.useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'transfer' | 'pay'>('card');

  // Checkout workflow states
  const [step, setStep] = React.useState<'form' | 'pg' | 'processing' | 'success'>('form');
  const [cardNo, setCardNo] = React.useState<string>('');
  const [cardExpiry, setCardExpiry] = React.useState<string>('');
  const [cardCvv, setCardCvv] = React.useState<string>('');
  const [errors, setErrors] = React.useState<string>('');
  
  // Completed reservation holder
  const [newReservation, setNewReservation] = React.useState<Reservation | null>(null);

  // Initialize room and date if pre-selected
  React.useEffect(() => {
    if (isOpen) {
      setStep('form');
      setErrors('');
      setGuestName('');
      setGuestPhone('');
      setOptionBarbecue(false);
      setOptionCampfire(false);
      
      if (selectedRoom) {
        setRoomId(selectedRoom.id);
        setGuestCount(selectedRoom.capacityMin);
      } else {
        setRoomId(ROOMS[0].id);
        setGuestCount(ROOMS[0].capacityMin);
      }

      if (selectedDate) {
        setCheckIn(selectedDate);
        // Default check-out is next day
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOut(nextDay.toISOString().split('T')[0]);
      } else {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        setCheckIn(today.toISOString().split('T')[0]);
        setCheckOut(tomorrow.toISOString().split('T')[0]);
      }
    }
  }, [isOpen, selectedRoom, selectedDate]);

  // Sync guest limit when room changes
  const activeRoom = ROOMS.find((r) => r.id === roomId) || ROOMS[0];

  React.useEffect(() => {
    if (activeRoom) {
      if (guestCount > activeRoom.capacityMax) {
        setGuestCount(activeRoom.capacityMax);
      }
      if (guestCount < activeRoom.capacityMin) {
        setGuestCount(activeRoom.capacityMin);
      }
    }
  }, [roomId, activeRoom, guestCount]);

  // Calculate pricing
  const calculatePricing = () => {
    if (!checkIn || !checkOut || !activeRoom) {
      return { days: 0, roomPrice: 0, extraGuestSurcharge: 0, optionPrice: 0, total: 0 };
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (days <= 0) return { days: 0, roomPrice: 0, extraGuestSurcharge: 0, optionPrice: 0, total: 0 };

    let roomPrice = 0;
    let extraGuestSurcharge = 0;

    // Loop through each night and detect weekend (Friday/Saturday night) vs weekday
    for (let i = 0; i < days; i++) {
      const currentNight = new Date(start);
      currentNight.setDate(start.getDate() + i);
      const dayOfWeek = currentNight.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday

      // Friday and Saturday nights are weekend rates
      const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6);
      const baseNightPrice = isWeekend ? activeRoom.priceWeekend : activeRoom.priceWeekday;
      roomPrice += baseNightPrice;

      // Surcharge for extra guests per night
      const excessGuests = Math.max(0, guestCount - activeRoom.capacityMin);
      extraGuestSurcharge += excessGuests * 20000;
    }

    // Options are flat one-time fees
    let optionPrice = 0;
    if (optionBarbecue) optionPrice += 30000;
    if (optionCampfire) optionPrice += 20000;

    const total = roomPrice + extraGuestSurcharge + optionPrice;

    return { days, roomPrice, extraGuestSurcharge, optionPrice, total };
  };

  const pricing = calculatePricing();

  // Validate overlap
  const validateOverlap = () => {
    if (!checkIn || !checkOut || !roomId) return '날짜와 객실을 선택해 주세요.';

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    if (start >= end) {
      return '체크아웃 날짜는 체크인 날짜 이후여야 합니다.';
    }

    // Filter confirmed bookings for this room
    const roomBookings = reservations.filter(
      (r) => r.roomId === roomId && r.status === 'confirmed'
    );

    // Check each night in the range
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    for (let i = 0; i < days; i++) {
      const targetNight = new Date(start);
      targetNight.setDate(start.getDate() + i);
      targetNight.setHours(0,0,0,0);

      const isOccupied = roomBookings.some((booking) => {
        const bookingIn = new Date(booking.checkIn);
        const bookingOut = new Date(booking.checkOut);
        bookingIn.setHours(0,0,0,0);
        bookingOut.setHours(0,0,0,0);

        return targetNight >= bookingIn && targetNight < bookingOut;
      });

      if (isOccupied) {
        const formattedDate = `${targetNight.getFullYear()}-${String(targetNight.getMonth() + 1).padStart(2, '0')}-${String(targetNight.getDate()).padStart(2, '0')}`;
        return `${formattedDate} 일자는 이미 예약 완료되어 예약할 수 없습니다.`;
      }
    }

    return null;
  };

  // Move to payment portal
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors('');

    if (!guestName.trim()) {
      setErrors('예약자 성함을 입력해 주세요.');
      return;
    }
    if (!guestPhone.trim() || !/^\d{2,3}-\d{3,4}-\d{4}$/.test(guestPhone)) {
      setErrors('올바른 연락처 형식(예: 010-1234-5678)으로 입력해 주세요.');
      return;
    }

    const overlapError = validateOverlap();
    if (overlapError) {
      setErrors(overlapError);
      return;
    }

    setStep('pg');
  };

  // Simulate payment processing
  const handleProcessPG = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors('');

    if (paymentMethod === 'card') {
      if (!cardNo || cardNo.replace(/\s/g, '').length < 16) {
        setErrors('신용카드 번호 16자리를 입력해 주세요.');
        return;
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setErrors('만료일 형식(MM/YY)을 정확히 입력해 주세요.');
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setErrors('CVV 번호 3자리를 입력해 주세요.');
        return;
      }
    }

    setStep('processing');

    setTimeout(() => {
      const generatedId = `res-${Math.random().toString(36).substr(2, 9)}`;
      const reservationData: Reservation = {
        id: generatedId,
        roomId,
        roomName: activeRoom.name,
        guestName,
        guestPhone,
        checkIn,
        checkOut,
        guestCount,
        optionBarbecue,
        optionCampfire,
        totalPrice: pricing.total,
        paymentMethod,
        paymentStatus: 'paid',
        bookingDate: new Date().toISOString().replace('T', ' ').substr(0, 19),
        status: 'confirmed',
      };

      onAddReservation(reservationData);
      setNewReservation(reservationData);
      setStep('success');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-brand-cream rounded-3xl overflow-hidden shadow-2xl z-10 border border-brand-warm flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-warm bg-brand-green text-brand-cream shrink-0 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-brand-gold" />
              {step === 'success' ? '예약 완료' : '실시간 예약 신청'}
            </h3>
            {step !== 'processing' && (
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-brand-green-light transition-colors text-brand-cream/80 hover:text-brand-cream"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Body Content with distinct checkout states */}
          <div className="p-6 overflow-y-auto flex-grow space-y-6">
            {errors && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span className="font-sans font-light leading-relaxed">{errors}</span>
              </div>
            )}

            {/* STEP 1: FORM INPUTS */}
            {step === 'form' && (
              <form onSubmit={handleProceedToPayment} className="space-y-5">
                {/* Accommodation select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-medium text-brand-sage uppercase">객실 선택</label>
                  <select
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full bg-white border border-brand-warm rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-gold transition-colors"
                  >
                    {ROOMS.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} ({room.type} - {room.size})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates picker row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-brand-sage uppercase">체크인 날짜</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-white border border-brand-warm rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-brand-sage uppercase">체크아웃 날짜</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-white border border-brand-warm rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                {/* Guest select */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-sans font-medium text-brand-sage uppercase flex items-center gap-1">
                      <Users className="h-3 w-3" /> 투숙 인원
                    </label>
                    <span className="text-[10px] text-brand-sage">
                      기준 {activeRoom.capacityMin}명 / 최대 {activeRoom.capacityMax}명
                    </span>
                  </div>
                  <input
                    type="number"
                    min={activeRoom.capacityMin}
                    max={activeRoom.capacityMax}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-white border border-brand-warm rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-gold"
                  />
                  {guestCount > activeRoom.capacityMin && (
                    <p className="text-[10px] text-brand-gold font-sans">
                      * 기준 인원 {activeRoom.capacityMin}인 초과로 1인당 1박 20,000원의 인원 초과 수수료가 적용됩니다.
                    </p>
                  )}
                </div>

                {/* Guest Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-brand-sage uppercase">예약자 성함</label>
                    <input
                      type="text"
                      placeholder="김휴림"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-white border border-brand-warm rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-medium text-brand-sage uppercase">휴대폰 번호</label>
                    <input
                      type="text"
                      placeholder="010-1234-5678"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-white border border-brand-warm rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                {/* Experience Options */}
                <div className="space-y-2">
                  <label className="text-xs font-sans font-medium text-brand-sage uppercase">추가 힐링 옵션</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Barbecue Option */}
                    <div
                      onClick={() => setOptionBarbecue(!optionBarbecue)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                        optionBarbecue
                          ? 'border-brand-gold bg-brand-gold/5 text-brand-green'
                          : 'border-brand-warm bg-white hover:bg-brand-warm/20 text-brand-charcoal'
                      }`}
                    >
                      <Coffee className={`h-5 w-5 shrink-0 ${optionBarbecue ? 'text-brand-gold' : 'text-brand-sage'}`} />
                      <div className="text-left">
                        <h5 className="font-serif font-bold text-xs">감성 바비큐 그릴 세트</h5>
                        <p className="text-[10px] text-brand-sage font-sans mt-0.5">+ 30,000원</p>
                      </div>
                    </div>

                    {/* Campfire Option */}
                    <div
                      onClick={() => setOptionCampfire(!optionCampfire)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                        optionCampfire
                          ? 'border-brand-gold bg-brand-gold/5 text-brand-green'
                          : 'border-brand-warm bg-white hover:bg-brand-warm/20 text-brand-charcoal'
                      }`}
                    >
                      <Flame className={`h-5 w-5 shrink-0 ${optionCampfire ? 'text-[#E5AA6B]' : 'text-brand-sage'}`} />
                      <div className="text-left">
                        <h5 className="font-serif font-bold text-xs">참나무 장작 불멍 세트</h5>
                        <p className="text-[10px] text-brand-sage font-sans mt-0.5">+ 20,000원</p>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-brand-warm my-4" />

                {/* Price Summary section */}
                <div className="bg-white p-5 rounded-2xl border border-brand-warm space-y-2.5 font-sans">
                  <div className="flex justify-between items-baseline text-xs text-brand-charcoal/70">
                    <span>객실 이용 요금 ({pricing.days}박)</span>
                    <span className="font-medium">{pricing.roomPrice.toLocaleString()}원</span>
                  </div>
                  {pricing.extraGuestSurcharge > 0 && (
                    <div className="flex justify-between items-baseline text-xs text-brand-charcoal/70">
                      <span>인원 추가 수수료</span>
                      <span className="font-medium text-brand-gold">+{pricing.extraGuestSurcharge.toLocaleString()}원</span>
                    </div>
                  )}
                  {pricing.optionPrice > 0 && (
                    <div className="flex justify-between items-baseline text-xs text-brand-charcoal/70">
                      <span>추가 힐링 옵션 요금</span>
                      <span className="font-medium text-brand-gold">+{pricing.optionPrice.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="border-t border-brand-warm pt-2.5 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-brand-green">최종 결제 금액</span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-brand-green">
                      {pricing.total.toLocaleString()}
                      <span className="text-xs font-sans font-light">원</span>
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  className="w-full bg-brand-green text-brand-cream py-3.5 rounded-xl font-bold font-sans tracking-wide hover:bg-brand-green-light transition-all shadow-lg shadow-brand-green/10 flex justify-center items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  결제 진행하기
                </button>
              </form>
            )}

            {/* STEP 2: PG MOCKUP INTERFACE */}
            {step === 'pg' && (
              <form onSubmit={handleProcessPG} className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-sans text-brand-sage uppercase tracking-wider font-semibold">Secure Payment Gateway</span>
                  <h4 className="font-serif text-lg font-bold text-brand-green">안전 결제 인증</h4>
                  <p className="text-xs text-brand-charcoal/60">결제 수단을 선택하고 본인 인증을 진행하세요.</p>
                </div>

                {/* Payment Methods tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', name: '신용카드' },
                    { id: 'transfer', name: '실시간 이체' },
                    { id: 'pay', name: '간편 결제' },
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`text-center py-3 rounded-xl border text-xs font-sans font-medium cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'bg-brand-green text-brand-cream border-brand-green'
                          : 'bg-white hover:bg-brand-warm text-brand-charcoal border-brand-warm'
                      }`}
                    >
                      {method.name}
                    </div>
                  ))}
                </div>

                {/* Interactive Card inputs if Card selected */}
                {paymentMethod === 'card' ? (
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-brand-warm shadow-inner">
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-sage font-medium uppercase block">카드 번호</label>
                      <input
                        type="text"
                        placeholder="1234 - 5678 - 9876 - 5432"
                        value={cardNo}
                        onChange={(e) => setCardNo(e.target.value)}
                        className="w-full bg-brand-cream/50 border border-brand-warm rounded-lg px-3 py-2 text-sm font-mono tracking-widest focus:outline-none focus:border-brand-gold text-center"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-brand-sage font-medium uppercase block">유효기간 (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="08 / 31"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-brand-cream/50 border border-brand-warm rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-brand-gold text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-brand-sage font-medium uppercase block">CVV 번호</label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="***"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-brand-cream/50 border border-brand-warm rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-brand-gold text-center"
                        />
                      </div>
                    </div>
                  </div>
                ) : paymentMethod === 'transfer' ? (
                  <div className="bg-white p-5 rounded-2xl border border-brand-warm text-center space-y-2">
                    <span className="text-brand-sage text-xs block">계좌이체 계좌 안내</span>
                    <strong className="font-serif text-sm text-brand-green block">우리은행 1005-502-349021 (휴림글램핑)</strong>
                    <p className="text-[11px] text-brand-charcoal/60">결제 완료 버튼을 누르시면, 예약이 가접수되며 가입력하신 연락처로 입금 확인 문자를 보내드립니다.</p>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-2xl border border-brand-warm text-center space-y-3">
                    <span className="text-brand-sage text-xs block">지원하는 간편결제 서비스</span>
                    <div className="flex justify-center gap-3">
                      <span className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-800 text-xs font-bold font-sans">카카오페이</span>
                      <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold font-sans">토스페이</span>
                      <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-xs font-bold font-sans">네이버페이</span>
                    </div>
                    <p className="text-[11px] text-brand-charcoal/60 font-sans">결제 완료 버튼을 누르시면 해당 결제수단 팝업이 안전하게 호출됩니다.</p>
                  </div>
                )}

                {/* Info and Navigation buttons */}
                <div className="bg-brand-warm/30 p-4 rounded-xl text-[11px] text-brand-sage font-sans space-y-1 leading-relaxed">
                  <p>• 결제완료 즉시 예약 승인 상태로 변경되어 문자가 발송됩니다.</p>
                  <p>• 취소 및 환불 규정은 이용 개시 7일 전 100% 환불이 적용됩니다.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="w-1/3 text-xs text-brand-charcoal hover:bg-brand-warm border border-brand-sage/30 py-3 rounded-xl font-medium transition-colors"
                  >
                    이전으로
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-brand-green text-brand-cream text-xs font-bold py-3 rounded-xl hover:bg-brand-green-light transition-colors shadow-md shadow-brand-green/10"
                  >
                    {pricing.total.toLocaleString()}원 결제 승인
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PROCESSING SPINNER */}
            {step === 'processing' && (
              <div className="py-16 text-center space-y-4">
                <Loader2 className="h-10 w-10 text-brand-gold animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-brand-green">보안 결제 승인 중</h4>
                  <p className="text-xs text-brand-charcoal/60">결제 정보를 안전하게 암호화하여 승인을 대기 중입니다.</p>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS RECEIPT */}
            {step === 'success' && newReservation && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-brand-green">예약이 완료되었습니다!</h4>
                  <p className="text-xs text-brand-charcoal/65">성공적으로 결제가 검증되었으며 호스트 예약이 수립되었습니다.</p>
                </div>

                {/* Thermal Receipt Box */}
                <div className="bg-white p-6 rounded-2xl border border-brand-warm border-dashed shadow-sm space-y-4 font-sans relative">
                  {/* Decorative receipt notches */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 flex gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} className="w-2 h-3 bg-brand-cream rounded-full shrink-0" />
                    ))}
                  </div>

                  <div className="text-center border-b border-brand-warm border-dashed pb-3">
                    <span className="font-serif text-lg font-bold text-brand-green">HURIM GLAMPING</span>
                    <span className="text-[10px] text-brand-sage block font-sans tracking-widest uppercase mt-0.5">Forest Sanctuary Receipt</span>
                  </div>

                  <div className="space-y-2 text-xs text-brand-charcoal/80">
                    <div className="flex justify-between">
                      <span className="font-light text-brand-charcoal/60">예약 일련번호</span>
                      <span className="font-mono font-medium text-brand-green">{newReservation.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light text-brand-charcoal/60">예약자 성함</span>
                      <span className="font-medium">{newReservation.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light text-brand-charcoal/60">선택 객실</span>
                      <span className="font-medium text-brand-green">{newReservation.roomName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light text-brand-charcoal/60">투숙 기간</span>
                      <span className="font-medium text-brand-gold">{newReservation.checkIn} ~ {newReservation.checkOut} ({pricing.days}박)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light text-brand-charcoal/60">투숙 인원</span>
                      <span className="font-medium">{newReservation.guestCount}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light text-brand-charcoal/60">바비큐 그릴</span>
                      <span className="font-medium">{newReservation.optionBarbecue ? '신청완료' : '미신청'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light text-brand-charcoal/60">불멍 세트</span>
                      <span className="font-medium">{newReservation.optionCampfire ? '신청완료' : '미신청'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light text-brand-charcoal/60">결제 수단</span>
                      <span className="font-medium uppercase">{newReservation.paymentMethod === 'card' ? '신용카드' : newReservation.paymentMethod === 'transfer' ? '무통장입금' : '간편결제'}</span>
                    </div>
                  </div>

                  <div className="border-t border-brand-warm border-dashed pt-3 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-brand-green">최종 지불금액</span>
                    <span className="font-serif text-lg font-bold text-brand-green">{newReservation.totalPrice.toLocaleString()}원</span>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="bg-brand-green/5 border border-brand-green/10 p-4 rounded-2xl text-[11px] text-brand-green font-sans leading-relaxed space-y-1">
                  <p><strong>🌲 체크인 안내 메시지</strong></p>
                  <p>체크인 당일 오후 1시에 스마트 오토 락 비밀번호 및 숲길 진입 위치 지도가 기재된 웰컴 알림톡이 자동으로 발송됩니다. 자연 보호를 위해 일회용 칫솔/치약은 개별 준비해 오시기를 권장합니다.</p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-brand-green text-brand-cream py-3 rounded-xl font-bold font-sans tracking-wide hover:bg-brand-green-light transition-colors"
                >
                  확인 및 창 닫기
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
