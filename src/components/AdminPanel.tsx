import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Plus, Trash2, Calendar, Users, DollarSign, RefreshCw, X, FileText, CheckCircle2 } from 'lucide-react';
import { Room, Reservation } from '../types';
import { ROOMS } from '../data';

interface AdminPanelProps {
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onAddReservationOffline: (reservation: Reservation) => void;
  onClose: () => void;
}

export default function AdminPanel({
  reservations,
  onCancelReservation,
  onAddReservationOffline,
  onClose,
}: AdminPanelProps) {
  // Offline form states
  const [roomId, setRoomId] = React.useState<string>(ROOMS[0].id);
  const [guestName, setGuestName] = React.useState<string>('');
  const [guestPhone, setGuestPhone] = React.useState<string>('');
  const [checkIn, setCheckIn] = React.useState<string>('');
  const [checkOut, setCheckOut] = React.useState<string>('');
  const [guestCount, setGuestCount] = React.useState<number>(2);
  const [optionBarbecue, setOptionBarbecue] = React.useState<boolean>(false);
  const [optionCampfire, setOptionCampfire] = React.useState<boolean>(false);
  const [totalPrice, setTotalPrice] = React.useState<number>(200000);
  const [formError, setFormError] = React.useState<string>('');
  const [formSuccess, setFormSuccess] = React.useState<boolean>(false);

  // Auto-calculate rough price for offline form
  React.useEffect(() => {
    const room = ROOMS.find(r => r.id === roomId) || ROOMS[0];
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      if (days > 0) {
        let base = days * room.priceWeekday;
        const excess = Math.max(0, guestCount - room.capacityMin);
        base += excess * 20000 * days;
        if (optionBarbecue) base += 30000;
        if (optionCampfire) base += 20000;
        setTotalPrice(base);
      }
    }
  }, [roomId, checkIn, checkOut, guestCount, optionBarbecue, optionCampfire]);

  // Submit offline booking
  const handleOfflineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!guestName.trim()) {
      setFormError('예약자 성함을 입력해 주세요.');
      return;
    }
    if (!guestPhone.trim()) {
      setFormError('연락처를 입력해 주세요.');
      return;
    }
    if (!checkIn || !checkOut) {
      setFormError('투숙 기간을 올바르게 선택해 주세요.');
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (start >= end) {
      setFormError('체크아웃 날짜는 체크인 날짜 이후여야 합니다.');
      return;
    }

    // Overlap checks
    const activeBookings = reservations.filter((r) => r.roomId === roomId && r.status === 'confirmed');
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    
    for (let i = 0; i < days; i++) {
      const targetNight = new Date(start);
      targetNight.setDate(start.getDate() + i);
      targetNight.setHours(0,0,0,0);

      const isOccupied = activeBookings.some((booking) => {
        const bookingIn = new Date(booking.checkIn);
        const bookingOut = new Date(booking.checkOut);
        bookingIn.setHours(0,0,0,0);
        bookingOut.setHours(0,0,0,0);

        return targetNight >= bookingIn && targetNight < bookingOut;
      });

      if (isOccupied) {
        const formattedDate = `${targetNight.getFullYear()}-${String(targetNight.getMonth() + 1).padStart(2, '0')}-${String(targetNight.getDate()).padStart(2, '0')}`;
        setFormError(`${formattedDate} 일자는 이미 예약된 일정입니다.`);
        return;
      }
    }

    // Create reservation
    const room = ROOMS.find(r => r.id === roomId) || ROOMS[0];
    const generatedId = `res-off-${Math.random().toString(36).substr(2, 5)}`;
    
    const offlineRes: Reservation = {
      id: generatedId,
      roomId,
      roomName: room.name,
      guestName: guestName + ' (오프라인/전화)',
      guestPhone,
      checkIn,
      checkOut,
      guestCount,
      optionBarbecue,
      optionCampfire,
      totalPrice,
      paymentMethod: 'transfer',
      paymentStatus: 'paid',
      bookingDate: new Date().toISOString().replace('T', ' ').substr(0, 19),
      status: 'confirmed',
    };

    onAddReservationOffline(offlineRes);
    setFormSuccess(true);
    setGuestName('');
    setGuestPhone('');
  };

  // Metrics calculations
  const activeReservations = reservations.filter(r => r.status === 'confirmed');
  const totalSales = activeReservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const totalBookingsCount = activeReservations.length;
  
  // Calculate distinct booked room usage
  const roomUsageCount = activeReservations.reduce((acc, r) => {
    acc[r.roomName] = (acc[r.roomName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-brand-charcoal/75 backdrop-blur-sm" />

      {/* Admin Window Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="relative w-full max-w-5xl bg-brand-cream rounded-3xl overflow-hidden shadow-2xl z-10 border border-brand-warm flex flex-col max-h-[92vh]"
      >
        {/* Banner */}
        <div className="p-6 border-b border-brand-warm bg-brand-charcoal text-brand-cream shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-brand-gold animate-pulse" />
            <div>
              <h3 className="font-serif text-lg font-bold">휴림 통합 백오피스 관리자</h3>
              <p className="text-[10px] text-brand-sage uppercase tracking-wider font-sans font-light mt-0.5">HURIM Glamping Real-time Control Terminal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-brand-cream/80 hover:text-brand-cream transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Core Workspace Scroll Area */}
        <div className="p-6 overflow-y-auto flex-grow space-y-8">
          {/* 1. Dashboard Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-brand-warm shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-brand-gold/15 text-brand-gold shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-brand-sage uppercase block">누적 매출 총액</span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-brand-green">{totalSales.toLocaleString()}원</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-warm shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-brand-green/15 text-brand-green shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-brand-sage uppercase block">활성 예약 건수</span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-brand-green">{totalBookingsCount}건</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-warm shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#5F89D3]/15 text-[#5F89D3] shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-brand-sage uppercase block">객실 점유 분포</span>
                <span className="text-xs font-sans font-medium text-brand-charcoal/80 block mt-1">
                  {Object.keys(roomUsageCount).length > 0 
                    ? Object.entries(roomUsageCount).map(([room, count]) => `${room.split(' ')[0]}: ${count}회`).join(' | ')
                    : '등록된 예약 없음'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 2. Reservations List View (Left/Middle Area) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-bold text-brand-green flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-brand-gold" /> 실시간 예약 관리 대장
                </h4>
                <span className="text-[10px] text-brand-sage font-mono">총 {reservations.length}개 내역 기록됨</span>
              </div>

              <div className="bg-white rounded-2xl border border-brand-warm overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-brand-warm/30 text-brand-sage font-medium uppercase border-b border-brand-warm">
                      <tr>
                        <th className="p-4">예약자 / 번호</th>
                        <th className="p-4">선택 객실</th>
                        <th className="p-4">투숙 기간</th>
                        <th className="p-4">금액 / 결제</th>
                        <th className="p-4 text-center">동작</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-warm">
                      {reservations.map((res) => (
                        <tr 
                          key={res.id} 
                          className={`hover:bg-brand-warm/15 transition-colors ${
                            res.status === 'cancelled' ? 'bg-slate-100/55 opacity-60' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="font-bold text-brand-charcoal">{res.guestName}</div>
                            <div className="text-[10px] text-brand-sage font-mono mt-0.5">{res.guestPhone}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-brand-green/10 text-brand-green font-medium text-[10px]">
                              {res.roomName}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-brand-gold font-mono">{res.checkIn} ~ {res.checkOut}</div>
                            <div className="text-[9px] text-brand-sage font-sans font-light mt-0.5">인원: {res.guestCount}명</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-brand-charcoal">{res.totalPrice.toLocaleString()}원</div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-sans tracking-tight font-medium ${
                                res.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {res.paymentStatus === 'paid' ? '수납 완료' : '미납/보류'}
                              </span>
                              <span className="text-[9px] text-brand-sage uppercase font-mono">({res.paymentMethod})</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {res.status === 'confirmed' ? (
                              <button
                                onClick={() => onCancelReservation(res.id)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100 transition-colors"
                                title="예약 취소"
                              >
                                <Trash2 className="h-3 w-3" />
                                예약 취소
                              </button>
                            ) : (
                              <span className="text-[10px] font-medium text-slate-500 font-sans italic">
                                취소 완료됨
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {reservations.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-brand-sage font-light italic">
                            접수된 글램핑 예약이 비어 있습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 3. Manual Offline Reservation Form (Right Area) */}
            <div className="space-y-4">
              <h4 className="font-serif text-base font-bold text-brand-green flex items-center gap-2">
                <Plus className="h-4.5 w-4.5 text-brand-gold" /> 수동 예약 우회 등록
              </h4>

              <div className="bg-white p-5 rounded-2xl border border-brand-warm shadow-sm">
                <form onSubmit={handleOfflineSubmit} className="space-y-4 text-left">
                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-[10px]">
                      {formError}
                    </div>
                  )}

                  {formSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      수동 예약이 실시간으로 장부에 접수되었습니다.
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-sage font-medium uppercase block">대상 객실</label>
                    <select
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="w-full bg-brand-cream/40 border border-brand-warm rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-brand-gold"
                    >
                      {ROOMS.map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-sage font-medium uppercase block">예약자명</label>
                      <input
                        type="text"
                        placeholder="전화 접수자명"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-brand-cream/40 border border-brand-warm rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-sage font-medium uppercase block">연락처</label>
                      <input
                        type="text"
                        placeholder="010-0000-0000"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-brand-cream/40 border border-brand-warm rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-sage font-medium uppercase block">체크인</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-brand-cream/40 border border-brand-warm rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-sage font-medium uppercase block">체크아웃</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-brand-cream/40 border border-brand-warm rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-sage font-medium uppercase block">투숙 인원</label>
                      <input
                        type="number"
                        min={1}
                        max={4}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full bg-brand-cream/40 border border-brand-warm rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-sage font-medium uppercase block">수동 요금가산 (원)</label>
                      <input
                        type="number"
                        value={totalPrice}
                        onChange={(e) => setTotalPrice(Number(e.target.value))}
                        className="w-full bg-brand-cream/40 border border-brand-warm rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Add Offline Button */}
                  <button
                    type="submit"
                    className="w-full bg-brand-charcoal text-brand-cream py-2.5 rounded-xl text-xs font-bold font-sans hover:bg-brand-charcoal/90 transition-colors shadow-md flex items-center justify-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    수동 현장 장부 기입
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
