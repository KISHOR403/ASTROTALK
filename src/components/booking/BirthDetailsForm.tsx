import { motion } from 'framer-motion';
import { User, Clock, CalendarDays, ChevronDown } from 'lucide-react';
import { LocationInput } from '../LocationInput';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';

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

const makeTimeSlots = (stepMinutes: number) => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

const timeSlots = makeTimeSlots(15);

const BirthDetailsForm = ({ details, onChange }: BirthDetailsFormProps) => {
  const update = (field: keyof BirthDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  const selectedBirthDate = details.dateOfBirth
    ? parse(details.dateOfBirth, 'yyyy-MM-dd', new Date())
    : undefined;

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-between rounded-lg px-4 py-3 h-auto bg-muted border border-border hover:bg-muted/80",
                    !details.dateOfBirth && "text-muted-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-accent" />
                    {selectedBirthDate ? format(selectedBirthDate, 'PPP') : 'Select date'}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-card border-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={selectedBirthDate}
                  fromYear={1900}
                  toYear={2030}
                  onSelect={(d) => {
                    if (!d) return;
                    update('dateOfBirth', format(d, 'yyyy-MM-dd'));
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> Time of Birth
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-between rounded-lg px-4 py-3 h-auto bg-muted border border-border hover:bg-muted/80",
                    !details.timeOfBirth && "text-muted-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    {details.timeOfBirth
                      ? format(parse(details.timeOfBirth, 'HH:mm', new Date()), 'hh:mm a')
                      : 'Select time'}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3 glass-card border-white/10" align="start">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pick a time</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">15 min steps</p>
                </div>
                <ScrollArea className="h-60 rounded-xl border border-white/10 bg-white/5">
                  <div className="p-2 grid grid-cols-2 gap-2">
                    {timeSlots.map((t) => {
                      const isSelected = details.timeOfBirth === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => update('timeOfBirth', t)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-sm font-medium transition-all border",
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground shadow-[0_0_18px_hsl(270_60%_55%/0.35)]"
                              : "bg-transparent border-white/10 hover:bg-white/10 hover:border-primary/40 text-foreground",
                          )}
                        >
                          {format(parse(t, 'HH:mm', new Date()), 'hh:mm a')}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
                <p className="text-[10px] text-muted-foreground mt-3 italic">
                  Tip: You can approximate if you’re unsure.
                </p>
              </PopoverContent>
            </Popover>
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
