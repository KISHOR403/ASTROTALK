import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock } from 'lucide-react';
import { Astrologer } from '@/lib/astrologer-data';

interface PaymentStepProps {
  astrologer: Astrologer;
  selectedDate: Date;
  selectedTime: string;
  consultationType: string;
}

const inputClass =
  'w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground';

const PaymentStep = ({ astrologer, selectedDate, selectedTime }: PaymentStepProps) => {
  const sessionPrice = Math.round(astrologer.pricePerMinute * 60 / 100 * 1.5);
  const platformFee = 5;
  const total = sessionPrice + platformFee;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-6"
    >
      <h2 className="font-display text-2xl font-semibold text-center mb-6">
        Confirm & Pay
      </h2>

      {/* Summary */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Astrologer</span>
            <span className="font-medium">{astrologer.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">{selectedTime}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Session Fee</span>
            <span className="font-medium">₹{sessionPrice}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-medium">₹{platformFee}</span>
          </div>
          <div className="flex justify-between py-2 pt-3">
            <span className="font-display text-lg font-semibold">Total</span>
            <span className="font-display text-2xl font-bold text-accent">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-accent" />
          Payment Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Cardholder Name</label>
            <input type="text" placeholder="Name on card" className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Card Number</label>
            <input type="text" placeholder="4242 4242 4242 4242" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Expiry</label>
              <input type="text" placeholder="MM/YY" className={inputClass} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">CVC</label>
              <input type="text" placeholder="123" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-success" /> Secure Payment
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-success" /> 256-bit SSL
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;
