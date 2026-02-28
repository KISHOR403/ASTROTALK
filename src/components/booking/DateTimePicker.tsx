import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM',
];

interface DateTimePickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
}

const DateTimePicker = ({ selectedDate, selectedTime, onDateChange, onTimeChange }: DateTimePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const isDateAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date(2026, 1, 4);
    return date >= today && date.getDay() !== 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="font-display text-2xl font-semibold text-center mb-6">
        Select Date & Time
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-5">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-display text-lg font-semibold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-xs text-muted-foreground py-2 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {[...Array(firstDay)].map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const available = isDateAvailable(day);
              const isSelected =
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === currentMonth.getMonth() &&
                selectedDate?.getFullYear() === currentMonth.getFullYear();
              return (
                <button
                  key={day}
                  onClick={() => available && onDateChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                  disabled={!available}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : available
                      ? 'hover:bg-muted'
                      : 'text-muted-foreground/30 cursor-not-allowed'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Available Times
          </h3>
          {selectedDate ? (
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => onTimeChange(time)}
                  className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              Please select a date first
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DateTimePicker;
