import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp, MapPin, Phone, Mail, Clock, Info } from 'lucide-react';
import { FAQ } from '../types';
import { FAQS } from '../data';

export default function FAQSection() {
  const [openFaqId, setOpenFaqId] = React.useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-brand-warm/15 border-t border-brand-warm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-sage font-semibold">Guidelines & Information</span>
          <h2 className="font-serif text-3xl sm:text-4.5xl italic text-brand-green">
            이용 및 <span className="text-brand-gold">예약 안내</span>
          </h2>
          <div className="w-12 h-[2px] bg-brand-gold mx-auto" />
          <p className="max-w-xl mx-auto font-sans text-sm text-brand-charcoal/70 leading-relaxed font-light">
            안전하고 평온한 머무름을 위해 아래 안내를 숙지해 주시기 바랍니다.<br />
            더 궁금하신 점은 24시간 열려 있는 온라인 및 전화 문의 채널을 이용해 주세요.
          </p>
        </div>

        {/* Layout Grid: FAQ Left, Contact Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Collapsible FAQ list (Left/Middle Area) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="font-serif text-lg font-bold text-brand-green flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-brand-gold shrink-0" /> 자주 묻는 질문 (FAQ)
            </h4>

            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-brand-warm overflow-hidden shadow-sm hover:border-brand-gold transition-colors duration-300"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                  >
                    <div className="space-y-1 pr-4">
                      <span className="text-[10px] text-brand-gold tracking-wide uppercase font-sans font-medium">
                        [{faq.category}]
                      </span>
                      <h5 className="font-serif text-sm sm:text-base font-bold text-brand-green">
                        {faq.question}
                      </h5>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-brand-sage shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-brand-sage shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-brand-warm/65 font-sans text-xs sm:text-sm text-brand-charcoal/75 leading-relaxed font-light">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Quick contact / Hours panel (Right Area) */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <h4 className="font-serif text-lg font-bold text-brand-green flex items-center gap-2 mb-6">
              <Info className="h-5 w-5 text-brand-gold shrink-0" /> 오시는 길 및 고객 문의
            </h4>

            {/* Address & contact card */}
            <div className="bg-white p-6 rounded-3xl border border-brand-warm shadow-sm space-y-5">
              
              {/* Location details */}
              <div className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-sage font-medium uppercase tracking-wider block">오시는 길</span>
                  <strong className="text-sm font-serif text-brand-green block">강원특별자치도 홍천군 서면 반디 숲길 124-9</strong>
                  <p className="text-xs text-brand-charcoal/65 font-light leading-relaxed">
                    * 서울춘천고속도로 설악IC에서 약 15분 거리. 숲길 진입 시 이정표를 꼭 확인해 주세요.
                  </p>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="flex gap-3 items-start border-t border-brand-warm pt-4">
                <Phone className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-sage font-medium uppercase tracking-wider block">대표 번호 및 상담</span>
                  <strong className="text-base font-mono text-brand-green block">1588-1234</strong>
                  <p className="text-xs text-brand-charcoal/65 font-light">전화 상담 가능 시간: 오전 10시 ~ 오후 6시</p>
                </div>
              </div>

              {/* CheckIn/Out Times */}
              <div className="flex gap-3 items-start border-t border-brand-warm pt-4">
                <Clock className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-sage font-medium uppercase tracking-wider block">체크인 / 체크아웃</span>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <div>
                      <span className="text-[10px] text-brand-sage font-sans font-light">입실 (Check-in)</span>
                      <strong className="text-sm font-serif text-brand-green block">오후 15:00</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-sage font-sans font-light">퇴실 (Check-out)</span>
                      <strong className="text-sm font-serif text-brand-green block">오전 11:00</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Warning / Notice Card */}
            <div className="bg-brand-green p-6 rounded-3xl text-brand-cream space-y-2">
              <h5 className="font-serif text-sm font-bold text-brand-gold flex items-center gap-1.5">
                🌲 친환경 숲보호 캠페인 동참
              </h5>
              <p className="text-xs text-brand-cream/80 leading-relaxed font-light font-sans">
                휴림 글램핑은 수령 100년 이상의 소나무 숲 군락지에 세워져 있습니다. 안전한 산불 예방 및 생태 보호를 위해 개인 조리 가전이나 고출력 음향 가전의 반입 및 외부 폭죽 행위를 금지합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
