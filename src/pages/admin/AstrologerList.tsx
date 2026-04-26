import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { 
    User, 
    Star, 
    Briefcase, 
    Mail, 
    Shield, 
    Search, 
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';

import AstroDetailModal from '@/components/admin/AstroDetailModal';

const AstrologerList = () => {
    const { user } = useAuth() as any;
    const { toast } = useToast();
    const [astrologers, setAstrologers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
    const [viewingAstro, setViewingAstro] = useState<any>(null);

    useEffect(() => {
        fetchAstrologers();
    }, []);

    const fetchAstrologers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/astrologers', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                setAstrologers(await res.json());
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to fetch astrologers", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filteredAstrologers = astrologers.filter(astro => 
        astro.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        astro.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        astro.specialization?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20"><CheckCircle2 size={12} /> Approved</span>;
            case 'pending':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20"><Clock size={12} /> Pending</span>;
            case 'rejected':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20"><XCircle size={12} /> Rejected</span>;
            default:
                return <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs font-bold border border-white/10">{status}</span>;
        }
    };

    return (
        <Layout>
            <div className="min-h-screen py-12 container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Astrologer Directory</h1>
                        <p className="text-white/50">Manage and view all registered astrologers on the platform.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by name, email or specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-white"
                            />
                        </div>
                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition-all">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                        ))}
                    </div>
                ) : filteredAstrologers.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <User className="mx-auto text-white/10 w-16 h-16 mb-4" />
                        <h3 className="text-xl font-bold text-white">No astrologers found</h3>
                        <p className="text-white/40">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="px-6 py-5 text-sm font-bold text-white/40 uppercase tracking-wider">Astrologer</th>
                                        <th className="px-6 py-5 text-sm font-bold text-white/40 uppercase tracking-wider">Specialization</th>
                                        <th className="px-6 py-5 text-sm font-bold text-white/40 uppercase tracking-wider">Experience</th>
                                        <th className="px-6 py-5 text-sm font-bold text-white/40 uppercase tracking-wider">Price/min</th>
                                        <th className="px-6 py-5 text-sm font-bold text-white/40 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-5 text-sm font-bold text-white/40 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredAstrologers.map((astro) => (
                                        <motion.tr 
                                            key={astro._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                                        <img 
                                                            src={astro.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=Astro"} 
                                                            alt="Astro" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-primary transition-colors">{astro.userId?.name}</div>
                                                        <div className="text-xs text-white/30 flex items-center gap-1"><Mail size={10} /> {astro.userId?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {astro.specialization?.slice(0, 2).map((s: string) => (
                                                        <span key={s} className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-white/60 border border-white/5">{s}</span>
                                                    ))}
                                                    {astro.specialization?.length > 2 && (
                                                        <span className="text-[10px] text-white/30">+{astro.specialization.length - 2} more</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-white/70 font-medium">
                                                    <Briefcase size={14} className="text-primary/50" />
                                                    {astro.experience} Yrs
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 font-bold text-primary">
                                                ₹{astro.pricePerMin}
                                            </td>
                                            <td className="px-6 py-5">
                                                {getStatusBadge(astro.status)}
                                            </td>
                                            <td className="px-6 py-5 text-right relative">
                                                <button 
                                                    onClick={() => setSelectedMenu(selectedMenu === astro._id ? null : astro._id)}
                                                    className="p-2 text-white/20 hover:text-white transition-colors"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                                
                                                {selectedMenu === astro._id && (
                                                    <div className="absolute right-6 top-14 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                                                        <button 
                                                            onClick={() => { setViewingAstro(astro); setSelectedMenu(null); }}
                                                            className="w-full px-4 py-3 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"
                                                        >
                                                            <User size={14} /> View Profile
                                                        </button>
                                                        <button className="w-full px-4 py-3 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2">
                                                            <Star size={14} /> Change Status
                                                        </button>
                                                        <div className="h-px bg-white/5 mx-2" />
                                                        <button className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2">
                                                            <XCircle size={14} /> Delete Account
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <AstroDetailModal 
                astro={viewingAstro} 
                onClose={() => setViewingAstro(null)} 
            />
        </Layout>
    );
};

export default AstrologerList;
