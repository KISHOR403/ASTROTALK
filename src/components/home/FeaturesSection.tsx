import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  BookOpen, 
  Heart, 
  Compass, 
  Clock,
  TrendingUp 
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Birth Chart Analysis',
    description: 'Get a detailed Kundli with planetary positions, houses, and their effects on your life path.',
    color: 'text-cosmic-purple',
    bgGlow: 'group-hover:shadow-[0_0_40px_rgba(138,43,226,0.3)]',
  },
  {
    icon: Calendar,
    title: 'Daily Horoscopes',
    description: 'Receive personalized daily, weekly, and monthly cosmic guidance for all zodiac signs.',
    color: 'text-cosmic-gold',
    bgGlow: 'group-hover:shadow-[0_0_40px_rgba(255,193,37,0.3)]',
  },
  {
    icon: Users,
    title: 'Expert Consultations',
    description: 'Connect with experienced Vedic astrologers for in-depth readings and guidance.',
    color: 'text-cosmic-blue',
    bgGlow: 'group-hover:shadow-[0_0_40px_rgba(65,105,225,0.3)]',
  },
  {
    icon: Compass,
    title: 'Career Guidance',
    description: 'Understand your professional strengths and favorable periods for growth.',
    color: 'text-cosmic-teal',
    bgGlow: 'group-hover:shadow-[0_0_40px_rgba(0,206,209,0.3)]',
  },
  {
    icon: BookOpen,
    title: 'Learning Resources',
    description: 'Explore our comprehensive library of Vedic astrology articles and guides.',
    color: 'text-cosmic-indigo',
    bgGlow: 'group-hover:shadow-[0_0_40px_rgba(75,0,130,0.3)]',
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 relative" ref={ref}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Unveil the </span>
            <span className="text-gradient-cosmic">Cosmic Mysteries</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Harness the power of ancient Vedic wisdom with our comprehensive 
            astrology platform designed for modern seekers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group glass-card p-8 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${feature.bgGlow}`}
            >
              <div className={`w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-10 h-10 ${feature.color}`} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-gradient-gold transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { icon: Users, value: '50K+', label: 'Happy Users' },
            { icon: Sparkles, value: '100K+', label: 'Charts Generated' },
            { icon: Clock, value: '15+', label: 'Years Experience' },
            { icon: TrendingUp, value: '98%', label: 'Accuracy Rate' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
