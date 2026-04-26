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
      case 'Fire': return 'from-amber-400 to-amber-600';
      case 'Earth': return 'from-green-400 to-green-600';
      case 'Air': return 'from-blue-400 to-blue-600';
      case 'Water': return 'from-teal-400 to-teal-600';
      default: return 'from-primary to-primary';
    }
  };

  return (
    <section className="py-24 relative overflow-visible" ref={ref}>
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
        <div className="rashi-grid grid gap-4">
          {zodiacSigns.map((sign, index) => (
            <motion.div
              key={sign.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/horoscope?sign=${sign.name.toLowerCase()}`}
                className="group block glass-card p-6 text-center transition-transform duration-300 hover:-translate-y-4 hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] hover:border-primary/30"
              >
                <div
                  className="animate-float will-change-transform"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${getElementColor(sign.element)} flex items-center justify-center transition-all duration-300 group-hover:animate-pulse-glow`}>
                    <span className="text-3xl text-white">{sign.symbol}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                    {sign.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{sign.dates}</p>
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
