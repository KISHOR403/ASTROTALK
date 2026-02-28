import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users,
    Calendar,
    IndianRupee,
    MessageSquare,
    SwitchCamera,
    LogOut,
    User as UserIcon,
    Bell,
    CheckCircle2,
    Clock,
    ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card className="glass-card border-white/5 hover:border-primary/20 transition-all duration-300">
        <CardContent className="p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-2xl font-bold font-display">{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span className="text-[10px] font-bold text-success px-1.5 py-0.5 rounded-full bg-success/10 flex items-center gap-0.5">
                                <ArrowUpRight className="w-2.5 h-2.5" />
                                {trend}
                            </span>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-2xl ${color} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </CardContent>
    </Card>
);

const AstrologerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/astrologers/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const toggleAvailability = async () => {
        setIsToggling(true);
        try {
            const response = await fetch('http://localhost:5000/api/astrologers/availability', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ isAvailable: !stats.isAvailable })
            });
            const updated = await response.json();
            setStats({ ...stats, isAvailable: updated.isAvailable });
        } catch (error) {
            console.error('Error toggling availability:', error);
        } finally {
            setIsToggling(false);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="pt-28 pb-20 min-h-screen">
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 mb-2"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-cosmic p-[1px]">
                                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center text-xl">
                                        ✨
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold font-display">Welcome, {user?.name}</h1>
                                    <p className="text-sm text-muted-foreground">Here&apos;s your consultation summary</p>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/30 border border-white/5">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-1">Status</span>
                                    <Badge variant={stats?.isAvailable ? "outline" : "secondary"} className={`text-[10px] h-5 ${stats?.isAvailable ? 'text-success border-success/30' : ''}`}>
                                        {stats?.isAvailable ? "Online" : "Offline"}
                                    </Badge>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className={`rounded-xl border-white/10 hover:bg-primary/20 ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={toggleAvailability}
                                    disabled={isToggling}
                                >
                                    <SwitchCamera className="w-4 h-4 mr-2" />
                                    Toggle
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        <StatCard
                            title="Total Bookings"
                            value={stats?.totalBookings || 0}
                            icon={Users}
                            trend="+12%"
                            color="bg-primary"
                        />
                        <StatCard
                            title="Today's Sessions"
                            value={stats?.todaysSessions || 0}
                            icon={Calendar}
                            color="bg-accent"
                        />
                        <StatCard
                            title="Total Earnings"
                            value={`₹${stats?.totalEarnings || 0}`}
                            icon={IndianRupee}
                            trend="+8%"
                            color="bg-success"
                        />
                        <StatCard
                            title="Unread Messages"
                            value={stats?.unreadMessages || 0}
                            icon={MessageSquare}
                            color="bg-purple-500"
                        />
                    </div>

                    {/* Quick Actions & Recent Sessions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 glass-card border-white/5">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold">Upcoming Sessions</CardTitle>
                                <Button variant="link" className="text-accent hover:text-accent/80 text-xs px-0">View all</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-white/5 hover:border-white/10 transition-colors group">
                                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                                                👤
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm">Prashant Kumar</h4>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    Today, 4:30 PM (30 min)
                                                </p>
                                            </div>
                                            <div className="hidden sm:flex flex-col items-end gap-1.5">
                                                <Badge variant="outline" className="text-[10px] text-accent border-accent/20">Career Guidance</Badge>
                                                <span className="text-[10px] font-bold text-success">₹450</span>
                                            </div>
                                            <Button size="sm" className="rounded-xl ml-2 bg-gradient-cosmic">Join Chat</Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="glass-card border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Quick Controls</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        onClick={() => navigate('/astrologer/edit-profile')}
                                        className="w-full justify-start rounded-xl py-6 border-white/5 bg-muted/20 hover:bg-muted/30 text-foreground" variant="outline"
                                    >
                                        <UserIcon className="w-4 h-4 mr-3 text-primary" />
                                        Edit Profile
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/astrologer/earnings')}
                                        className="w-full justify-start rounded-xl py-6 border-white/5 bg-muted/20 hover:bg-muted/30 text-foreground" variant="outline"
                                    >
                                        <IndianRupee className="w-4 h-4 mr-3 text-success" />
                                        Withdrawal Info
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/astrologer/notifications')}
                                        className="w-full justify-start rounded-xl py-6 border-white/5 bg-muted/20 hover:bg-muted/30 text-foreground" variant="outline"
                                    >
                                        <Bell className="w-4 h-4 mr-3 text-accent" />
                                        Notification Settings
                                    </Button>
                                    <div className="pt-4 border-t border-white/5">
                                        <Button
                                            onClick={logout}
                                            className="w-full justify-start rounded-xl py-6 border-destructive/20 bg-destructive/10 hover:bg-destructive/20 text-destructive"
                                            variant="ghost"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Logout from Dashboard
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-cosmic border-none overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                    <CheckCircle2 className="w-32 h-32" />
                                </div>
                                <CardContent className="p-6 relative z-10">
                                    <h4 className="font-bold text-white mb-2">Want to grow your reach?</h4>
                                    <p className="text-white/80 text-xs mb-4">Complete your advanced certification to get featured in the Top 10 list.</p>
                                    <Button size="sm" className="bg-white text-primary hover:bg-white/90 rounded-xl">Get Started</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AstrologerDashboard;
