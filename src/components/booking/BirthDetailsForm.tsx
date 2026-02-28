import { motion } from 'framer-motion';
import { User, Clock, CalendarDays } from 'lucide-react';
import { LocationInput } from '../LocationInput';

export interface BirthDetails {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  question: string;
}

interface BirthDetailsFormProps {
  details: BirthDetails;
  onChange: (details: BirthDetails) => void;
}

const inputClass =
  'w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground';

const BirthDetailsForm = ({ details, onChange }: BirthDetailsFormProps) => {
  const update = (field: keyof BirthDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="font-display text-2xl font-semibold text-center mb-6">
        Your Birth Details
      </h2>

      <div className="glass-card p-8 space-y-5">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
            <User className="w-4 h-4 text-accent" /> Full Name
          </label>
          <input
            type="text"
            value={details.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Enter your full name"
            className={inputClass}
          />
        </div>

        {/* Date & Time row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-accent" /> Date of Birth
            </label>
            <input
              type="date"
              value={details.dateOfBirth}
              onChange={(e) => update('dateOfBirth', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> Time of Birth
            </label>
            <input
              type="time"
              value={details.timeOfBirth}
              onChange={(e) => update('timeOfBirth', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Place */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
            <User className="w-4 h-4 text-accent" /> Place of Birth
          </label>
          <LocationInput
            value={details.placeOfBirth}
            onChange={(value) => update('placeOfBirth', value)}
            placeholder="Search for your birth city..."
          />
        </div>

        {/* Question */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            Your Question <span className="text-muted-foreground/50">(optional)</span>
          </label>
          <textarea
            value={details.question}
            onChange={(e) => update('question', e.target.value)}
            placeholder="What would you like guidance on? (Career, relationships, health...)"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BirthDetailsForm;
