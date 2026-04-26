import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const getElementStyles = (element: string) => {
  switch (element.toLowerCase()) {
    case 'fire': return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
    case 'earth': return 'text-green-300 bg-green-500/20 border-green-500/30';
    case 'air': return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
    case 'water': return 'text-teal-300 bg-teal-500/20 border-teal-500/30';
    default: return 'text-muted-foreground bg-muted/20 border-border';
  }
};

const getElementGlow = (element: string) => {
  switch (element.toLowerCase()) {
    case 'fire': return 'shadow-[0_0_30px_rgba(245,158,11,0.35)]';
    case 'earth': return 'shadow-[0_0_30px_rgba(34,197,94,0.35)]';
    case 'air': return 'shadow-[0_0_30px_rgba(59,130,246,0.35)]';
    case 'water': return 'shadow-[0_0_30px_rgba(20,184,166,0.35)]';
    default: return 'shadow-[0_0_30px_rgba(201,168,76,0.2)]';
  }
};

type Period = 'daily' | 'weekly' | 'monthly';

type SignPeriodData = {
  insight: string;
  love: number;
  career: number;
  health: number;
  color: string;
  number: number;
  stone: string;
};

type SignData = {
  symbol: string;
  name: string;
  dateRange: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  planet: string;
  daily: SignPeriodData;
  weekly: SignPeriodData;
  monthly: SignPeriodData;
};

const SIGNS: SignData[] = [
  {
    symbol: '♈',
    name: 'Aries',
    dateRange: 'Mar 21–Apr 19',
    element: 'Fire',
    planet: 'Mars',
    daily: { insight: 'Move first, refine later. A bold start unlocks momentum—just keep your tone warm with others today.', love: 72, career: 81, health: 66, color: 'Crimson', number: 9, stone: 'Red Coral' },
    weekly: { insight: 'This week rewards initiative. Pick one priority, act decisively, and let small wins stack up.', love: 68, career: 84, health: 70, color: 'Scarlet', number: 1, stone: 'Carnelian' },
    monthly: { insight: 'A leadership month. Your clarity sets the pace—avoid overcommitting and protect your recovery time.', love: 74, career: 88, health: 73, color: 'Sunset Orange', number: 5, stone: 'Ruby' },
  },
  {
    symbol: '♉',
    name: 'Taurus',
    dateRange: 'Apr 20–May 20',
    element: 'Earth',
    planet: 'Venus',
    daily: { insight: 'Steady beats speedy. A practical choice today saves you time (and money) later.', love: 76, career: 70, health: 78, color: 'Olive', number: 6, stone: 'Emerald' },
    weekly: { insight: 'Consistency is your superpower this week. Simplify routines and you’ll feel instantly lighter.', love: 73, career: 74, health: 82, color: 'Forest Green', number: 2, stone: 'Jade' },
    monthly: { insight: 'Build something lasting. Slow upgrades—skills, habits, and savings—compound beautifully this month.', love: 79, career: 77, health: 84, color: 'Moss', number: 4, stone: 'Green Aventurine' },
  },
  {
    symbol: '♊',
    name: 'Gemini',
    dateRange: 'May 21–Jun 20',
    element: 'Air',
    planet: 'Mercury',
    daily: { insight: 'Curiosity opens doors. Ask one more question and you’ll uncover the detail everyone missed.', love: 64, career: 78, health: 62, color: 'Sky Blue', number: 3, stone: 'Citrine' },
    weekly: { insight: 'Your network is active—follow up fast. A message you send today becomes a key opportunity.', love: 69, career: 82, health: 66, color: 'Azure', number: 11, stone: 'Blue Lace Agate' },
    monthly: { insight: 'A learning month. Upgrade your tools and communication style; your ideas will land with more impact.', love: 70, career: 86, health: 71, color: 'Electric Blue', number: 7, stone: 'Sapphire' },
  },
  {
    symbol: '♋',
    name: 'Cancer',
    dateRange: 'Jun 21–Jul 22',
    element: 'Water',
    planet: 'Moon',
    daily: { insight: 'Protect your peace. A small boundary today keeps your heart soft and your schedule sane.', love: 80, career: 63, health: 74, color: 'Pearl White', number: 2, stone: 'Pearl' },
    weekly: { insight: 'This week favors home and healing. Declutter one corner and you’ll feel a full reset.', love: 82, career: 66, health: 78, color: 'Silver', number: 9, stone: 'Moonstone' },
    monthly: { insight: 'Emotional clarity grows. Choose relationships that feel safe, and your creativity will surge.', love: 86, career: 72, health: 80, color: 'Seafoam', number: 6, stone: 'Aquamarine' },
  },
  {
    symbol: '♌',
    name: 'Leo',
    dateRange: 'Jul 23–Aug 22',
    element: 'Fire',
    planet: 'Sun',
    daily: { insight: 'Lead with warmth. If you share credit, your influence expands without effort.', love: 75, career: 83, health: 69, color: 'Gold', number: 1, stone: 'Sunstone' },
    weekly: { insight: 'Visibility rises. Step into the spotlight—your voice sets the tone for the group.', love: 72, career: 87, health: 71, color: 'Amber', number: 8, stone: 'Tiger Eye' },
    monthly: { insight: 'A signature month. Build a personal brand moment—showcase work you’re proud of and keep it simple.', love: 78, career: 90, health: 75, color: 'Marigold', number: 10, stone: 'Ruby' },
  },
  {
    symbol: '♍',
    name: 'Virgo',
    dateRange: 'Aug 23–Sep 22',
    element: 'Earth',
    planet: 'Mercury',
    daily: { insight: 'Refine, don’t redo. One precise tweak delivers most of the improvement you’re chasing.', love: 67, career: 80, health: 76, color: 'Sage', number: 5, stone: 'Peridot' },
    weekly: { insight: 'Systems win this week. Organize once, then let your routines carry you effortlessly.', love: 69, career: 83, health: 79, color: 'Pine', number: 4, stone: 'Emerald' },
    monthly: { insight: 'A mastery month. Skill-building and clean habits bring confidence—keep expectations realistic.', love: 72, career: 86, health: 82, color: 'Evergreen', number: 12, stone: 'Jade' },
  },
  {
    symbol: '♎',
    name: 'Libra',
    dateRange: 'Sep 23–Oct 22',
    element: 'Air',
    planet: 'Venus',
    daily: { insight: 'Balance is a decision. Choose the option that feels fair, then stop second-guessing.', love: 78, career: 71, health: 68, color: 'Rose', number: 6, stone: 'Opal' },
    weekly: { insight: 'Partnerships are highlighted. Speak clearly and you’ll avoid a small misunderstanding.', love: 82, career: 74, health: 70, color: 'Blush Pink', number: 2, stone: 'Rose Quartz' },
    monthly: { insight: 'Harmony brings progress. Collaborations thrive—commit to shared timelines and celebrate milestones.', love: 84, career: 79, health: 74, color: 'Champagne', number: 7, stone: 'Diamond' },
  },
  {
    symbol: '♏',
    name: 'Scorpio',
    dateRange: 'Oct 23–Nov 21',
    element: 'Water',
    planet: 'Mars/Pluto',
    daily: { insight: 'Trust your instincts. If something feels off, pause and gather more information before you respond.', love: 71, career: 77, health: 65, color: 'Burgundy', number: 9, stone: 'Garnet' },
    weekly: { insight: 'Depth brings results. Focus on one meaningful task and you’ll finish what others keep delaying.', love: 74, career: 81, health: 69, color: 'Deep Wine', number: 13, stone: 'Obsidian' },
    monthly: { insight: 'Transformation is gentle this month. Release one habit that drains you and your energy returns fast.', love: 78, career: 85, health: 73, color: 'Plum', number: 8, stone: 'Amethyst' },
  },
  {
    symbol: '♐',
    name: 'Sagittarius',
    dateRange: 'Nov 22–Dec 21',
    element: 'Fire',
    planet: 'Jupiter',
    daily: { insight: 'Say yes to the inspiring option. A new idea today becomes a path you’ll love.', love: 66, career: 79, health: 70, color: 'Indigo', number: 3, stone: 'Yellow Sapphire' },
    weekly: { insight: 'Expansion is favored. A short trip, a class, or a bold pitch brings lucky timing.', love: 69, career: 84, health: 73, color: 'Royal Blue', number: 5, stone: 'Turquoise' },
    monthly: { insight: 'A growth month. Aim higher—but keep a simple plan so your freedom stays intact.', love: 74, career: 88, health: 77, color: 'Saffron', number: 11, stone: 'Topaz' },
  },
  {
    symbol: '♑',
    name: 'Capricorn',
    dateRange: 'Dec 22–Jan 19',
    element: 'Earth',
    planet: 'Saturn',
    daily: { insight: 'Discipline pays today. Finish the hardest task first and the rest of the day feels effortless.', love: 62, career: 86, health: 72, color: 'Charcoal', number: 4, stone: 'Blue Sapphire' },
    weekly: { insight: 'Structure brings peace. Set one boundary around time, and you’ll gain momentum immediately.', love: 64, career: 89, health: 75, color: 'Slate', number: 8, stone: 'Onyx' },
    monthly: { insight: 'Long-term wins. Your steady effort becomes visible—keep focus on quality over speed.', love: 69, career: 92, health: 78, color: 'Midnight', number: 10, stone: 'Garnet' },
  },
  {
    symbol: '♒',
    name: 'Aquarius',
    dateRange: 'Jan 20–Feb 18',
    element: 'Air',
    planet: 'Saturn/Uranus',
    daily: { insight: 'Think differently. A creative workaround solves a problem that looked fixed in place.', love: 63, career: 75, health: 67, color: 'Turquoise', number: 11, stone: 'Amethyst' },
    weekly: { insight: 'Community helps. Share your idea and let feedback sharpen it—don’t build alone this week.', love: 66, career: 80, health: 70, color: 'Aqua', number: 7, stone: 'Labradorite' },
    monthly: { insight: 'Innovation meets discipline. Ship something useful, then iterate—you’re closer than you think.', love: 70, career: 85, health: 74, color: 'Cerulean', number: 2, stone: 'Sapphire' },
  },
  {
    symbol: '♓',
    name: 'Pisces',
    dateRange: 'Feb 19–Mar 20',
    element: 'Water',
    planet: 'Jupiter/Neptune',
    daily: { insight: 'Let intuition lead, then ground it with one clear action. Your sensitivity is a strength today.', love: 79, career: 64, health: 71, color: 'Lavender', number: 7, stone: 'Aquamarine' },
    weekly: { insight: 'Your imagination is loud—in the best way. Create, write, design, or dream; then commit to one next step.', love: 82, career: 68, health: 74, color: 'Sea Green', number: 3, stone: 'Pearl' },
    monthly: { insight: 'A healing month. Rest, reflect, and choose environments that nourish you—clarity arrives gently.', love: 86, career: 73, health: 80, color: 'Teal', number: 12, stone: 'Moonstone' },
  },
];

const HoroscopePage = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Period>('daily');
  const panelRef = useRef<HTMLDivElement | null>(null);
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

  const selectedData = useMemo(() => {
    if (!selectedSign) return null;
    return SIGNS.find(s => s.name === selectedSign) ?? null;
  }, [selectedSign]);

  const periodData = selectedData ? selectedData[activeTab] : null;

  useEffect(() => {
    if (!selectedSign) return;
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedSign]);

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
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-8 text-white tracking-wider">
                Cosmic <span className="text-[#C9A84C]">Horoscope</span>
              </h1>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center gap-3 mb-10">
              {(
                [
                  { key: 'daily', label: 'Daily' },
                  { key: 'weekly', label: 'Weekly' },
                  { key: 'monthly', label: 'Monthly' },
                ] as const
              ).map((t, idx) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-6 py-2.5 rounded-full border transition-all duration-300 animate-float text-xs font-bold tracking-widest uppercase
                    ${activeTab === t.key ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Zodiac Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-20">
              {SIGNS.map((sign, index) => (
                <button
                  key={sign.name}
                  onClick={() => setSelectedSign(sign.name)}
                  className={`group relative glass-card p-6 flex flex-col items-center transition-all duration-300 animate-float
                    ${selectedSign === sign.name
                      ? 'border-yellow-500 bg-purple-900/40 scale-105'
                      : 'hover:-translate-y-4 hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border transition-all duration-300 ${getElementStyles(sign.element)} group-hover:scale-110`}>
                    <span className="text-3xl">{sign.symbol}</span>
                  </div>
                  <h3 className="text-white font-display text-lg font-bold mb-1 tracking-wide">{sign.name}</h3>
                  <p className="text-gray-400 text-[11px] tracking-wide">{sign.dateRange}</p>
                </button>
              ))}
            </div>

            {/* Insight Panel */}
            <AnimatePresence mode="wait">
              {selectedData && periodData ? (
                <motion.div
                  key={`${selectedData.name}-${activeTab}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="max-w-4xl mx-auto"
                  id="insight-panel"
                  ref={panelRef}
                >
                  <div className="glass-card p-10 border border-white/10 bg-black/40 backdrop-blur-3xl relative overflow-hidden animate-float-slow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />

                    <div className="grid md:grid-cols-12 gap-10 items-start">
                      {/* Profile */}
                      <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
                        <div
                          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 border-2 ${getElementStyles(selectedData.element)} ${getElementGlow(selectedData.element)}`}
                        >
                          <span className="text-6xl">{selectedData.symbol}</span>
                        </div>

                        <h2 className="font-display text-4xl font-bold text-white mb-2 tracking-tight">{selectedData.name}</h2>
                        <p className="text-gray-300 text-sm tracking-wide mb-6">{selectedData.dateRange}</p>

                        <div className="flex flex-col gap-2 text-sm text-gray-400">
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className="text-gray-500">Planet</span>
                            <span className="text-white">{selectedData.planet}</span>
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className="text-gray-500">Element</span>
                            <span className="text-white">{selectedData.element}</span>
                          </div>
                        </div>
                      </div>

                      {/* Insights */}
                      <div className="md:col-span-7 space-y-8">
                        {/* Meters */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                              <span className="text-rose-300">Love</span>
                              <span className="text-gray-500">{periodData.love}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                              <motion.div
                                key={`love-${selectedData.name}-${activeTab}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${periodData.love}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-rose-500 to-pink-400"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                              <span className="text-yellow-300">Career</span>
                              <span className="text-gray-500">{periodData.career}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                              <motion.div
                                key={`career-${selectedData.name}-${activeTab}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${periodData.career}%` }}
                                transition={{ duration: 0.8, delay: 0.05 }}
                                className="h-full bg-gradient-to-r from-yellow-500 to-amber-400"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                              <span className="text-teal-300">Health</span>
                              <span className="text-gray-500">{periodData.health}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                              <motion.div
                                key={`health-${selectedData.name}-${activeTab}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${periodData.health}%` }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Insight text */}
                        <p className="text-gray-200 text-base leading-relaxed font-light">
                          {periodData.insight}
                        </p>

                        {/* Lucky row */}
                        <div className="flex flex-wrap gap-3 pt-2">
                          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 animate-float">
                            <span className="text-sm">🎨</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Lucky Color</span>
                            <span className="text-sm text-white font-medium">{periodData.color}</span>
                          </div>
                          <div
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 animate-float"
                            style={{ animationDelay: '0.3s' }}
                          >
                            <span className="text-sm">🔢</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Lucky Number</span>
                            <span className="text-sm text-white font-medium">{periodData.number}</span>
                          </div>
                          <div
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 animate-float"
                            style={{ animationDelay: '0.6s' }}
                          >
                            <span className="text-sm">💎</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Lucky Stone</span>
                            <span className="text-sm text-white font-medium">{periodData.stone}</span>
                          </div>
                        </div>

                        <Link to="/chat" className="btn-gold w-full flex items-center justify-center gap-3 group">
                          <MessageCircle className="w-5 h-5" />
                          Chat with Astrologer
                          <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-20" ref={panelRef} id="insight-panel">
                  <p className="text-gray-400 text-lg">Select your zodiac sign to reveal your horoscope</p>
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
