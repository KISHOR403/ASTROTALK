import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Sparkles, Heart, Calendar, Clock, MapPin, User, ArrowRight, Star } from 'lucide-react';

interface Person {
  name: string;
  date: string;
  time: string;
  place: string;
}

interface CompatibilityResult {
  score: number;
  aspects: { name: string; score: number; description: string }[];
  summary: string;
}

const PersonForm = ({ 
  person, 
  setPerson, 
  label 
}: { 
  person: Person; 
  setPerson: (p: Person) => void; 
  label: string;
}) => (
  <div className="glass-card p-6">
    <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
      <Heart className="w-5 h-5 text-cosmic-pink" />
      {label}
    </h3>
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <User className="w-4 h-4" />
          Name
        </label>
        <input
          type="text"
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
          placeholder="Enter name"
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          Date of Birth
        </label>
        <input
          type="date"
          value={person.date}
          onChange={(e) => setPerson({ ...person, date: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="w-4 h-4" />
          Time of Birth (optional)
        </label>
        <input
          type="time"
          value={person.time}
          onChange={(e) => setPerson({ ...person, time: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          Place of Birth (optional)
        </label>
        <input
          type="text"
          value={person.place}
          onChange={(e) => setPerson({ ...person, place: e.target.value })}
          placeholder="City, Country"
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>
    </div>
  </div>
);

const CompatibilityPage = () => {
  const [person1, setPerson1] = useState<Person>({ name: '', date: '', time: '', place: '' });
  const [person2, setPerson2] = useState<Person>({ name: '', date: '', time: '', place: '' });
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateCompatibility = () => {
    if (!person1.name || !person1.date || !person2.name || !person2.date) {
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70;
      setResult({
        score,
        aspects: [
          {
            name: 'Emotional Connection',
            score: Math.floor(Math.random() * 20) + 80,
            description: 'Your emotional wavelengths are beautifully aligned, creating deep understanding and empathy.',
          },
          {
            name: 'Mental Compatibility',
            score: Math.floor(Math.random() * 25) + 75,
            description: 'Intellectual stimulation flows naturally between you, fostering growth and learning.',
          },
          {
            name: 'Physical Harmony',
            score: Math.floor(Math.random() * 20) + 75,
            description: 'Mars and Venus placements indicate strong physical attraction and vitality together.',
          },
          {
            name: 'Life Goals Alignment',
            score: Math.floor(Math.random() * 30) + 70,
            description: 'Your karmic paths share common destinations, supporting mutual growth.',
          },
          {
            name: 'Communication Style',
            score: Math.floor(Math.random() * 20) + 80,
            description: 'Mercury aspects favor clear, honest, and nurturing communication patterns.',
          },
        ],
        summary: `${person1.name} and ${person2.name} share a ${score >= 85 ? 'deeply karmic' : score >= 75 ? 'harmonious' : 'promising'} connection. The planetary alignments suggest ${score >= 85 ? 'a soul-level bond that transcends ordinary relationships' : score >= 75 ? 'strong potential for lasting partnership with mutual growth' : 'opportunities for beautiful growth together through understanding'}. Your ${score >= 80 ? 'Venus-Moon aspects create natural emotional harmony' : 'Mars-Jupiter combinations foster dynamic energy exchange'}. This pairing shows ${score >= 85 ? 'exceptional' : score >= 75 ? 'strong' : 'good'} potential for ${score >= 80 ? 'long-term commitment and deep spiritual growth together' : 'building a meaningful relationship with conscious effort'}.`,
      });
      setIsCalculating(false);
    }, 2500);
  };

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cosmic-pink/10 border border-cosmic-pink/20 mb-6">
              <Heart className="w-4 h-4 text-cosmic-pink" />
              <span className="text-sm text-foreground/80">Kundli Matching</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Cosmic </span>
              <span className="text-gradient-aurora">Compatibility</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover the celestial harmony between two souls with our advanced 
              Vedic compatibility analysis based on Ashtakoota matching.
            </p>
          </motion.div>

          {/* Forms */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PersonForm person={person1} setPerson={setPerson1} label="Partner 1" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PersonForm person={person2} setPerson={setPerson2} label="Partner 2" />
            </motion.div>
          </div>

          {/* Calculate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <button
              onClick={calculateCompatibility}
              disabled={isCalculating || !person1.name || !person1.date || !person2.name || !person2.date}
              className="btn-gold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <>
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Analyzing Cosmic Connection...
                </>
              ) : (
                <>
                  Calculate Compatibility
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Score */}
              <div className="glass-card p-8 text-center mb-8">
                <div className="relative inline-block mb-6">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={553}
                      strokeDashoffset={553 - (553 * result.score) / 100}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(270, 60%, 55%)" />
                        <stop offset="50%" stopColor="hsl(320, 60%, 50%)" />
                        <stop offset="100%" stopColor="hsl(42, 80%, 55%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-5xl font-bold text-gradient-aurora">
                      {result.score}%
                    </span>
                    <span className="text-muted-foreground text-sm">Compatibility</span>
                  </div>
                </div>
                <h2 className="font-display text-2xl font-semibold mb-2">
                  {result.score >= 85 ? 'Exceptional Match!' : result.score >= 75 ? 'Strong Connection' : 'Promising Bond'}
                </h2>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(result.score / 20)
                          ? 'fill-accent text-accent'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Aspects */}
              <div className="glass-card p-8 mb-8">
                <h3 className="font-display text-xl font-semibold mb-6">Compatibility Aspects</h3>
                <div className="space-y-6">
                  {result.aspects.map((aspect, index) => (
                    <div key={aspect.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{aspect.name}</span>
                        <span className="text-accent font-semibold">{aspect.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${aspect.score}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          className="h-full bg-gradient-aurora rounded-full"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{aspect.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="glass-card p-8">
                <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Cosmic Insights
                </h3>
                <p className="text-foreground/90 leading-relaxed text-lg">
                  {result.summary}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CompatibilityPage;
