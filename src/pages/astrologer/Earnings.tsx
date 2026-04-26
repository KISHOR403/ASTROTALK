import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import StarfieldBackground from '@/components/StarfieldBackground';
import MobileBottomNav from '@/components/MobileBottomNav';
import {
    Wallet,
    TrendingUp,
    Clock,
    CheckCircle2,
    ArrowUpRight,
    Download,
    Filter,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EarningsStats {
    totalEarnings: number;
    monthlyEarnings: number;
    pendingPayout: number;
    sessionsCompleted: number;
}

const Earnings = () => {
    const [stats, setStats] = useState<EarningsStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                const response = await fetch('http://localhost:5000/api/astrologer/earnings', {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`
                    }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching earnings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    const statCards = [
        {
            title: "Total Earnings",
            value: `₹${stats?.totalEarnings.toLocaleString() || '0'}`,
            description: "All-time revenue",
            icon: <Wallet className="w-5 h-5 text-primary" />,
            trend: "+12.5%",
            color: "from-primary/20 to-primary/5"
        },
        {
            title: "This Month",
            value: `₹${stats?.monthlyEarnings.toLocaleString() || '0'}`,
            description: "Feb 2026 revenue",
            icon: <TrendingUp className="w-5 h-5 text-success" />,
            trend: "+8.2%",
            color: "from-success/20 to-success/5"
        },
        {
            title: "Pending Payout",
            value: `₹${stats?.pendingPayout.toLocaleString() || '0'}`,
            description: "Ready for release",
            icon: <Clock className="w-5 h-5 text-warning" />,
            trend: "Available soon",
            color: "from-warning/20 to-warning/5"
        },
        {
            title: "Sessions",
            value: stats?.sessionsCompleted.toString() || '0',
            description: "Completed consultations",
            icon: <CheckCircle2 className="w-5 h-5 text-accent" />,
            trend: "Total count",
            color: "from-accent/20 to-accent/5"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <StarfieldBackground />
            <Navbar />

            <main className="flex-1 container mx-auto px-4 pt-28 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="font-display text-3xl font-bold text-gradient-gold">Earnings Overview</h1>
                        <p className="text-muted-foreground mt-1 text-sm tracking-wide uppercase">Track your financial growth & analytics</p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="glass-card border-white/10 hover:bg-white/5">
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                        <Button className="btn-cosmic px-6">
                            Request Payout
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="glass-card border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-500">
                                <CardContent className="p-6 relative">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                                                {card.icon}
                                            </div>
                                            <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-wider">
                                                {card.trend}
                                            </Badge>
                                        </div>

                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">{card.title}</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold font-display">{card.value}</span>
                                            <ArrowUpRight className="w-4 h-4 text-success opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-2">{card.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Transactions Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 glass-card border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-xl">Payout History</CardTitle>
                                <CardDescription>Records of your historical earnings release</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="hover:bg-white/5"><Filter className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="hover:bg-white/5"><Calendar className="w-4 h-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <ArrowUpRight className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Standard Payout #{2450 + i}</p>
                                                <p className="text-[11px] text-muted-foreground">Feb {10 + i}, 2026 • bank_transfer</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">₹{(12500 * i).toLocaleString()}</p>
                                            <Badge className="bg-success/20 text-success border-success/20 text-[10px]">Success</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/5">
                        <CardHeader>
                            <CardTitle className="text-xl">Monthly Forecast</CardTitle>
                            <CardDescription>Predicted earnings based on current slots</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-8 h-8 text-accent animate-pulse-slow" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">₹18,500</h4>
                                <p className="text-sm text-muted-foreground italic">You have 12 open slots that can potentially generate more revenue this week.</p>
                                <Button variant="link" className="text-accent mt-4">Boost Availability</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <MobileBottomNav />
        </div>
    );
};

export default Earnings;
