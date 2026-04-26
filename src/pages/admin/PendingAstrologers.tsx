import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, 
    XCircle, 
    User, 
    Calendar, 
    MapPin, 
    Star, 
    Languages, 
    Briefcase,
    AlertCircle,
    Loader2
} from 'lucide-react';
import socket from '@/lib/socket';
import ApproveModal from '@/components/admin/ApproveModal';
import RejectModal from '@/components/admin/RejectModal';

const PendingAstrologers = () => {
    const { user } = useAuth() as any;
    const { toast } = useToast();
    const [pendingList, setPendingList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAstro, setSelectedAstro] = useState<any>(null);
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);

    useEffect(() => {
        fetchPending();

        // Listen for new applications
        socket.on('new_astrologer_application', (data) => {
            toast({ 
                title: "New Application!", 
                description: `${data.name} just submitted their profile.` 
            });
            fetchPending();
        });

        return () => {
            socket.off('new_astrologer_application');
        };
    }, []);

    const fetchPending = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/astrologers/pending', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                setPendingList(await res.json());
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to fetch pending applications", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/astrologers/${selectedAstro._id}/approve`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                toast({ title: "Approved!", description: `${selectedAstro.userId?.name} is now an active astrologer.` });
                setPendingList(prev => prev.filter(a => a._id !== selectedAstro._id));
                setShowApprove(false);
            }
        } catch (error) {
            toast({ title: "Error", description: "Approval failed", variant: "destructive" });
        }
    };

    const handleReject = async (reason: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/astrologers/${selectedAstro._id}/reject`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify({ reason })
            });
            if (res.ok) {
                toast({ title: "Rejected", description: "Application has been rejected." });
                setPendingList(prev => prev.filter(a => a._id !== selectedAstro._id));
                setShowReject(false);
            }
        } catch (error) {
            toast({ title: "Error", description: "Rejection failed", variant: "destructive" });
        }
    };

    return (
        <Layout>
            <div className="min-h-screen py-12 container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Pending Applications</h1>
                        <p className="text-white/50">Review and approve new astrologers joining the platform.</p>
                    </div>
                    <div className="bg-primary/20 text-primary px-4 py-2 rounded-full font-bold border border-primary/30">
                        {pendingList.length} Pending
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-primary w-12 h-12" />
                    </div>
                ) : pendingList.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <CheckCircle className="mx-auto text-white/20 w-16 h-16 mb-4" />
                        <h3 className="text-xl font-bold text-white">All caught up!</h3>
                        <p className="text-white/40">No pending applications at the moment.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <AnimatePresence>
                            {pendingList.map((astro) => (
                                <motion.div 
                                    key={astro._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col lg:flex-row gap-8 hover:bg-white/10 transition-all group"
                                >
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-primary/20 border-2 border-white/10 flex-shrink-0">
                                        <img 
                                            src={astro.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=Astro"} 
                                            alt="Astro" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{astro.userId?.name}</h2>
                                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/50">
                                                    <span className="flex items-center gap-1"><Briefcase size={14} /> {astro.specialization?.join(', ')}</span>
                                                    <span className="flex items-center gap-1"><Star size={14} /> {astro.experience} Years Exp.</span>
                                                    <span className="flex items-center gap-1"><Languages size={14} /> {astro.languages?.join(', ')}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary">₹{astro.pricePerMin}<span className="text-xs text-white/40">/min</span></div>
                                                <div className="text-xs text-white/30">Applied: {new Date(astro.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>

                                        <p className="text-white/60 text-sm line-clamp-2 italic">"{astro.bio}"</p>
                                        
                                        <div className="flex gap-4 pt-4 border-t border-white/5">
                                            <button 
                                                onClick={() => { setSelectedAstro(astro); setShowApprove(true); }}
                                                className="flex-1 lg:flex-none px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={18} />
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => { setSelectedAstro(astro); setShowReject(true); }}
                                                className="flex-1 lg:flex-none px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={18} />
                                                Reject
                                            </button>
                                            <button className="hidden lg:block px-6 py-3 bg-white/5 text-white/50 rounded-xl font-medium hover:text-white transition-all">
                                                View Documentation
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {showApprove && (
                <ApproveModal 
                    name={selectedAstro?.userId?.name} 
                    onConfirm={handleApprove} 
                    onClose={() => setShowApprove(false)} 
                />
            )}
            {showReject && (
                <RejectModal 
                    name={selectedAstro?.userId?.name} 
                    onConfirm={handleReject} 
                    onClose={() => setShowReject(false)} 
                />
            )}
        </Layout>
    );
};

export default PendingAstrologers;
