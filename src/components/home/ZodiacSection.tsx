import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { zodiacSigns } from '@/lib/astrology-data';

const ZodiacSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const getElementColor = (element: string) => {
    switch (element) {
      case 'Fire': return 'from-orange-500 to-red-600';
      case 'Earth': return 'from-green-500 to-emerald-700';
      case 'Air': return 'from-sky-400 to-blue-600';
      case 'Water': return 'from-blue-400 to-indigo-600';
      default: return 'from-primary to-primary';
    }
  };

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">The Twelve </span>
            <span className="text-gradient-gold">Rashi</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore the unique characteristics, strengths, and cosmic influences 
            of each zodiac sign in Vedic astrology.
          </p>
        </motion.div>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {zodiacSigns.map((sign, index) => (
            <motion.div
              key={sign.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/horoscope?sign=${sign.name.toLowerCase()}`}
                className="group block glass-card p-6 text-center transition-all duration-300 hover:scale-105 hover:border-primary/30"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${getElementColor(sign.element)} flex items-center justify-center group-hover:animate-pulse-glow transition-all duration-300`}>
                  <span className="text-3xl text-white">{sign.symbol}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                  {sign.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{sign.dates}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary/80">
                  <span className="capitalize">{sign.element}</span>
                  <span>•</span>
                  <span>{sign.ruler}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZodiacSection;
