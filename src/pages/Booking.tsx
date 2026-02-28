import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Check } from 'lucide-react';
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
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Book a </span>
              <span className="text-gradient-cosmic">Consultation</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Connect with expert Vedic astrologers for personalized guidance.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-12">
            {steps.map((label, i) => {
              const s = i + 1;
              return (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                        step >= s
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step > s ? <Check className="w-5 h-5" /> : s}
                    </div>
                    <span className="text-[11px] text-muted-foreground hidden sm:block">{label}</span>
                  </div>
                  {s < steps.length && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 transition-all mt-[-14px] sm:mt-[-20px] ${
                        step > s ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto">
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
            <div className="flex justify-between mt-10">
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
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;
