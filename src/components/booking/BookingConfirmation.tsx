import { motion } from 'framer-motion';
import { Check, Calendar, Clock, User, Sparkles } from 'lucide-react';
import { Astrologer } from '@/lib/astrologer-data';

interface BookingConfirmationProps {
  astrologer: Astrologer;
  selectedDate: Date;
  selectedTime: string;
  onBookAnother: () => void;
}

const BookingConfirmation = ({ astrologer, selectedDate, selectedTime, onBookAnother }: BookingConfirmationProps) => {
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const bookingId = `VED-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className="max-w-lg mx-auto text-center"
    >
      <div className="glass-card p-10">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-success" />
        </motion.div>

        <h1 className="font-display text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground mb-2">
          Your consultation has been scheduled successfully.
        </p>
        <p className="text-xs text-muted-foreground/70 mb-8">
          Booking ID: <span className="font-mono text-accent">{bookingId}</span>
        </p>

        {/* Details card */}
        <div className="glass-card p-6 text-left mb-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
              {astrologer.avatar}
            </div>
            <div>
              <p className="font-display font-semibold">{astrologer.name}</p>
              <p className="text-sm text-muted-foreground">{astrologer.title}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" /> Date
            </span>
            <span className="font-medium text-sm">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" /> Time
            </span>
            <span className="font-medium text-sm">{selectedTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" /> Session
            </span>
            <span className="font-medium text-sm">60 min Video Call</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          📧 A confirmation email has been sent with joining details.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onBookAnother} className="btn-outline-cosmic">
            Book Another Session
          </button>
          <a href="/dashboard" className="btn-cosmic inline-flex items-center justify-center gap-2">
            <User className="w-4 h-4" /> Go to Dashboard
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;
