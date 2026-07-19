import { motion } from 'motion/react';
import { Compass, CalendarDays, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <div id="hero" className="relative min-h-screen bg-brand-cream text-brand-charcoal flex flex-col justify-center overflow-hidden pt-28 pb-16">
      {/* Subtle top decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E6E2D3]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-[400px] h-[400px] bg-[#5A5A40]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Asymmetric Image Showcase (Left) */}
          <div className="lg:col-span-7 h-[350px] sm:h-[480px] relative w-full order-last lg:order-first">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="absolute inset-0 bg-[#DEDEDE] rounded-[40px] overflow-hidden shadow-2xl border border-brand-warm"
            >
              <div 
                className="w-full h-full bg-cover bg-center flex items-end p-6 sm:p-10 transition-transform duration-[12000ms] hover:scale-105" 
                style={{ 
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 60%, transparent 100%), url('https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=1200')` 
                }}
              >
                <div className="text-white text-left">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-sans font-semibold mb-2">
                    Premium Forest Sanctuary
                  </p>
                  <h3 className="text-2xl sm:text-3.5xl font-serif italic font-medium leading-tight">
                    숲, 그리고 바람이 머무는 자리
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Decorative overlapping circular badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
              className="absolute -bottom-6 -right-3 sm:-right-6 w-36 h-36 sm:w-48 sm:h-48 bg-brand-warm rounded-full flex items-center justify-center p-4 sm:p-6 border-8 border-brand-cream shadow-xl z-20 hover:scale-105 hover:rotate-12 transition-transform duration-500 cursor-pointer"
            >
              <p className="text-center text-[9px] sm:text-[10px] uppercase leading-relaxed font-bold tracking-widest text-brand-green font-sans">
                Nature <br/> & <br/> Emotional <br/> Healing
              </p>
            </motion.div>
          </div>

          {/* Artistic Content (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left lg:pl-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Tag Accent */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green font-sans text-[10px] tracking-widest uppercase font-semibold">
                <Compass className="h-3.5 w-3.5 text-brand-green animate-pulse" /> Forest Glamping Resort
              </span>

              {/* Display Header */}
              <h1 className="font-serif text-4xl sm:text-5.5xl lg:text-6xl italic leading-[1.12] text-brand-green tracking-tight">
                가장 완벽한 <br /> 
                <span className="block pl-10 sm:pl-14 text-brand-gold italic">쉼의 기록</span>
              </h1>

              {/* Narrative Subtitle */}
              <p className="text-xs sm:text-sm leading-relaxed text-brand-charcoal/80 max-w-md font-sans font-light">
                도심의 소란에서 완전히 벗어나 숲의 숨소리를 들어보세요.<br />
                맑은 소나무 향이 온화한 아침을 깨우고, 당신을 위해 준비된 감성적인 텐트와 개별 온수 노천 스파가 평생 기억에 남을 포근한 저녁을 약속합니다.
              </p>
              
              {/* Responsive Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => onNavigate('calendar')} 
                  className="flex-1 bg-brand-green text-brand-cream py-4 rounded-xl font-sans text-xs tracking-widest uppercase font-semibold hover:bg-brand-green-light shadow-lg shadow-brand-green/15 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CalendarDays className="h-4 w-4" /> 예약하기
                </button>
                <button 
                  onClick={() => onNavigate('rooms')} 
                  className="flex-1 border border-brand-green text-brand-green py-4 rounded-xl font-sans text-xs tracking-widest uppercase font-semibold hover:bg-brand-green/5 hover:-translate-y-0.5 transition-all duration-300"
                >
                  둘러보기
                </button>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Ambient Badges Row below the grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24 text-brand-charcoal"
        >
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-brand-warm/60 px-6 py-5 rounded-3xl hover:border-brand-green/20 transition-colors shadow-sm">
            <div className="p-3 bg-brand-green/10 rounded-2xl text-brand-green">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h4 className="font-serif font-bold text-sm tracking-wide text-brand-green">프라이빗 개별 데크</h4>
              <p className="text-[11px] text-brand-charcoal/70 mt-0.5">타인의 시선이 완전 차단된 야외 힐링 공간</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-brand-warm/60 px-6 py-5 rounded-3xl hover:border-brand-green/20 transition-colors shadow-sm">
            <div className="p-3 bg-brand-green/10 rounded-2xl text-brand-green">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h4 className="font-serif font-bold text-sm tracking-wide text-brand-green">개별 온수 노천 스파</h4>
              <p className="text-[11px] text-brand-charcoal/70 mt-0.5">아름다운 반디 숲을 보며 즐기는 반신욕</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-brand-warm/60 px-6 py-5 rounded-3xl hover:border-brand-green/20 transition-colors shadow-sm">
            <div className="p-3 bg-brand-green/10 rounded-2xl text-brand-green">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h4 className="font-serif font-bold text-sm tracking-wide text-brand-green">최고급 호텔식 침구</h4>
              <p className="text-[11px] text-brand-charcoal/70 mt-0.5">매일 살균되는 포근한 프리미엄 구스다운</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
