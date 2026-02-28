import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Calendar,
    Clock,
    User,
    MessageCircle,
    ChevronRight,
    Filter,
    Search,
    MoreVertical,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Bookings = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bookings/astrologer', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success(`Booking marked as ${newStatus}`);
                fetchBookings(); // Refresh list
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error("An error occurred");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'scheduled':
                return <Badge className="bg-primary/20 text-primary border-primary/20">Scheduled</Badge>;
            case 'completed':
                return <Badge className="bg-success/20 text-success border-success/20">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-destructive/20 text-destructive border-destructive/20">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.topic?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="pt-28 pb-20 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold font-display">Your Consultations</h1>
                            <p className="text-muted-foreground">Manage and track your upcoming and past bookings</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search client or topic..."
                                    className="bg-muted/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl border-white/5 bg-muted/20">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredBookings.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredBookings.map((booking, i) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="glass-card border-white/5 hover:border-white/10 transition-all duration-300 group overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                {/* Time/Date Section */}
                                                <div className="p-6 md:w-48 bg-muted/10 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center justify-between md:justify-center text-center gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-2xl font-bold font-display">
                                                            {new Date(booking.startTime).toLocaleDateString('en-US', { day: '2-digit' })}
                                                        </span>
                                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                                                            {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short' })}
                                                        </span>
                                                    </div>
                                                    <div className="h-8 w-[1px] bg-white/5 md:h-[1px] md:w-12 mx-auto my-2 hidden md:block" />
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-accent">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>

                                                {/* Info Section */}
                                                <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                            <User className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm leading-tight mb-1">{booking.user?.name || 'Anonymous Client'}</h4>
                                                            <p className="text-xs text-muted-foreground">{booking.user?.email || 'No email provided'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                                            <MessageCircle className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm leading-tight mb-1">Topic</h4>
                                                            <p className="text-xs text-muted-foreground line-clamp-1">{booking.topic || 'General Consultation'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between md:justify-end lg:justify-start gap-6">
                                                        <div className="flex flex-col md:items-end lg:items-start">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Status</span>
                                                            {getStatusBadge(booking.status)}
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-auto">
                                                            {booking.status === 'scheduled' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="rounded-xl border-success/20 text-success hover:bg-success/10"
                                                                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                                                    >
                                                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Complete
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        className="rounded-xl bg-gradient-cosmic hover:opacity-90 px-4"
                                                                        onClick={() => navigate(`/chat/${booking._id}`)}
                                                                    >
                                                                        Join Chat
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {booking.status === 'completed' && (
                                                                <Badge variant="outline" className="border-success/30 text-success bg-success/5 px-4 py-1.5 rounded-xl">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Session Completed
                                                                </Badge>
                                                            )}
                                                            <Button variant="ghost" size="icon" className="rounded-xl border border-white/5">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 glass-card rounded-3xl border border-white/5">
                            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar className="w-10 h-10 text-muted-foreground opacity-50" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">No bookings found</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                                You don't have any consultations scheduled yet. Make sure your availability is set!
                            </p>
                            <Button onClick={() => navigate('/astrologer/availability')} variant="outline" className="rounded-xl border-white/10">
                                Update Availability
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Bookings;
