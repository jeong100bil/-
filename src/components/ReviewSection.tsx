import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Quote, Heart, Send, Sparkles } from 'lucide-react';
import { Review } from '../types';
import { REVIEWS } from '../data';

interface ReviewSectionProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export default function ReviewSection({ reviews, onAddReview }: ReviewSectionProps) {
  const [roomFilter, setRoomFilter] = React.useState<string>('all');
  const [author, setAuthor] = React.useState('');
  const [content, setContent] = React.useState('');
  const [rating, setRating] = React.useState<number>(5);
  const [selectedRoomName, setSelectedRoomName] = React.useState<string>('포레스트 스카이 돔');
  const [formSuccess, setFormSuccess] = React.useState(false);

  // Filter reviews
  const filteredReviews = roomFilter === 'all' 
    ? reviews 
    : reviews.filter(r => r.roomName === roomFilter);

  // Submit review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    const newReview: Review = {
      id: `rev-${Math.random().toString(36).substr(2, 5)}`,
      roomName: selectedRoomName,
      author: author.trim(),
      rating,
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    onAddReview(newReview);
    setAuthor('');
    setContent('');
    setRating(5);
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="reviews" className="py-24 bg-brand-cream border-t border-brand-warm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-sage font-semibold">Guest Stories</span>
          <h2 className="font-serif text-3xl sm:text-4.5xl italic text-brand-green">
            머무른 이들의 <span className="text-brand-gold">기록</span>
          </h2>
          <div className="w-12 h-[2px] bg-brand-gold mx-auto" />
          <p className="max-w-xl mx-auto font-sans text-sm text-brand-charcoal/70 leading-relaxed font-light">
            소란한 일상을 등지고 찾아온 이들이 남긴 편지.<br />
            휴림에서의 조용하고 충만한 시간들을 기록으로 확인해 보세요.
          </p>
        </div>

        {/* Rating Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-brand-warm text-center space-y-3 flex flex-col justify-center shadow-sm">
            <span className="text-xs text-brand-sage uppercase font-sans tracking-widest block">사용자 평점</span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="font-serif text-5xl font-bold text-brand-green">{averageRating}</span>
              <span className="text-sm text-brand-charcoal/50">/ 5.0</span>
            </div>
            <div className="flex justify-center gap-1 text-brand-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="text-[11px] text-brand-charcoal/60 font-sans">
              방문객 {reviews.length}명이 전한 따뜻한 추천글
            </p>
          </div>

          {/* Filtering buttons list */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-brand-sage font-medium mr-2 font-sans">후기 필터:</span>
              <button
                onClick={() => setRoomFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  roomFilter === 'all'
                    ? 'bg-brand-green text-brand-cream'
                    : 'bg-white hover:bg-brand-warm text-brand-charcoal border border-brand-warm'
                }`}
              >
                전체 객실 ({reviews.length})
              </button>
              {Array.from(new Set(reviews.map(r => r.roomName))).map((roomName) => (
                <button
                  key={roomName}
                  onClick={() => setRoomFilter(roomName)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    roomFilter === roomName
                      ? 'bg-brand-green text-brand-cream'
                      : 'bg-white hover:bg-brand-warm text-brand-charcoal border border-brand-warm'
                  }`}
                >
                  {roomName.split(' ')[0]} ({reviews.filter(r => r.roomName === roomName).length})
                </button>
              ))}
            </div>

            <div className="text-xs text-brand-sage flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-brand-gold shrink-0 animate-pulse" />
              <span>실제 투숙을 마치신 고객님들이 자발적으로 작성해 주신 감성 포토&텍스트 리뷰입니다.</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid List and Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((rev) => (
                <motion.div
                  key={rev.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-2xl border border-brand-warm shadow-sm space-y-3 relative text-left group hover:border-brand-gold transition-colors"
                >
                  <Quote className="absolute right-6 top-6 h-8 w-8 text-brand-warm opacity-40 shrink-0" />
                  
                  {/* Rating & Author details */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-brand-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4.5 w-4.5 ${
                            i < rev.rating ? 'fill-current text-brand-gold' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-brand-sage font-mono">{rev.date}</span>
                  </div>

                  {/* Room name and Author */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm text-brand-charcoal">{rev.author}</span>
                    <span className="text-[10px] text-brand-sage font-medium bg-brand-cream px-2 py-0.5 rounded">
                      {rev.roomName} 이용
                    </span>
                  </div>

                  {/* Content body */}
                  <p className="font-sans text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light whitespace-pre-line">
                    {rev.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add Review Sidebar Form */}
          <div className="bg-white p-6 rounded-3xl border border-brand-warm shadow-sm flex flex-col h-fit text-left">
            <h4 className="font-serif text-base font-bold text-brand-green flex items-center gap-2 mb-1">
              <MessageSquare className="h-4.5 w-4.5 text-brand-gold" /> 다녀간 흔적 남기기
            </h4>
            <p className="text-xs text-brand-charcoal/60 mb-5 font-light">휴림에서의 행복했던 순간을 기록하고 다른 여행자들과 공유해 보세요.</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {formSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-1.5 animate-bounce">
                  <Heart className="h-4 w-4 fill-current text-red-500" />
                  소중한 후기가 안전하게 저장되었습니다!
                </div>
              )}

              {/* Guest name */}
              <div className="space-y-1">
                <label className="text-[10px] text-brand-sage font-medium uppercase block">이름</label>
                <input
                  type="text"
                  placeholder="예: 김민지"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-brand-cream/40 border border-brand-warm rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>

              {/* Room Choice */}
              <div className="space-y-1">
                <label className="text-[10px] text-brand-sage font-medium uppercase block">이용 객실</label>
                <select
                  value={selectedRoomName}
                  onChange={(e) => setSelectedRoomName(e.target.value)}
                  className="w-full bg-brand-cream/40 border border-brand-warm rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="포레스트 스카이 돔">포레스트 스카이 돔</option>
                  <option value="루미에르 사파리">루미에르 사파리</option>
                  <option value="하울림 포레스트 캐빈">하울림 포레스트 캐빈</option>
                </select>
              </div>

              {/* Rating stars picker */}
              <div className="space-y-1">
                <label className="text-[10px] text-brand-sage font-medium uppercase block">만족도 평점</label>
                <div className="flex gap-1.5 text-slate-300">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setRating(starVal)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 cursor-pointer ${
                            starVal <= rating ? 'fill-current text-brand-gold' : 'text-slate-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content body */}
              <div className="space-y-1">
                <label className="text-[10px] text-brand-sage font-medium uppercase block">후기 내용</label>
                <textarea
                  placeholder="객실의 청결도, 마당 뷰, 바비큐 등의 힐링 에피소드를 적어주세요."
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-brand-cream/40 border border-brand-warm rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-green text-brand-cream py-3 rounded-xl text-xs font-bold font-sans tracking-wide hover:bg-brand-green-light transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                작성 및 발송
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
