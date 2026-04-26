import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
    Users, 
    Star, 
    MessageSquare, 
    DollarSign, 
    ArrowUpRight,
    Bell,
    Clock,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth() as any;
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading Admin Panel...</div>;


    return (
        <Layout>
            <div className="min-h-screen py-12 container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Command Center</h1>
                        <p className="text-white/50">Overview of the platform's performance and activity.</p>
                    </div>
                    <button className="relative p-3 bg-white/5 rounded-2xl border border-white/10 text-white/50 hover:text-white transition-all">
                        <Bell size={24} />
                        {stats.pendingApprovals > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {stats.pendingApprovals}
                            </span>
                        )}
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <AdminStatCard title="Total Users" value={stats.users.toLocaleString()} icon={<Users className="text-primary" />} trend="+4.5%" />
                    <AdminStatCard title="Active Astrologers" value={stats.astrologers.toLocaleString()} icon={<Star className="text-yellow-500" />} trend="+1.2%" />
                    <AdminStatCard title="Total Chats" value={stats.chats.toLocaleString()} icon={<MessageSquare className="text-accent" />} trend="+12.8%" />
                    <AdminStatCard title="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<DollarSign className="text-green-500" />} trend="+8.3%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Alerts & Tasks */}
                    <div className="lg:col-span-2 space-y-6">
                        <div 
                            onClick={() => navigate('/admin/astrologers/pending')}
                            className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex items-center justify-between cursor-pointer hover:bg-red-500/20 transition-all group"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
                                    <Bell className="text-red-500 animate-bounce" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Pending Approvals</h3>
                                    <p className="text-red-500/70">{stats.pendingApprovals} astrologers are waiting for your review.</p>
                                </div>
                            </div>
                            <ChevronRight className="text-red-500/50 group-hover:translate-x-2 transition-transform" />
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                <ActivityItem title="New astrologer applied" user="Rahul Sharma" time="2 hours ago" />
                                <ActivityItem title="New astrologer applied" user="Priya Nair" time="5 hours ago" />
                                <ActivityItem title="User complaint filed" user="Client #4023" time="1 day ago" color="text-red-500" />
                                <ActivityItem title="System update completed" user="V2.4.1" time="2 days ago" color="text-green-500" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Manage Platform</h2>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                            <AdminLink label="Astrologers List" count={stats.astrologers} />
                            <AdminLink label="User Database" count={stats.users} />
                            <AdminLink label="Chat Logs" />
                            <AdminLink label="Financial Reports" />
                            <AdminLink label="Platform Settings" />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const AdminStatCard = ({ title, value, icon, trend }: any) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                {icon}
            </div>
            <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} />
                {trend}
            </div>
        </div>
        <h3 className="text-white/40 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
);

const ActivityItem = ({ title, user, time, color }: any) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Clock size={16} className="text-white/30" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-white">{title}: <span className={color || 'text-primary'}>{user}</span></h4>
                <p className="text-xs text-white/30">{time}</p>
            </div>
        </div>
        <ChevronRight size={16} className="text-white/10 group-hover:text-white transition-all" />
    </div>
);

const AdminLink = ({ label, count }: any) => (
    <button className="w-full py-4 px-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all text-left flex justify-between items-center group">
        <span className="text-sm font-medium text-white/70 group-hover:text-white">{label}</span>
        {count ? (
            <span className="text-[10px] bg-white/10 px-2 py-1 rounded-lg text-white/50">{count}</span>
        ) : (
            <ChevronRight size={14} className="text-white/20" />
        )}
    </button>
);

export default AdminDashboard;
