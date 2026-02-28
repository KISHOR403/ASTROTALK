import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
    Clock,
    Plus,
    Trash2,
    Save,
    ChevronLeft,
    AlertCircle,
    CalendarDays,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Custom Time Picker ─────────────────────────────────────────
interface TimePickerProps {
    value: string;
    onChange: (val: string) => void;
    label: string;
}

const hours12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

function parse12h(val: string) {
    // "09:30 AM" → { h: "09", m: "30", p: "AM" }
    const match = val.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return { h: '09', m: '00', p: 'AM' };
    let h = match[1].padStart(2, '0');
    if (h === '00') h = '12';
    return { h, m: match[2], p: match[3].toUpperCase() };
}

function format12h(h: string, m: string, p: string) {
    return `${h}:${m} ${p}`;
}

const TimePicker = ({ value, onChange, label }: TimePickerProps) => {
    const [open, setOpen] = useState(false);
    const parsed = parse12h(value);
    const [hour, setHour] = useState(parsed.h);
    const [minute, setMinute] = useState(parsed.m);
    const [period, setPeriod] = useState(parsed.p);

    useEffect(() => {
        const p = parse12h(value);
        setHour(p.h);
        setMinute(p.m);
        setPeriod(p.p);
    }, [value]);

    const commit = (h: string, m: string, p: string) => {
        onChange(format12h(h, m, p));
    };

    const cycleHour = (dir: number) => {
        const idx = hours12.indexOf(hour);
        const next = hours12[(idx + dir + 12) % 12];
        setHour(next);
        commit(next, minute, period);
    };

    const cycleMinute = (dir: number) => {
        const idx = minutes.indexOf(minute);
        const next = minutes[(idx + dir + minutes.length) % minutes.length];
        setMinute(next);
        commit(hour, next, period);
    };

    const togglePeriod = () => {
        const next = period === 'AM' ? 'PM' : 'AM';
        setPeriod(next);
        commit(hour, minute, next);
    };

    return (
        <div className="relative space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</label>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center gap-2 bg-card border rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${open
                        ? 'border-primary/50 ring-2 ring-primary/20 shadow-lg shadow-primary/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
            >
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span className="flex-1 text-left">{value}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-2 z-50"
                    >
                        <div className="bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40">
                            <div className="flex items-center justify-center gap-3">
                                {/* Hour Spinner */}
                                <div className="flex flex-col items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => cycleHour(1)}
                                        className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <div className="w-14 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold font-mono text-primary">
                                        {hour}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => cycleHour(-1)}
                                        className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Colon */}
                                <span className="text-2xl font-bold text-muted-foreground pb-0.5">:</span>

                                {/* Minute Spinner */}
                                <div className="flex flex-col items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => cycleMinute(1)}
                                        className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <div className="w-14 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl font-bold font-mono text-accent">
                                        {minute}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => cycleMinute(-1)}
                                        className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* AM/PM toggle */}
                                <div className="flex flex-col items-center gap-1 ml-2">
                                    <button
                                        type="button"
                                        onClick={togglePeriod}
                                        className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <div className="w-14 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-lg font-bold text-success cursor-pointer"
                                        onClick={togglePeriod}
                                    >
                                        {period}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={togglePeriod}
                                        className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Quick Presets */}
                            <div className="mt-3 pt-3 border-t border-white/5">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Quick Select</p>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '10:00 AM', '01:00 PM', '04:00 PM', '08:00 PM'].map(preset => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => { onChange(preset); setOpen(false); }}
                                            className={`text-[11px] font-medium px-2 py-1.5 rounded-lg transition-all ${value === preset
                                                    ? 'bg-primary/20 text-primary border border-primary/30'
                                                    : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent'
                                                }`}
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Done button */}
                            <div className="mt-3 flex justify-end">
                                <Button size="sm" className="rounded-xl bg-gradient-cosmic text-xs px-4" onClick={() => setOpen(false)}>
                                    Done
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Main Page ──────────────────────────────────────────────────
const Availability = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [slots, setSlots] = useState<{ startTime: string; endTime: string }[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (date) {
            fetchSlots(date);
        }
    }, [date]);

    const fetchSlots = async (selectedDate: Date) => {
        setIsLoading(true);
        try {
            setSlots([]);
        } catch (error) {
            console.error('Error fetching slots:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addSlot = () => {
        setSlots([...slots, { startTime: "09:00 AM", endTime: "10:00 AM" }]);
    };

    const removeSlot = (index: number) => {
        setSlots(slots.filter((_, i) => i !== index));
    };

    const updateSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
        const newSlots = [...slots];
        newSlots[index][field] = value;
        setSlots(newSlots);
    };

    const saveAvailability = async () => {
        if (!date) return;
        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/astrologers/availability/slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    date: date.toISOString(),
                    slots: slots
                })
            });

            if (response.ok) {
                toast.success('Availability updated successfully');
            } else {
                throw new Error('Failed to update availability');
            }
        } catch (error) {
            toast.error('Error saving availability');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout>
            <div className="pt-28 pb-20 min-h-screen">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" className="rounded-xl border border-white/5" onClick={() => window.history.back()}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold font-display">Manage Availability</h1>
                            <p className="text-muted-foreground">Set your consultation hours for specific dates</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Calendar */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="glass-card border-white/5 overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-white/5">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-primary" />
                                        Select Date
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 flex justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md"
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </CardContent>
                            </Card>

                            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                                <p className="text-xs text-primary/90 leading-relaxed">
                                    Tip: Most users book consultations during evening hours (5 PM - 8 PM). Consider opening more slots then!
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Slot Management */}
                        <div className="lg:col-span-8 space-y-6">
                            <Card className="glass-card border-white/5 h-full">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-muted/30">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-accent" />
                                        Hours for {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </CardTitle>
                                    <Button size="sm" onClick={addSlot} className="rounded-xl bg-accent hover:bg-accent/90">
                                        <Plus className="w-4 h-4 mr-2" /> Add Slot
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <p className="text-sm text-muted-foreground font-medium">Loading slots...</p>
                                        </div>
                                    ) : slots.length > 0 ? (
                                        <div className="space-y-4">
                                            <AnimatePresence mode="popLayout">
                                                {slots.map((slot, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="flex flex-col sm:flex-row items-stretch gap-4 p-4 rounded-2xl bg-muted/20 border border-white/5"
                                                    >
                                                        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                                                            <TimePicker
                                                                label="Start Time"
                                                                value={slot.startTime}
                                                                onChange={(val) => updateSlot(index, 'startTime', val)}
                                                            />
                                                            <TimePicker
                                                                label="End Time"
                                                                value={slot.endTime}
                                                                onChange={(val) => updateSlot(index, 'endTime', val)}
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeSlot(index)}
                                                            className="rounded-xl text-destructive hover:bg-destructive/10 shrink-0 self-end sm:self-center"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            <div className="pt-6 border-t border-white/5 mt-8 flex justify-end">
                                                <Button
                                                    onClick={saveAvailability}
                                                    className="rounded-xl px-8 bg-gradient-cosmic hover:opacity-90"
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                    ) : (
                                                        <Save className="w-4 h-4 mr-2" />
                                                    )}
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                                                <Clock className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-bold text-lg mb-1">No slots set for this day</h3>
                                            <p className="text-sm text-muted-foreground mb-6">Users won't be able to book you on this date.</p>
                                            <Button onClick={addSlot} variant="outline" className="rounded-xl border-white/10">
                                                <Plus className="w-4 h-4 mr-2" /> Add First Slot
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Availability;
