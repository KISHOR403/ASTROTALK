import { motion } from 'framer-motion';
import { Star, Clock, Globe, Sparkles } from 'lucide-react';
import { Astrologer } from '@/lib/astrologer-data';

interface AstrologerSelectProps {
  astrologers: Astrologer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const AstrologerSelect = ({ astrologers, selectedId, onSelect }: AstrologerSelectProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-semibold text-center mb-6">
        Choose Your Astrologer
      </h2>
      <div className="grid gap-4">
        {astrologers.map((ast, i) => {
          const isSelected = selectedId === ast.id;
          return (
            <motion.button
              key={ast.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onSelect(ast.id)}
              className={`glass-card p-5 text-left transition-all duration-300 flex items-start gap-5 ${
                isSelected
                  ? 'border-primary bg-primary/10 glow-purple'
                  : 'hover:border-primary/30'
              }`}
            >
              {/* Avatar */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 transition-all ${
                isSelected ? 'bg-primary/20' : 'bg-muted'
              }`}>
                {ast.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-lg font-semibold truncate">{ast.name}</h3>
                  {ast.online && (
                    <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{ast.title}</p>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-accent" />
                    {ast.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {ast.experience}y exp
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    {ast.languages.slice(0, 2).join(', ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    ₹{ast.pricePerMinute}/min
                  </span>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {ast.specializations.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-secondary text-[11px] text-secondary-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price badge */}
              <div className="text-right shrink-0">
                <span className="font-display text-lg font-bold text-accent">
                  ${Math.round(ast.pricePerMinute * 60 / 100 * 1.5)}
                </span>
                <p className="text-[11px] text-muted-foreground">per session</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AstrologerSelect;
