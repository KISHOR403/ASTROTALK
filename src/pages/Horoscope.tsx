import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { zodiacSigns } from '@/lib/astrology-data';
import { Calendar, MessageCircle, Heart, Briefcase, Activity } from 'lucide-react';
import Logo from '@/components/Logo';
import { useHoroscope } from '@/hooks/useHoroscope';
import type { HoroscopePeriod } from '@/types/horoscope';

const getElementStyles = (element: string) => {
  switch (element.toLowerCase()) {
    case 'fire': return 'text-amber-500 bg-amber-500/20 border-amber-500/30';
    case 'earth': return 'text-green-500 bg-green-500/20 border-green-500/30';
    case 'air': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
    case 'water': return 'text-teal-400 bg-teal-400/20 border-teal-400/30';
    default: return 'text-muted-foreground bg-muted/20 border-border';
  }
};

const HoroscopePage = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<HoroscopePeriod>('daily');
  const { data, loading, error } = useHoroscope(activeTab);
  const stars = useMemo(() => {
    // Keep stars stable across renders (avoid "jumping" positions).
    const rand = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 42 }).map((_, i) => {
      const top = rand(i + 1) * 100;
      const left = rand(i + 11) * 100;
      const size = rand(i + 21) > 0.88 ? 2 : 1; // px
      const opacity = 0.35 + rand(i + 31) * 0.45;
      const delay = rand(i + 41) * 4;
      const duration = 2.4 + rand(i + 51) * 2.6;
      return { top, left, size, opacity, delay, duration };
    });
  }, []);

  const handleSignClick = (sign: string) => {
    setSelectedSign(sign.toLowerCase());
    // Smooth scroll to insight panel if it's already open or when it opens
    setTimeout(() => {
      document.getElementById('insight-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  };

  const selectedEntry = selectedSign ? data?.signs?.[selectedSign] : null;
  const selectedSymbol =
    selectedEntry?.sign
      ? zodiacSigns.find(s => s.name.toLowerCase() === selectedEntry.sign.toLowerCase())?.symbol
      : selectedSign
        ? zodiacSigns.find(s => s.name.toLowerCase() === selectedSign)?.symbol
        : undefined;

  const renderStars = (rating: number) => {
    const r = Math.max(1, Math.min(5, rating));
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < r ? 'text-[#C9A84C]' : 'text-white/15'}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
        <span className="sr-only">{r} out of 5</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background font-body transition-colors duration-500 relative overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Base gradient + vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_-10%,rgba(201,168,76,0.10),transparent_55%),radial-gradient(900px_circle_at_10%_25%,rgba(138,43,226,0.16),transparent_60%),radial-gradient(900px_circle_at_90%_70%,rgba(56,189,248,0.10),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

          {/* Soft glows */}
          <div className="absolute -top-40 right-[-15%] w-[740px] h-[740px] bg-[#C9A84C]/6 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute -bottom-52 left-[-15%] w-[680px] h-[680px] bg-primary/12 rounded-full blur-[140px] animate-pulse" />

          {/* Star field */}
          {stars.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-star-twinkle"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.opacity,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>

        <section className="pt-32 pb-24 relative z-10">
          <div className="container mx-auto px-4">
            {/* Header & Tabs */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-8 text-white tracking-wider">
                Cosmic <span className="text-[#C9A84C]">Horoscope</span>
              </h1>
              
              <div className="flex justify-center gap-4">
                {(['daily', 'weekly', 'monthly'] as const).map((tab, idx) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 rounded-full border transition-all duration-500 animate-float uppercase text-xs font-bold tracking-widest
                      ${activeTab === tab 
                        ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10 shadow-[0_0_20px_rgba(201,168,76,0.2)]' 
                        : 'border-white/10 text-white/40 hover:text-white/60'}`}
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Zodiac Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-20">
              {zodiacSigns.map((sign, index) => (
                <button
                  key={sign.name}
                  onClick={() => handleSignClick(sign.name)}
                  className={`group relative glass-card p-6 flex flex-col items-center transition-all duration-500 animate-float
                    ${selectedSign === sign.name.toLowerCase() 
                      ? 'border-[#C9A84C] bg-primary/20 scale-105 shadow-[0_0_40px_rgba(138,43,226,0.3)]' 
                      : 'hover:translate-y-[-10px] hover:shadow-[0_15px_30px_rgba(201,168,76,0.2)]'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border transition-all duration-300 shadow-lg ${getElementStyles(sign.element)} group-hover:scale-110`}>
                    <span className="text-3xl">{sign.symbol}</span>
                  </div>
                  <h3 className="text-white font-display text-lg font-bold mb-1 tracking-wide">{sign.name}</h3>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">{sign.dates}</p>
                </button>
              ))}
            </div>

            {/* Insight Panel */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="max-w-4xl mx-auto py-10 animate-float-slow" id="insight-panel">
                  <div className="glass-card p-10 border-[#C9A84C]/30 bg-black/40 backdrop-blur-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 blur-3xl rounded-full" />
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                      <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto md:mx-0 mb-6 animate-pulse" />
                        <div className="h-9 w-48 bg-white/5 rounded-md mb-3 animate-pulse" />
                        <div className="h-4 w-32 bg-white/5 rounded-md mb-6 animate-pulse" />
                        <div className="space-y-3">
                          <div className="h-4 w-56 bg-white/5 rounded-md animate-pulse" />
                          <div className="h-4 w-44 bg-white/5 rounded-md animate-pulse" />
                        </div>
                      </div>
                      <div className="md:col-span-7 space-y-6">
                        <div className="h-6 w-full bg-white/5 rounded-md animate-pulse" />
                        <div className="h-6 w-5/6 bg-white/5 rounded-md animate-pulse" />
                        <div className="grid grid-cols-1 gap-4 pt-2">
                          <div className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />
                          <div className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />
                          <div className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />
                        </div>
                        <div className="h-12 w-full bg-white/5 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="max-w-3xl mx-auto text-center py-14">
                  <div className="glass-card p-10 border-[#C9A84C]/20 bg-black/35 backdrop-blur-3xl">
                    <p className="text-white font-display text-2xl font-bold mb-2">Couldn’t load horoscope</p>
                    <p className="text-gray-400 text-sm">{error}</p>
                  </div>
                </div>
              ) : selectedSign && selectedEntry ? (
                <motion.div
                  key={selectedSign + activeTab + (data?.date || '')}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  id="insight-panel"
                  className="max-w-4xl mx-auto animate-float-slow"
                >
                  <div className="glass-card p-10 border-[#C9A84C]/30 bg-black/40 backdrop-blur-3xl relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 blur-3xl rounded-full" />
                    
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                      {/* Left Side: Sign Profile */}
                      <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 border-2 shadow-[0_0_30px_rgba(201,168,76,0.2)] ${getElementStyles(selectedEntry.element)}`}>
                          <span className="text-6xl">{selectedSymbol}</span>
                        </div>
                        <h2 className="font-display text-4xl font-bold text-white mb-2 tracking-tight">{selectedEntry.sign}</h2>
                        <p className="text-[#C9A84C] font-semibold tracking-widest text-sm uppercase mb-6">{selectedEntry.dates || data?.date}</p>
                        
                        <div className="flex flex-col gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-2 justify-center md:justify-start">
                            <Logo className="w-5 h-5 animate-pulse-glow" />
                            <span>Tip: <span className="text-white">{selectedEntry.tip}</span></span>
                          </div>
                          <div className="flex items-center gap-2 justify-center md:justify-start">
                            <Activity className="w-4 h-4 text-[#C9A84C]" />
                            <span>Element: <span className="text-white">{selectedEntry.element}</span></span>
                          </div>
                          <div className="flex items-center gap-2 justify-center md:justify-start">
                            <Calendar className="w-4 h-4 text-[#C9A84C]" />
                            <span>
                              Lucky Day: <span className="text-white">{selectedEntry.lucky_day}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 justify-center md:justify-start">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Rating</span>
                            {renderStars(selectedEntry.rating)}
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Predictions */}
                      <div className="md:col-span-7 space-y-8">
                        <p className="text-xl text-gray-300 leading-relaxed font-light italic">
                          "{selectedEntry.overall}"
                        </p>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">
                              <Heart className="w-3.5 h-3.5 text-pink-500" />
                              Love
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{selectedEntry.love}</p>
                          </div>
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">
                              <Briefcase className="w-3.5 h-3.5 text-[#C9A84C]" />
                              Career
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{selectedEntry.career}</p>
                          </div>
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">
                              <Activity className="w-3.5 h-3.5 text-teal-400" />
                              Health
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{selectedEntry.health}</p>
                          </div>
                        </div>

                        {/* Lucky Section */}
                        <div className="flex flex-wrap gap-4 pt-4">
                          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 animate-float">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Color</span>
                            <span className="text-sm text-white font-medium">{selectedEntry.lucky_color}</span>
                          </div>
                          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 animate-float" style={{ animationDelay: '0.5s' }}>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Number</span>
                            <span className="text-sm text-white font-medium">{selectedEntry.lucky_number}</span>
                          </div>
                          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 animate-float" style={{ animationDelay: '1s' }}>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Day</span>
                            <span className="text-sm text-white font-medium">{selectedEntry.lucky_day}</span>
                          </div>
                        </div>

                        <button className="btn-gold w-full flex items-center justify-center gap-3 group">
                          <MessageCircle className="w-5 h-5" />
                          Chat with Astrologer
                          <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">Select a zodiac sign to reveal your destiny...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HoroscopePage;
