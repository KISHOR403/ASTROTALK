import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    Search, 
    Calendar, 
    User, 
    ChevronRight,
    Filter,
    Clock,
    DollarSign,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import ChatDetailModal from '@/components/admin/ChatDetailModal';

const ChatLogs = () => {
    const { user } = useAuth() as any;
    const { toast } = useToast();
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChat, setSelectedChat] = useState<any>(null);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/chats', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                setChats(await res.json());
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to fetch chat logs", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filteredChats = chats.filter(chat => 
        chat.clientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        }
    };

    return (
        <Layout>
            <div className="min-h-screen py-12 container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Platform Chat Logs</h1>
                        <p className="text-white/50">Audit and review all consultation conversations for quality and security.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by Client name or ID..."
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 bg-white/5 animate-pulse rounded-3xl border border-white/5" />
                        ))}
                    </div>
                ) : filteredChats.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <MessageSquare className="mx-auto text-white/10 w-16 h-16 mb-4" />
                        <h3 className="text-xl font-bold text-white">No chat logs found</h3>
                        <p className="text-white/40">No consultations have been recorded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChats.map((chat) => (
                            <motion.div 
                                key={chat._id}
                                whileHover={{ y: -5 }}
                                className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between hover:bg-white/10 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                                    <MessageSquare size={80} />
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                                            <User className="text-primary" size={20} />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(chat.status)}`}>
                                            {chat.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-1 mb-6">
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{chat.clientId?.name}</h3>
                                        <p className="text-xs text-white/30 flex items-center gap-1"><Clock size={12} /> {new Date(chat.createdAt).toLocaleDateString()} at {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-1">Revenue</p>
                                            <p className="text-sm font-bold text-white flex items-center gap-1"><DollarSign size={14} className="text-green-500" /> ₹{chat.totalPrice || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-1">Duration</p>
                                            <p className="text-sm font-bold text-white flex items-center gap-1"><Clock size={14} className="text-primary" /> {chat.duration || 0} mins</p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setSelectedChat(chat)}
                                    className="mt-8 w-full py-4 bg-white/5 rounded-xl text-sm font-bold text-white group-hover:bg-primary transition-all flex items-center justify-center gap-2"
                                >
                                    View Chat History
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedChat && (
                    <ChatDetailModal 
                        booking={selectedChat} 
                        onClose={() => setSelectedChat(null)} 
                    />
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default ChatLogs;
