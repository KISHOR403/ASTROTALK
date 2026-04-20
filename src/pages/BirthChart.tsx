import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { Sparkles, Calendar, Clock, User, ArrowRight, Download, Info, ChevronDown, ChevronUp, AlertCircle, BookOpen } from 'lucide-react';
import { LocationInput } from '@/components/LocationInput';

// ── Types ──────────────────────────────────────────────────────────────────
interface BirthDetails {
  name: string;
  date: string;
  time: string;
  place: string;
}

interface InterpretationSection {
  title: string;
  icon: string;
  sign: string;
  signHindi: string;
  lord: string;
  element: string;
  description: string;
}

interface PlanetDetail {
  planet: string;
  sign: string;
  signHindi: string;
  house: number;
  degree: string;
  lord: string;
  interpretation: string;
}

interface PlanetaryPosition {
  planet: string;
  sign: string;
  house: number;
  degree: string;
  nakshatra: string;
  isRetrograde: boolean;
}

interface ChartData {
  ascendant: string;
  ascendantDegree: string;
  sunSign: string;
  moonSign: string;
  housePlanets: Record<number, string[]>;
  houseRashiNumbers: Record<number, number>;
  planetaryPositions: PlanetaryPosition[];
  interpretations: {
    sections: InterpretationSection[];
    planetDetails: PlanetDetail[];
    overallReport?: string;
  };
}

// ── North Indian Kundli SVG ────────────────────────────────────────────────
const RASHI_SYMBOLS = ['', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

// North Indian chart: house positions (center point for text placement)
// The chart is a square with diagonals creating 12 triangular houses
const HOUSE_TEXT_POSITIONS: Record<number, { x: number; y: number }> = {
  1:  { x: 200, y: 115 },  // Top center (Ascendant)
  2:  { x: 110, y: 70 },   // Top-left upper
  3:  { x: 55,  y: 115 },  // Left upper
  4:  { x: 110, y: 200 },  // Left center
  5:  { x: 55,  y: 285 },  // Left lower
  6:  { x: 110, y: 330 },  // Bottom-left
  7:  { x: 200, y: 285 },  // Bottom center
  8:  { x: 290, y: 330 },  // Bottom-right
  9:  { x: 345, y: 285 },  // Right lower
  10: { x: 290, y: 200 },  // Right center
  11: { x: 345, y: 115 },  // Right upper
  12: { x: 290, y: 70 },   // Top-right upper
};

interface KundliChartProps {
  housePlanets: Record<number, string[]>;
  houseRashiNumbers: Record<number, number>;
  ascendant: string;
}

const KundliChart = ({ housePlanets, houseRashiNumbers, ascendant }: KundliChartProps) => {
  const S = 400; // viewBox size
  const P = 20;  // padding
  const M = S / 2; // midpoint

  return (
    <div className="relative aspect-square max-w-lg mx-auto">
      <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.15))' }}>
        <defs>
          <linearGradient id="kundliBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--card))" />
            <stop offset="100%" stopColor="hsl(var(--muted))" />
          </linearGradient>
          <linearGradient id="kundliBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F4D03F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background fill */}
        <rect x={P} y={P} width={S - 2 * P} height={S - 2 * P} fill="url(#kundliBg)" rx="4" />

        {/* Outer border */}
        <rect x={P} y={P} width={S - 2 * P} height={S - 2 * P} fill="none" stroke="url(#kundliBorder)" strokeWidth="2.5" rx="4" />

        {/* Inner diamond (rotated square connecting midpoints) */}
        <polygon
          points={`${M},${P} ${S - P},${M} ${M},${S - P} ${P},${M}`}
          fill="none"
          stroke="url(#kundliBorder)"
          strokeWidth="1.5"
        />

        {/* Diagonal lines from corners to center */}
        <line x1={P} y1={P} x2={M} y2={M} stroke="hsl(var(--border))" strokeWidth="1" opacity="0.5" />
        <line x1={S - P} y1={P} x2={M} y2={M} stroke="hsl(var(--border))" strokeWidth="1" opacity="0.5" />
        <line x1={P} y1={S - P} x2={M} y2={M} stroke="hsl(var(--border))" strokeWidth="1" opacity="0.5" />
        <line x1={S - P} y1={S - P} x2={M} y2={M} stroke="hsl(var(--border))" strokeWidth="1" opacity="0.5" />

        {/* House labels + planets */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house) => {
          const pos = HOUSE_TEXT_POSITIONS[house];
          const rashiNum = houseRashiNumbers[house] || house;
          const planets = housePlanets[house] || [];
          const isAscendant = house === 1;

          return (
            <g key={house}>
              {/* Rashi number */}
              <text
                x={pos.x}
                y={pos.y - (planets.length > 0 ? 12 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs"
                fill={isAscendant ? '#D4AF37' : 'hsl(var(--muted-foreground))'}
                fontWeight={isAscendant ? 'bold' : 'normal'}
                fontSize={isAscendant ? '13' : '11'}
              >
                {RASHI_SYMBOLS[rashiNum]} {rashiNum}
              </text>

              {/* Planet abbreviations */}
              {planets.length > 0 && (
                <text
                  x={pos.x}
                  y={pos.y + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#D4AF37"
                  fontSize="11"
                  fontWeight="600"
                  filter="url(#glow)"
                >
                  {planets.join(' ')}
                </text>
              )}

              {/* Ascendant marker */}
              {isAscendant && (
                <text
                  x={pos.x}
                  y={pos.y + (planets.length > 0 ? 24 : 14)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#D4AF37"
                  fontSize="8"
                  fontWeight="bold"
                  opacity="0.7"
                >
                  ASC
                </text>
              )}
            </g>
          );
        })}

        {/* Center label */}
        <text x={M} y={M - 8} textAnchor="middle" dominantBaseline="middle" fill="#D4AF37" fontSize="14" fontFamily="serif" fontWeight="bold">
          ऐआई कुंडली
        </text>
        <text x={M} y={M + 10} textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--muted-foreground))" fontSize="10">
          AI Kundli
        </text>
      </svg>
    </div>
  );
};

// ── Expandable Interpretation Section ──────────────────────────────────────
const InterpretationCard = ({ section }: { section: InterpretationSection }) => {
  const [expanded, setExpanded] = useState(false);

  const elementColors: Record<string, string> = {
    Fire: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    Earth: 'text-green-400 bg-green-400/10 border-green-400/20',
    Air: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    Water: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  };

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <div>
            <h4 className="font-display font-semibold text-foreground">{section.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-accent font-medium text-sm">{section.signHindi}</span>
              <span className="text-muted-foreground text-xs">• Lord: {section.lord}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${elementColors[section.element] || 'text-muted-foreground bg-muted border-border'}`}>
                {section.element}
              </span>
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border/50">
              <p className="text-foreground/85 leading-relaxed mt-4 text-sm">
                {section.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Planet Placement Card ──────────────────────────────────────────────────
const PlanetCard = ({ detail }: { detail: PlanetDetail }) => {
  const [expanded, setExpanded] = useState(false);

  const planetEmojis: Record<string, string> = {
    Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿',
    Jupiter: '♃', Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋',
  };

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl w-8 text-center">{planetEmojis[detail.planet] || '⚫'}</span>
          <div>
            <span className="font-semibold text-foreground text-sm">{detail.planet}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-accent text-xs">{detail.signHindi}</span>
              <span className="text-muted-foreground text-xs">• House {detail.house}</span>
              <span className="text-muted-foreground text-xs">• {detail.degree}</span>
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border/50">
              <p className="text-foreground/85 leading-relaxed mt-3 text-sm">
                {detail.interpretation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────
const BirthChartPage = () => {
  const [birthDetails, setBirthDetails] = useState<BirthDetails>({
    name: '', date: '', time: '', place: '',
  });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateChart = async () => {
    if (!birthDetails.name || !birthDetails.date || !birthDetails.time || !birthDetails.place) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/astro/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateOfBirth: birthDetails.date,
          timeOfBirth: birthDetails.time,
          location: birthDetails.place,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to generate birth chart');
      }

      const data = await response.json();
      setChartData(data.chart);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
              analysis powered by authentic astronomical calculations.
            </p>
          </motion.div>

          {/* Input Form — always visible at top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="glass-card p-8">
              <h2 className="font-display text-2xl font-semibold mb-6 text-foreground">
                Enter Birth Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <User className="w-4 h-4" /> Full Name
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
                    <Calendar className="w-4 h-4" /> Date of Birth
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
                    <Clock className="w-4 h-4" /> Time of Birth
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
                    <User className="w-4 h-4" /> Place of Birth
                  </label>
                  <LocationInput
                    value={birthDetails.place}
                    onChange={(value) => setBirthDetails({ ...birthDetails, place: value })}
                    placeholder="Search for your birth city..."
                  />
                </div>
              </div>

              <button
                onClick={generateChart}
                disabled={isGenerating || !birthDetails.name || !birthDetails.date || !birthDetails.time || !birthDetails.place}
                className="btn-cosmic w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Calculating Your Kundli...
                  </>
                ) : (
                  <>
                    Generate Birth Chart
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Chart Results — full width below form */}
          {chartData ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              {/* Top Row: Chart + Key Positions */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Kundli Chart */}
                <div className="glass-card p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-display text-xl font-semibold">Gemini AI Vedic Chart</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        North Indian Style • {birthDetails.name}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary/20 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                  <KundliChart
                    housePlanets={chartData.housePlanets}
                    houseRashiNumbers={chartData.houseRashiNumbers}
                    ascendant={chartData.ascendant}
                  />
                </div>

                {/* Key Positions + Planetary Table */}
                <div className="space-y-6">
                  {/* Key positions */}
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Key Positions</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-4 bg-muted/50 rounded-lg border border-border/50">
                        <div className="text-2xl mb-1">☉</div>
                        <div className="text-xs text-muted-foreground">Sun Sign</div>
                        <div className="font-semibold text-accent text-sm mt-1">{chartData.sunSign}</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg border border-border/50">
                        <div className="text-2xl mb-1">☽</div>
                        <div className="text-xs text-muted-foreground">Moon Sign</div>
                        <div className="font-semibold text-accent text-sm mt-1">{chartData.moonSign}</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg border border-border/50">
                        <div className="text-2xl mb-1">↑</div>
                        <div className="text-xs text-muted-foreground">Ascendant</div>
                        <div className="font-semibold text-accent text-sm mt-1">{chartData.ascendant}</div>
                        <div className="text-xs text-muted-foreground">{chartData.ascendantDegree}</div>
                      </div>
                    </div>
                  </div>

                  {/* Planetary Positions Table */}
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Planetary Positions</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Planet</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Sign</th>
                            <th className="text-center py-2 px-2 text-muted-foreground font-medium">House</th>
                            <th className="text-right py-2 px-2 text-muted-foreground font-medium">Degree</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chartData.planetaryPositions.map((p) => (
                            <tr key={p.planet} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                              <td className="py-2.5 px-2 font-medium text-foreground">
                                {p.planet}
                                {p.isRetrograde && <span className="ml-1 text-red-400 text-xs">(R)</span>}
                              </td>
                              <td className="py-2.5 px-2 text-accent">{p.sign}</td>
                              <td className="py-2.5 px-2 text-center text-foreground/80">{p.house}</td>
                              <td className="py-2.5 px-2 text-right text-muted-foreground">{p.degree}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interpretation Sections */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Info className="w-6 h-6 text-accent" />
                  <h2 className="font-display text-2xl font-semibold">Detailed Interpretation</h2>
                </div>

                {/* Lagna, Moon, Sun sections */}
                <div className="space-y-3 mb-8">
                  {chartData.interpretations.sections.map((section, i) => (
                    <InterpretationCard key={i} section={section} />
                  ))}
                </div>

                {/* Planet-in-house interpretations */}
                <div className="mb-4">
                  <h3 className="font-display text-lg font-semibold mb-4 text-foreground/90">
                    Planetary House Placements
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Click on each planet to read detailed interpretation of its placement in your chart.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {chartData.interpretations.planetDetails?.map((detail, i) => (
                    <PlanetCard key={i} detail={detail} />
                  ))}
                </div>

                {/* Gemini AI Overall Report */}
                {chartData.interpretations.overallReport && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <div className="glass-card p-8 border border-primary/20 relative overflow-hidden">
                      {/* Decorative gradient */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
                      
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-semibold">AI Kundali Report</h3>
                          <p className="text-xs text-muted-foreground">Powered by Google Gemini AI • Vedic Analysis</p>
                        </div>
                      </div>

                      <p className="text-foreground/90 leading-relaxed text-[15px] whitespace-pre-line">
                        {chartData.interpretations.overallReport}
                      </p>

                      <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span>This interpretation was generated by AI based on your exact planetary positions using classical Vedic astrology principles.</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            !isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md mx-auto"
              >
                <div className="glass-card p-12 text-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 mx-auto">
                    <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">Your Kundli Awaits</h3>
                  <p className="text-muted-foreground">
                    Enter your birth details above to generate your personalized Vedic Kundli with detailed interpretations.
                  </p>
                </div>
              </motion.div>
            )
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BirthChartPage;
