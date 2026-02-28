import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { zodiacSigns } from '@/lib/astrology-data';
import { Calendar, Share2, ArrowRight, Star, Sparkles } from 'lucide-react';

const horoscopeData: Record<string, { daily: string; weekly: string; monthly: string }> = {
  aries: {
    daily: "Today brings powerful energy for new beginnings. Mars, your ruling planet, aligns favorably, boosting your confidence and drive. Take initiative in both personal and professional matters. A surprise opportunity may arise in the afternoon.",
    weekly: "This week focuses on relationships and communication. Mercury's transit through your sector encourages important conversations. Mid-week brings financial opportunities. The weekend is ideal for rest and reflection.",
    monthly: "February marks a transformative period for Aries. Jupiter's influence expands your horizons, making this an excellent time for travel or learning. Career matters gain momentum after the 15th. Love life flourishes towards month's end.",
  },
  taurus: {
    daily: "Venus bestows harmony on your day. Focus on creative projects and aesthetic pursuits. Financial matters require careful attention. A romantic connection deepens. Evening hours favor relaxation and self-care.",
    weekly: "Stability returns after recent turbulence. Work projects gain traction. Relationship communication improves mid-week. Weekend brings unexpected but pleasant social invitations.",
    monthly: "This month emphasizes home and family. Saturn's influence calls for responsibility in domestic matters. Career recognition comes naturally. Health improves with consistent routines.",
  },
  gemini: {
    daily: "Mercury's favorable position sharpens your wit and communication skills. Important information comes your way. Short trips prove beneficial. Evening favors intellectual pursuits and learning.",
    weekly: "A dynamic week lies ahead. New connections spark inspiration. Financial opportunities emerge through networking. Weekend calls for rest and introspection.",
    monthly: "Communication projects flourish this month. Travel possibilities expand. Sibling or neighbor relationships take center stage. Creative endeavors receive cosmic support.",
  },
  cancer: {
    daily: "The Moon illuminates your emotional landscape. Intuition guides important decisions. Family matters require attention. A nurturing activity brings deep satisfaction. Trust your inner wisdom.",
    weekly: "Emotional clarity emerges. Home improvements are favored. Career discussions yield positive results. Weekend brings joyful family moments.",
    monthly: "Focus shifts to financial security. New income sources may emerge. Emotional healing progresses. Real estate matters are favored after mid-month.",
  },
  leo: {
    daily: "The Sun empowers your natural charisma. Leadership opportunities arise. Creative projects shine. Romance blossoms in unexpected places. Express yourself boldly.",
    weekly: "Your star power intensifies. Recognition comes for past efforts. Social calendar fills up. Weekend brings romantic possibilities.",
    monthly: "Personal reinvention is the theme. Self-improvement efforts yield visible results. Career advancement accelerates. Love life transforms beautifully.",
  },
  virgo: {
    daily: "Mercury enhances your analytical abilities. Details that others miss become clear to you. Health routines benefit from attention. Service to others brings deep satisfaction.",
    weekly: "Organization brings peace of mind. Work projects require precision. Health improvements are noticeable. Weekend favors quiet reflection.",
    monthly: "Behind-the-scenes work pays off. Spiritual practices deepen. Health reaches optimal levels. Prepare for a major cycle beginning next month.",
  },
  libra: {
    daily: "Venus harmonizes your relationships. Partnerships flourish. Artistic pursuits receive cosmic blessing. Balance work and play. Social events bring valuable connections.",
    weekly: "Relationship focus intensifies. Business partnerships prosper. Creative projects gain momentum. Weekend brings romantic adventures.",
    monthly: "Social expansion is highlighted. New friendships form. Group activities bring joy. Long-term goals clarify beautifully.",
  },
  scorpio: {
    daily: "Pluto's transformative energy is strong. Hidden truths emerge. Financial matters improve. Emotional depth enriches relationships. Trust your powerful intuition.",
    weekly: "Transformation accelerates. Career recognition arrives. Intimate relationships deepen. Weekend favors private reflection.",
    monthly: "Career reaches new heights. Public recognition increases. Authority figures support your goals. Personal power strengthens.",
  },
  sagittarius: {
    daily: "Jupiter expands your horizons. Learning opportunities abound. Travel plans take shape. Optimism attracts good fortune. Philosophical insights emerge.",
    weekly: "Adventure calls strongly. Educational pursuits flourish. International connections develop. Weekend brings inspiring discoveries.",
    monthly: "Higher education and travel are emphasized. Publishing opportunities arise. Legal matters resolve favorably. Philosophical understanding deepens.",
  },
  capricorn: {
    daily: "Saturn rewards your discipline. Career matters advance steadily. Long-term plans solidify. Authority figures offer support. Patience brings lasting rewards.",
    weekly: "Shared resources improve. Intimate connections deepen. Investment decisions are favored. Weekend brings transformative insights.",
    monthly: "Deep transformation of shared finances. Intimacy reaches new levels. Inheritance or insurance matters resolve. Psychological insights emerge.",
  },
  aquarius: {
    daily: "Uranus sparks innovation. Unexpected opportunities arise. Technology aids your goals. Community involvement brings satisfaction. Embrace your uniqueness.",
    weekly: "Relationships take center stage. Partnership opportunities emerge. Collaboration brings success. Weekend favors romantic connection.",
    monthly: "Partnerships dominate the landscape. Business and personal relationships deepen. Legal agreements are favored. Balance self with others.",
  },
  pisces: {
    daily: "Neptune enhances your intuition. Creative inspiration flows freely. Spiritual practices bring peace. Compassion opens doors. Dreams carry important messages.",
    weekly: "Health routines improve. Work productivity increases. Service brings fulfillment. Weekend favors rest and healing.",
    monthly: "Daily routines transform. Work environment improves. Health optimization succeeds. Service to others brings deep satisfaction.",
  },
};

const HoroscopePage = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const selectedSignData = selectedSign ? zodiacSigns.find(s => s.name.toLowerCase() === selectedSign) : null;
  const horoscope = selectedSign ? horoscopeData[selectedSign] : null;

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground/80">Daily Cosmic Guidance</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Your </span>
              <span className="text-gradient-cosmic">Horoscope</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Select your zodiac sign to receive personalized cosmic insights 
              for today, this week, and the month ahead.
            </p>
          </motion.div>

          {/* Zodiac Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 mb-12"
          >
            {zodiacSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => setSelectedSign(sign.name.toLowerCase())}
                className={`glass-card p-4 text-center transition-all duration-300 hover:scale-105 ${
                  selectedSign === sign.name.toLowerCase()
                    ? 'border-accent bg-accent/10 glow-gold'
                    : 'hover:border-primary/30'
                }`}
              >
                <span className="text-2xl block mb-1">{sign.symbol}</span>
                <span className="text-xs text-muted-foreground">{sign.name}</span>
              </button>
            ))}
          </motion.div>

          {/* Horoscope Display */}
          {selectedSign && selectedSignData && horoscope && (
            <motion.div
              key={selectedSign}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Sign Header */}
              <div className="glass-card p-8 mb-6 text-center">
                <span className="text-6xl mb-4 block">{selectedSignData.symbol}</span>
                <h2 className="font-display text-3xl font-bold text-gradient-gold mb-2">
                  {selectedSignData.name}
                </h2>
                <p className="text-muted-foreground">
                  {selectedSignData.dates} • {selectedSignData.element} Sign • Ruled by {selectedSignData.ruler}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 capitalize ${
                      activeTab === tab
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Horoscope Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Calendar className="w-6 h-6 text-accent" />
                  <span className="text-foreground font-medium capitalize">
                    {activeTab === 'daily' && 'February 4, 2026'}
                    {activeTab === 'weekly' && 'Week of February 3-9, 2026'}
                    {activeTab === 'monthly' && 'February 2026'}
                  </span>
                </div>
                
                <p className="text-lg text-foreground/90 leading-relaxed mb-8">
                  {horoscope[activeTab]}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary/20 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-muted-foreground text-sm mr-2">Lucky:</span>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">7</span>
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">Purple</span>
                      <span className="px-3 py-1 rounded-full bg-cosmic-teal/20 text-cosmic-teal text-sm">Tuesday</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Empty State */}
          {!selectedSign && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Star className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Select your zodiac sign above to reveal your horoscope
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default HoroscopePage;
