import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import socket from '@/lib/socket';
import { 
    User, 
    Power, 
    DollarSign, 
    Star, 
    Calendar, 
    Clock, 
    MessageSquare,
    ChevronRight,
    TrendingUp,
    Shield
} from 'lucide-react';

const AstrologerDashboard = () => {
    const { user } = useAuth() as any;
    const { toast } = useToast();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            socket.emit('join_room', user._id);
            socket.on('new_notification', (data) => {
                if (data.type === 'new_booking') {
                    // Show toast and add to list
                    toast({ title: "New Chat Request!", description: data.message });
                    setRequests(prev => [data.booking, ...prev]);
                }
            });
            return () => {
                socket.off('new_notification');
            };
        }
    }, [user]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, statsRes, requestsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/astrologer/profile', {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    }),
                    fetch('http://localhost:5000/api/astrologer/dashboard', {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    }),
                    fetch('http://localhost:5000/api/astrologer/requests', {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    })
                ]);

                if (profileRes.ok && statsRes.ok && requestsRes.ok) {
                    setProfile(await profileRes.json());
                    setStats(await statsRes.json());
                    setRequests(await requestsRes.json());
                } else {
                    const errorData = await profileRes.json();
                    if (errorData.message === 'Profile not found') {
                        navigate('/astrologer/onboarding');
                    } else {
                        toast({ title: "Error", description: "Failed to fetch dashboard data", variant: "destructive" });
                    }
                }
            } catch (error) {
                toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
            } finally {
                setLoading(false);
            }

        };
        fetchData();
    }, [user.token]);

    const toggleOnline = async () => {
        const endpoint = profile.isOnline ? 'go-offline' : 'go-online';
        try {
            const res = await fetch(`http://localhost:5000/api/astrologer/${endpoint}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const updated = await res.json();
                setProfile(prev => ({ ...prev, isOnline: updated.isOnline }));
                toast({ 
                    title: updated.isOnline ? "You're Online!" : "You're Offline",
                    description: updated.isOnline ? "Clients can now see you." : "You won't receive new consultation requests.",
                });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    };

    const handleRequest = async (id: string, action: 'accept' | 'reject') => {
        try {
            const res = await fetch(`http://localhost:5000/api/astrologer/requests/${id}/${action}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                toast({ title: `Request ${action}ed` });
                setRequests(prev => prev.filter(r => r._id !== id));
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to process request", variant: "destructive" });
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading Dashboard...</div>;

    return (
        <Layout>
            <div className="min-h-screen py-12 container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
                                <img 
                                    src={profile?.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=Astro"} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-black flex items-center justify-center ${profile?.isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
                                <Power size={12} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                Welcome, {user.name}
                                {profile?.status === 'approved' && <Shield className="text-primary w-6 h-6" />}
                            </h1>
                            <p className="text-white/50">{profile?.specialization?.join(', ')} • {profile?.experience} Years Exp.</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={toggleOnline}
                        className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 hover:scale-105 active:scale-95 ${
                            profile?.isOnline 
                                ? 'bg-red-500/10 border border-red-500/30 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                                : 'bg-green-500/10 border border-green-500/30 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                        }`}
                    >
                        <Power size={20} />
                        Go {profile?.isOnline ? 'Offline' : 'Online'}
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Earnings" value={`₹${stats?.totalEarnings}`} icon={<DollarSign className="text-primary" />} trend="+12% this month" />
                    <StatCard title="Average Rating" value={stats?.averageRating} icon={<Star className="text-yellow-500" />} trend="Based on 48 reviews" />
                    <StatCard title="Consultations" value="124" icon={<MessageSquare className="text-accent" />} trend="24 this week" />
                    <StatCard title="Status" value={profile?.status?.toUpperCase()} icon={<Shield className="text-green-500" />} trend="Verified Member" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Consultations */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Incoming Requests */}
                        {requests.length > 0 && (
                            <div className="space-y-4 mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <MessageSquare className="text-primary" />
                                    Incoming Chat Requests
                                </h2>
                                <div className="grid gap-4">
                                    {requests.map(req => (
                                        <div key={req._id} className="bg-primary/10 border border-primary/20 p-6 rounded-3xl flex items-center justify-between animate-pulse">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                                    <User className="text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{req.user?.name || "Client"}</h4>
                                                    <p className="text-sm text-white/50">Wants to chat about {req.topic}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => handleRequest(req._id, 'reject')}
                                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-500 transition-all text-sm font-medium"
                                                >
                                                    Decline
                                                </button>
                                                <button 
                                                    onClick={() => handleRequest(req._id, 'accept')}
                                                    className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Calendar className="text-primary" />
                                Upcoming Consultations
                            </h2>
                            <button className="text-sm text-primary hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <ConsultationRow key={i} />
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Quick Actions</h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <ActionBtn label="Edit Profile" />
                            <ActionBtn label="Manage Availability" />
                            <ActionBtn label="View Wallet" />
                            <ActionBtn label="Contact Support" />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const StatCard = ({ title, value, icon, trend }: any) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                {icon}
            </div>
            <TrendingUp size={20} className="text-white/20" />
        </div>
        <h3 className="text-white/40 text-sm mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white mb-2">{value}</p>
        <p className="text-xs text-white/30">{trend}</p>
    </motion.div>
);

const ConsultationRow = () => (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <User className="text-primary" />
            </div>
            <div>
                <h4 className="font-medium text-white group-hover:text-primary transition-colors">Rahul Sharma</h4>
                <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12} /> Today</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> 04:30 PM</span>
                </div>
            </div>
        </div>
        <ChevronRight className="text-white/20 group-hover:text-white transition-all" />
    </div>
);

const ActionBtn = ({ label }: any) => (
    <button className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all text-left text-sm font-medium flex justify-between items-center">
        {label}
        <ChevronRight size={16} className="text-white/20" />
    </button>
);

export default AstrologerDashboard;
