import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
    X, 
    Mail, 
    Star, 
    Briefcase, 
    Languages, 
    DollarSign, 
    Calendar,
    Shield,
    CheckCircle2,
    Clock,
    User,
    History,
    ExternalLink
} from 'lucide-react';

interface AstroDetailModalProps {
    astro: any;
    onClose: () => void;
}

const AstroDetailModal: React.FC<AstroDetailModalProps> = ({ astro, onClose }) => {
    const { user } = useAuth() as any;
    const [activeTab, setActiveTab] = useState<'profile' | 'logs'>('profile');
    const [logs, setLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    useEffect(() => {
        if (activeTab === 'logs' && astro) {
            fetchLogs();
        }
    }, [activeTab, astro]);

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const res = await fetch(`http://localhost:5000/api/admin/astrologers/${astro._id}/logs`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                setLogs(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch logs");
        } finally {
            setLoadingLogs(false);
        }
    };

    if (!astro) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 flex-shrink-0" />
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-black/50 text-white/50 hover:text-white border border-white/10 transition-all z-10"
                >
                    <X size={20} />
                </button>

                <div className="px-8 -mt-16 flex-1 overflow-y-auto pb-8 custom-scrollbar">
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-[#0F0F0F] bg-primary/20 shadow-xl flex-shrink-0">
                            <img 
                                src={astro.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=Astro"} 
                                alt="Astro" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 pt-16 md:pt-20">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                {astro.userId?.name}
                                {astro.status === 'approved' && <CheckCircle2 className="text-green-500 w-6 h-6" />}
                            </h2>
                            <p className="text-white/50 flex items-center gap-2 mt-1">
                                <Mail size={14} /> {astro.userId?.email}
                            </p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' ? (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <InfoBox icon={<Briefcase size={16} />} label="Experience" value={`${astro.experience} Years`} />
                                    <InfoBox icon={<Star size={16} />} label="Specialty" value={astro.specialization?.[0] || 'Vedic'} />
                                    <InfoBox icon={<DollarSign size={16} />} label="Rate" value={`₹${astro.pricePerMin}/min`} />
                                    <InfoBox icon={<Shield size={16} />} label="Status" value={astro.status.toUpperCase()} />
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-3">Professional Bio</h4>
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-white/70 leading-relaxed italic">
                                            "{astro.bio || 'No bio provided.'}"
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-12">
                                        <div>
                                            <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-3">Specializations</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {astro.specialization?.map((s: string) => (
                                                    <span key={s} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-3">Languages</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {astro.languages?.map((l: string) => (
                                                    <span key={l} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-medium border border-white/10">
                                                        {l}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logs"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <History size={20} className="text-primary" />
                                    Recent Consultations
                                </h3>
                                
                                {loadingLogs ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />
                                        ))}
                                    </div>
                                ) : logs.length === 0 ? (
                                    <div className="py-20 text-center bg-white/5 rounded-3xl border border-white/5">
                                        <Calendar size={48} className="mx-auto text-white/10 mb-4" />
                                        <p className="text-white/40">No consultation history found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {logs.map((log) => (
                                            <div key={log._id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                        {log.clientId?.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{log.clientId?.name}</div>
                                                        <div className="text-xs text-white/30">{new Date(log.createdAt).toLocaleDateString()} at {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-primary">₹{log.totalPrice || 0}</div>
                                                    <div className={`text-[10px] uppercase font-bold tracking-wider ${log.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                        {log.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 flex-shrink-0">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/50 border border-white/10 hover:text-white'}`}
                    >
                        <User size={18} />
                        View Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('logs')}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'logs' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/50 border border-white/10 hover:text-white'}`}
                    >
                        <History size={18} />
                        View Logs
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const InfoBox = ({ icon, label, value }: any) => (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
        <div className="text-primary mb-1">{icon}</div>
        <div className="text-[10px] text-white/30 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-bold text-white">{value}</div>
    </div>
);

export default AstroDetailModal;
