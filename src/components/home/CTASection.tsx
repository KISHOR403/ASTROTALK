import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-cosmic opacity-90" />
          
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-64 h-64 border border-white/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-32 -left-32 w-96 h-96 border border-white/10 rounded-full"
            />
            {[...Array(20)].map((_, i) => (
              <Star
                key={i}
                className="absolute text-white/10 w-4 h-4"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm text-white/90">Begin Your Cosmic Journey</span>
              </div>

              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Unlock Your Destiny?
              </h2>

              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                Join thousands who have discovered their true path through the ancient 
                wisdom of Vedic astrology. Your celestial blueprint awaits.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/birth-chart"
                  className="btn-gold flex items-center justify-center gap-2 group"
                >
                  Generate Free Birth Chart
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-4 rounded-full font-medium bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
