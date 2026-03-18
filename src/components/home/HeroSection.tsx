import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, Sun, Moon } from 'lucide-react';
import { zodiacSigns } from '@/lib/astrology-data';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Zodiac Ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-20"
        >
          {zodiacSigns.map((sign, index) => {
            const angle = (index * 30) * (Math.PI / 180);
            const radius = 300;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <span
                key={sign.name}
                className="absolute text-4xl text-primary/50"
                style={{
                  left: `calc(50% + ${x}px - 20px)`,
                  top: `calc(50% + ${y}px - 20px)`,
                }}
              >
                {sign.symbol}
              </span>
            );
          })}
        </motion.div>
      </div>

      {/* Floating Celestial Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-10 md:left-20"
      >
        <Sun className="w-12 h-12 text-accent/30" />
      </motion.div>
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-40 right-10 md:right-20"
      >
        <Moon className="w-10 h-10 text-primary/40" />
      </motion.div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-accent">✦ Discover Your Cosmic Path ✦</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient-aurora">AstroTalk Unveiled</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            The Future of Astrology in a Digital World
          </p>
          <p className="text-base md:text-lg text-muted-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Unlock AI-powered horoscopes, Kundali readings, and personalized cosmic guidance.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/horoscope" className="btn-gold flex items-center justify-center gap-2 group">
              Get Free Horoscope
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/booking" className="btn-outline-cosmic flex items-center justify-center gap-2">
              Book Consultation
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-cosmic border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm">10,000+ readings</span>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
              <span className="text-sm">4.9/5 rating</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
