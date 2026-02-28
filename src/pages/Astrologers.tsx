import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import {
  Star,
  MessageCircle,
  Clock,
  Globe,
  Search,
  Filter,
  Wifi,
  WifiOff,
  Sparkles,
  Users,
} from 'lucide-react';
import { Astrologer } from '@/lib/astrologer-data';

const SPECIALIZATION_FILTERS = [
  'All',
  'Birth Chart',
  'Relationships',
  'Career',
  'Health',
  'Remedies',
  'Numerology',
];

const AstrologerCard = ({ astrologer, index }: { astrologer: any; index: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="glass-card group hover:border-primary/40 transition-all duration-500 overflow-hidden">
        {/* Online Banner */}
        <div
          className={`h-1 w-full ${astrologer.isAvailable
            ? 'bg-gradient-to-r from-success/80 via-success to-success/80'
            : 'bg-muted'
            }`}
        />

        <CardContent className="p-6">
          {/* Top: Avatar + Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-cosmic flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                {astrologer.avatar}
              </div>
              {astrologer.isAvailable && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base font-semibold text-foreground truncate">
                {astrologer.user?.name || astrologer.name}
              </h3>
              <p className="text-xs text-accent font-medium">{astrologer.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                  <span className="text-xs font-semibold text-foreground">{astrologer.rating}</span>
                </div>
                <span className="text-muted-foreground text-[10px]">•</span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {astrologer.totalConsultations?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {astrologer.bio}
          </p>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {astrologer.specializations.map((spec: string) => (
              <span
                key={spec}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/15 text-primary border border-primary/20"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {astrologer.experience}yr exp
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> {astrologer.languages?.join(', ')}
            </span>
          </div>

          {/* Bottom: Price + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="text-lg font-bold text-gradient-gold">₹{astrologer.pricePerMinute}</span>
              <span className="text-[10px] text-muted-foreground">/min</span>
            </div>

            {astrologer.isAvailable ? (
              <button
                onClick={() => navigate(`/chat?room=${astrologer._id}`)}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gradient-cosmic text-primary-foreground hover:shadow-[0_0_30px_hsl(270_60%_55%/0.5)] hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                Chat Now
              </button>
            ) : (
              <div className="text-right">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <WifiOff className="w-3 h-3" /> Offline
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AstrologersPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [astrologersList, setAstrologersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/astrologers');
        const data = await response.json();
        setAstrologersList(data);
      } catch (error) {
        console.error('Error fetching astrologers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  const filtered = astrologersList.filter((a) => {
    const name = a.user?.name || a.name || '';
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      a.specializations?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter =
      activeFilter === 'All' ||
      a.specializations?.some((s: string) => s.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <section className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-medium">
                Expert Guidance
              </span>
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3 text-gradient-cosmic">
              Consult Our Astrologers
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Connect instantly with verified Vedic astrologers for personalized consultations
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {SPECIALIZATION_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${activeFilter === f
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(270_60%_55%/0.4)]'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((a, i) => (
                  <AstrologerCard key={a._id} astrologer={a} index={i} />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="font-display text-lg">No astrologers found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};
export default AstrologersPage;
