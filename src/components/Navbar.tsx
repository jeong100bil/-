import React from 'react';
import { Menu, X, Tent, Compass, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function Navbar({ onNavigate, activeSection, isAdmin, setIsAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', name: '홈' },
    { id: 'rooms', name: '객실 안내' },
    { id: 'calendar', name: '실시간 예약' },
    { id: 'reviews', name: '방문 후기' },
    { id: 'faq', name: '이용 안내' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-brand-cream/90 backdrop-blur-md shadow-sm py-4 border-b border-brand-warm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => onNavigate('hero')}
          >
            <div className="text-xl sm:text-2xl font-serif italic tracking-tighter text-brand-green">
              휴림의 평온. <span className="text-[10px] font-sans not-italic tracking-[0.2em] uppercase opacity-75 ml-1.5 sm:inline-block hidden">HURIM</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`font-sans text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 relative py-1 hover:text-brand-green ${
                    activeSection === item.id
                      ? 'text-brand-green'
                      : 'text-brand-charcoal/70'
                  }`}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-green rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Admin Toggle & Booking CTA */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  isAdmin ? 'bg-brand-green text-brand-cream' : 'bg-brand-warm text-brand-charcoal/70 hover:bg-brand-sage hover:text-brand-cream'
                }`}
                title={isAdmin ? '관리자 모드 해제' : '관리자 모드로 전환'}
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('calendar')}
                className="bg-brand-green text-brand-cream font-sans text-xs uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-brand-green-light transition-all duration-300 shadow-md shadow-brand-green/10"
              >
                예약하기
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`p-2 rounded-full transition-colors ${
                isAdmin ? 'bg-brand-green text-brand-cream' : 'bg-brand-warm text-brand-charcoal/70'
              }`}
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-brand-green hover:text-brand-gold focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-cream/95 backdrop-blur-lg border-b border-brand-warm"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-sans tracking-wide ${
                    activeSection === item.id
                      ? 'bg-brand-green text-brand-cream font-medium'
                      : 'text-brand-charcoal/80 hover:bg-brand-warm'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 border-t border-brand-warm">
                <button
                  onClick={() => {
                    onNavigate('calendar');
                    setIsOpen(false);
                  }}
                  className="w-full bg-brand-green text-brand-cream text-center font-sans tracking-wider py-3 rounded-xl hover:bg-brand-green-light transition-colors"
                >
                  실시간 예약하기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
