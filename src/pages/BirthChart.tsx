import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { zodiacSigns, planets } from '@/lib/astrology-data';
import { Sparkles, Calendar, Clock, User, ArrowRight, Download, Info } from 'lucide-react';
import { LocationInput } from '@/components/LocationInput';

interface BirthDetails {
  name: string;
  date: string;
  time: string;
  place: string;
}

interface ChartData {
  ascendant: string;
  moonSign: string;
  sunSign: string;
  planetaryPositions: { planet: string; sign: string; house: number; degree: string }[];
  interpretation: string;
}

const BirthChartPage = () => {
  const [birthDetails, setBirthDetails] = useState<BirthDetails>({
    name: '',
    date: '',
    time: '',
    place: '',
  });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateChart = () => {
    if (!birthDetails.name || !birthDetails.date || !birthDetails.time || !birthDetails.place) {
      return;
    }

    setIsGenerating(true);

    // Simulated chart generation
    setTimeout(() => {
      const randomSign = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
      const moonSign = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
      const sunSign = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];

      const positions = planets.map((planet, index) => ({
        planet: planet.name,
        sign: zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)].name,
        house: (index % 12) + 1,
        degree: `${Math.floor(Math.random() * 30)}°${Math.floor(Math.random() * 60)}'`,
      }));

      setChartData({
        ascendant: randomSign.name,
        moonSign: moonSign.name,
        sunSign: sunSign.name,
        planetaryPositions: positions,
        interpretation: `Dear ${birthDetails.name}, your birth chart reveals a powerful cosmic blueprint. With ${randomSign.name} rising, you possess ${randomSign.element === 'Fire' ? 'dynamic energy and natural leadership' : randomSign.element === 'Earth' ? 'practical wisdom and groundedness' : randomSign.element === 'Air' ? 'intellectual brilliance and social grace' : 'deep emotional intelligence and intuition'}. Your Moon in ${moonSign.name} indicates an emotional nature that is ${moonSign.element === 'Water' ? 'deeply sensitive and nurturing' : moonSign.element === 'Fire' ? 'passionate and expressive' : moonSign.element === 'Earth' ? 'stable and security-oriented' : 'curious and communicative'}. The Sun in ${sunSign.name} reveals your core identity as someone who ${sunSign.element === 'Fire' ? 'radiates confidence and inspires others' : sunSign.element === 'Earth' ? 'builds lasting foundations and seeks material security' : sunSign.element === 'Air' ? 'values intellectual growth and connections' : 'navigates life through emotional wisdom'}.`,
      });
      setIsGenerating(false);
    }, 2000);
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground/80">Vedic Kundli Generator</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Your </span>
              <span className="text-gradient-gold">Birth Chart</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover your cosmic blueprint with a personalized Vedic birth chart
              analysis based on ancient astronomical calculations.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl font-semibold mb-6 text-foreground">
                  Enter Birth Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={birthDetails.name}
                      onChange={(e) => setBirthDetails({ ...birthDetails, name: e.target.value })}
                      placeholder="Enter your full name"
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
                      value={birthDetails.date}
                      onChange={(e) => setBirthDetails({ ...birthDetails, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      Time of Birth
                    </label>
                    <input
                      type="time"
                      value={birthDetails.time}
                      onChange={(e) => setBirthDetails({ ...birthDetails, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Accurate birth time is crucial for precise chart calculation
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="w-4 h-4" />
                      Place of Birth
                    </label>
                    <LocationInput
                      value={birthDetails.place}
                      onChange={(value) => setBirthDetails({ ...birthDetails, place: value })}
                      placeholder="Search for your birth city..."
                    />
                  </div>

                  <button
                    onClick={generateChart}
                    disabled={isGenerating || !birthDetails.name || !birthDetails.date || !birthDetails.time || !birthDetails.place}
                    className="btn-cosmic w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Calculating Chart...
                      </>
                    ) : (
                      <>
                        Generate Birth Chart
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Chart Display */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {chartData ? (
                <div className="space-y-6">
                  {/* Visual Chart */}
                  <div className="glass-card p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-display text-xl font-semibold">Rashi Chart</h3>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary/20 transition-colors">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>

                    {/* Simplified Chart Visualization */}
                    <div className="relative aspect-square max-w-md mx-auto">
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Outer square */}
                        <rect x="20" y="20" width="360" height="360" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
                        {/* Inner square rotated */}
                        <rect x="110" y="110" width="180" height="180" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.5" transform="rotate(45 200 200)" />
                        {/* Diagonal lines */}
                        <line x1="20" y1="20" x2="200" y2="200" stroke="hsl(var(--border))" strokeWidth="1" />
                        <line x1="380" y1="20" x2="200" y2="200" stroke="hsl(var(--border))" strokeWidth="1" />
                        <line x1="20" y1="380" x2="200" y2="200" stroke="hsl(var(--border))" strokeWidth="1" />
                        <line x1="380" y1="380" x2="200" y2="200" stroke="hsl(var(--border))" strokeWidth="1" />
                        {/* House numbers */}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num, i) => {
                          const positions = [
                            { x: 200, y: 60 }, { x: 290, y: 80 }, { x: 340, y: 150 },
                            { x: 340, y: 250 }, { x: 290, y: 320 }, { x: 200, y: 340 },
                            { x: 110, y: 320 }, { x: 60, y: 250 }, { x: 60, y: 150 },
                            { x: 110, y: 80 }, { x: 200, y: 200 }, { x: 200, y: 200 }
                          ];
                          return (
                            <text
                              key={num}
                              x={positions[i].x}
                              y={positions[i].y}
                              textAnchor="middle"
                              className="fill-muted-foreground text-xs"
                            >
                              {num}
                            </text>
                          );
                        })}
                        {/* Center text */}
                        <text x="200" y="190" textAnchor="middle" className="fill-accent text-lg font-display">
                          {chartData.ascendant}
                        </text>
                        <text x="200" y="210" textAnchor="middle" className="fill-muted-foreground text-xs">
                          Ascendant
                        </text>
                      </svg>
                    </div>
                  </div>

                  {/* Key Positions */}
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Key Positions</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl mb-1">☉</div>
                        <div className="text-sm text-muted-foreground">Sun</div>
                        <div className="font-semibold text-accent">{chartData.sunSign}</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl mb-1">☽</div>
                        <div className="text-sm text-muted-foreground">Moon</div>
                        <div className="font-semibold text-accent">{chartData.moonSign}</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl mb-1">↑</div>
                        <div className="text-sm text-muted-foreground">Ascendant</div>
                        <div className="font-semibold text-accent">{chartData.ascendant}</div>
                      </div>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-accent" />
                      <h3 className="font-display text-lg font-semibold">Interpretation</h3>
                    </div>
                    <p className="text-foreground/90 leading-relaxed">
                      {chartData.interpretation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">Your Chart Awaits</h3>
                  <p className="text-muted-foreground">
                    Enter your birth details to generate your personalized Vedic birth chart
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BirthChartPage;
