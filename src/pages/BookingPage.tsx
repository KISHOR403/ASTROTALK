import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import StarfieldBackground from '@/components/StarfieldBackground';
import MobileBottomNav from '@/components/MobileBottomNav';
import Logo from '@/components/Logo';
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    ChevronRight,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Slot {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface Astrologer {
    _id: string;
    title: string;
    pricePerMinute: number;
    avatar: string;
    availabilitySlots: Slot[];
    user: {
        name: string;
    };
}

const BookingPage = () => {
    const { astrologerId } = useParams();
    const navigate = useNavigate();
    const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [topic, setTopic] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');

    useEffect(() => {
        const fetchAstrologer = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/astrologers/${astrologerId}`);
                const data = await response.json();
                setAstrologer(data);
            } catch (error) {
                console.error('Error fetching astrologer:', error);
                toast.error("Failed to load astrologer details");
            } finally {
                setIsLoading(false);
            }
        };

        if (astrologerId) fetchAstrologer();
    }, [astrologerId]);

    const handleInitialBooking = async () => {
        if (!selectedSlot || !topic.trim()) {
            toast.error("Please select a slot and enter a consultation topic");
            return;
        }
        setShowPaymentModal(true);
    };

    const handleMockPayment = async () => {
        setPaymentStep('processing');

        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(true);
        try {
            // 1. Create the booking (initially pending payment)
            const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    astrologerId,
                    slotId: selectedSlot?._id,
                    startTime: `${new Date(selectedSlot?.date || '').toLocaleDateString()} ${selectedSlot?.startTime}`,
                    duration: 30,
                    price: (astrologer?.pricePerMinute || 0) * 30,
                    topic
                })
            });

            if (!bookingResponse.ok) {
                const error = await bookingResponse.json();
                throw new Error(error.message || "Booking creation failed");
            }

            const booking = await bookingResponse.json();

            // 2. Update booking to 'paid'
            const payResponse = await fetch(`http://localhost:5000/api/bookings/${booking._id}/pay`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (payResponse.ok) {
                setPaymentStep('success');
                toast.success("Payment successful! Consultation booked.");
                setTimeout(() => navigate(`/dashboard`), 2000);
            } else {
                throw new Error("Payment confirmation failed");
            }
        } catch (error: any) {
            console.error('Error during payment flow:', error);
            toast.error(error.message || "An error occurred");
            setPaymentStep('details');
            setShowPaymentModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Group slots by date
    const groupedSlots = astrologer?.availabilitySlots
        ? astrologer.availabilitySlots
            .filter(s => !s.isBooked)
            .reduce((acc: Record<string, Slot[]>, slot) => {
                const date = new Date(slot.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
                if (!acc[date]) acc[date] = [];
                acc[date].push(slot);
                return acc;
            }, {})
        : {};

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <StarfieldBackground />
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <StarfieldBackground />
            <Navbar />

            <main className="flex-1 container mx-auto px-4 pt-28 pb-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-5 gap-8"
                >
                    {/* Left Column: Astrologer Info & Topic */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="glass-card border-white/5 overflow-hidden">
                            <div className="h-24 bg-gradient-cosmic relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                            </div>
                            <CardContent className="p-6 pt-0 relative -mt-12 text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-cosmic p-1 mx-auto mb-4 relative z-10 shadow-2xl">
                                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-4xl">
                                        {astrologer?.avatar}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-display font-bold">{astrologer?.user.name}</h2>
                                <p className="text-accent text-sm font-medium mb-4">{astrologer?.title}</p>

                                <div className="flex items-center justify-center gap-4 py-3 border-y border-white/5 mb-6">
                                    <div className="text-center px-4">
                                        <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Pricing</p>
                                        <p className="font-display text-lg font-bold">₹{astrologer?.pricePerMinute}<span className="text-[10px] text-muted-foreground ml-1">/min</span></p>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="text-center px-4">
                                        <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Duration</p>
                                        <p className="font-display text-lg font-bold">30<span className="text-[10px] text-muted-foreground ml-1">min</span></p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <MessageSquare className="w-3 h-3 text-primary" /> Consultation Topic
                                    </label>
                                    <Input
                                        placeholder="e.g. Relationship problems, Career guidance..."
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-primary/50"
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">Provide a brief context to help {astrologer?.user.name} prepare for your session.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <AnimatePresence>
                            {selectedSlot && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Card className="border-primary/20 bg-primary/5">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase text-primary tracking-widest">Selected Session</p>
                                                <p className="text-sm font-medium">
                                                    {new Date(selectedSlot.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {selectedSlot.startTime}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            className="w-full btn-cosmic py-6 text-lg group"
                            disabled={!selectedSlot || !topic.trim() || isSubmitting}
                            onClick={handleInitialBooking}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    Confirm Booking <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Right Column: Slot Selection */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-display text-2xl font-bold">Pick a Time Slot</h3>
                                <p className="text-sm text-muted-foreground">Select an available slot for your consultation</p>
                            </div>
                            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary uppercase font-bold text-[10px] tracking-widest px-3">
                                <Clock className="w-3 h-3 mr-1.5" /> India Time
                            </Badge>
                        </div>

                        <div className="space-y-8">
                            {Object.keys(groupedSlots).length > 0 ? (
                                Object.entries(groupedSlots).map(([date, slots]) => (
                                    <div key={date}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <CalendarIcon className="w-4 h-4 text-primary" />
                                            <h4 className="font-bold text-sm tracking-wide">{date}</h4>
                                            <div className="flex-1 h-px bg-white/5" />
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {slots.map((slot) => (
                                                <button
                                                    key={slot._id}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`p-3 rounded-xl border transition-all text-sm font-medium flex items-center justify-center gap-2 ${selectedSlot?._id === slot._id
                                                        ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_20px_hsl(270_60%_55%/0.4)]'
                                                        : 'bg-white/5 border-white/10 hover:border-primary/40 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <Clock className={`w-3.5 h-3.5 ${selectedSlot?._id === slot._id ? 'opacity-100' : 'opacity-40'}`} />
                                                    {slot.startTime}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center glass-card border-white/5 rounded-2xl">
                                    <AlertCircle className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-4" />
                                    <p className="text-muted-foreground font-medium italic">No available slots at the moment.</p>
                                    <Button variant="link" className="text-accent mt-2">Check later</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => paymentStep === 'details' && setShowPaymentModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md glass-card border-white/10 p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10">
                                {paymentStep === 'details' && (
                                    <>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                                <Logo className="w-8 h-8 animate-pulse-glow" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-display font-bold">Secure Checkout</h3>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Mock Gateway</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Consultation Fee (30m)</span>
                                                    <span className="font-bold">₹{(astrologer?.pricePerMinute || 0) * 30}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">GST (18%)</span>
                                                    <span className="font-bold">Included</span>
                                                </div>
                                                <div className="h-px bg-white/5 my-2" />
                                                <div className="flex justify-between text-lg">
                                                    <span className="font-display font-bold">Total Payable</span>
                                                    <span className="font-display font-bold text-gradient-gold">₹{(astrologer?.pricePerMinute || 0) * 30}</span>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
                                                <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                    This is a mock implementation. By clicking "Pay Now", you'll simulate a successful payment transaction.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                variant="ghost"
                                                className="flex-1 hover:bg-white/5"
                                                onClick={() => setShowPaymentModal(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="flex-[2] btn-cosmic py-6"
                                                onClick={handleMockPayment}
                                            >
                                                Pay Now
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {paymentStep === 'processing' && (
                                    <div className="py-12 text-center space-y-6">
                                        <div className="relative w-20 h-20 mx-auto">
                                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Clock className="w-8 h-8 text-primary animate-pulse" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-display font-bold mb-2">Processing Payment</h3>
                                            <p className="text-sm text-muted-foreground italic">Contacting mock financial sanctuary...</p>
                                        </div>
                                    </div>
                                )}

                                {paymentStep === 'success' && (
                                    <div className="py-12 text-center space-y-6">
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-20 h-20 bg-success/20 rounded-full mx-auto flex items-center justify-center"
                                        >
                                            <CheckCircle2 className="w-10 h-10 text-success" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-2xl font-display font-bold text-success mb-2">Success!</h3>
                                            <p className="text-sm text-muted-foreground">Your consultation is confirmed.</p>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-accent mt-4 animate-bounce">Redirecting to Sanctuary...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <MobileBottomNav />
        </div>
    );
};

export default BookingPage;
