import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Check, Sparkles, ShieldCheck, Clock, User } from 'lucide-react';
import { astrologers } from '@/lib/astrologer-data';
import AstrologerSelect from '@/components/booking/AstrologerSelect';
import BirthDetailsForm, { BirthDetails } from '@/components/booking/BirthDetailsForm';
import DateTimePicker from '@/components/booking/DateTimePicker';
import PaymentStep from '@/components/booking/PaymentStep';
import BookingConfirmation from '@/components/booking/BookingConfirmation';

const steps = ['Astrologer', 'Birth Details', 'Date & Time', 'Payment'];

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedAstrologerId, setSelectedAstrologerId] = useState<string | null>(null);
  const [birthDetails, setBirthDetails] = useState<BirthDetails>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    question: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectedAstrologer = astrologers.find((a) => a.id === selectedAstrologerId);
  const stepProgressPct = Math.round(((step - 1) / (steps.length - 1)) * 100);

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedAstrologerId;
      case 2: return !!(birthDetails.name && birthDetails.dateOfBirth && birthDetails.placeOfBirth);
      case 3: return !!(selectedDate && selectedTime);
      case 4: return true;
      default: return false;
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedAstrologerId(null);
    setBirthDetails({ name: '', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '', question: '' });
    setSelectedDate(null);
    setSelectedTime(null);
    setIsConfirmed(false);
  };

  if (isConfirmed && selectedAstrologer && selectedDate && selectedTime) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4">
            <BookingConfirmation
              astrologer={selectedAstrologer}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onBookAnother={handleReset}
            />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-56 left-1/2 -translate-x-1/2 w-[70rem] h-[70rem] rounded-full bg-gradient-to-b from-primary/15 via-accent/10 to-transparent blur-3xl" />
          <div className="absolute bottom-[-18rem] right-[-18rem] w-[38rem] h-[38rem] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto mb-10"
          >
            <div className="glass-card border-white/5 p-7 sm:p-9">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Consultation Booking
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                    <span className="text-foreground">Book a </span>
                    <span className="text-gradient-cosmic">Consultation</span>
                  </h1>
                  <p className="text-muted-foreground text-base md:text-lg mt-3 max-w-2xl">
                    Choose an astrologer, share your details, pick a slot, and confirm — designed to be fast, private, and delightful.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 md:w-[22rem]">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Secure
                    </div>
                    <p className="font-display font-bold text-lg mt-1">Private</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Duration
                    </div>
                    <p className="font-display font-bold text-lg mt-1">30 min</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
                      <User className="w-3.5 h-3.5 text-primary" /> Experts
                    </div>
                    <p className="font-display font-bold text-lg mt-1">{astrologers.length}</p>
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Step {step} of {steps.length}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    {steps[step - 1]}
                  </p>
                </div>
                <div className="h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-cosmic transition-all duration-500"
                    style={{ width: `${stepProgressPct}%` }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-[11px] text-muted-foreground">
                  {steps.map((label, i) => {
                    const s = i + 1;
                    const active = step === s;
                    const done = step > s;
                    return (
                      <div
                        key={label}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-colors ${
                          active
                            ? 'bg-primary/10 border-primary/25 text-foreground'
                            : done
                              ? 'bg-white/5 border-white/10'
                              : 'bg-transparent border-white/5'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            active ? 'bg-primary text-primary-foreground' : done ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {done ? <Check className="w-3.5 h-3.5" /> : s}
                        </span>
                        <span className="truncate">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content + Summary */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-8"
            >
              <div className="glass-card border-white/5 p-6 sm:p-8">
                {step === 1 && (
                  <AstrologerSelect
                    astrologers={astrologers}
                    selectedId={selectedAstrologerId}
                    onSelect={setSelectedAstrologerId}
                  />
                )}

                {step === 2 && (
                  <BirthDetailsForm details={birthDetails} onChange={setBirthDetails} />
                )}

                {step === 3 && (
                  <DateTimePicker
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateChange={setSelectedDate}
                    onTimeChange={setSelectedTime}
                  />
                )}

                {step === 4 && selectedAstrologer && selectedDate && selectedTime && (
                  <PaymentStep
                    astrologer={selectedAstrologer}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    consultationType="video"
                  />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className={`btn-outline-cosmic ${step === 1 ? 'invisible' : ''}`}
                  >
                    Back
                  </button>

                  {step < 4 ? (
                    <button
                      onClick={() => setStep((s) => s + 1)}
                      disabled={!canProceed()}
                      className="btn-cosmic disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsConfirmed(true)}
                      className="btn-gold"
                    >
                      Confirm & Pay
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-4"
            >
              <div className="lg:sticky lg:top-28 space-y-4">
                <div className="glass-card border-white/5 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    Your Summary
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Astrologer</p>
                      {selectedAstrologer ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-cosmic flex items-center justify-center text-xl">
                            {selectedAstrologer.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{selectedAstrologer.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{selectedAstrologer.title}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Not selected yet</p>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Birth details</p>
                      <div className="text-sm space-y-1">
                        <p className={birthDetails.name ? 'text-foreground' : 'text-muted-foreground italic'}>
                          {birthDetails.name || 'Name'}
                        </p>
                        <p className="text-muted-foreground">
                          {birthDetails.dateOfBirth ? birthDetails.dateOfBirth : 'Date of birth'}{birthDetails.timeOfBirth ? ` • ${birthDetails.timeOfBirth}` : ''}
                        </p>
                        <p className="text-muted-foreground truncate">
                          {birthDetails.placeOfBirth || 'Place of birth'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Session</p>
                      <p className="text-sm">
                        {selectedDate ? (
                          <>
                            <span className="font-semibold">{selectedDate.toLocaleDateString()}</span>
                            <span className="text-muted-foreground">{selectedTime ? ` • ${selectedTime}` : ''}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground italic">Pick a date & time</span>
                        )}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estimated total</span>
                        <span className="font-display font-bold text-gradient-gold">
                          {selectedAstrologer ? `₹${Math.round(selectedAstrologer.pricePerMinute * 30)}` : '—'}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">Based on 30 min at astrologer rate.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card border-white/5 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Tip</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Add a clear question in Birth Details to get a sharper, more actionable reading.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;
