import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { X, MessageSquare, Send, User, Clock } from 'lucide-react';

interface ChatDetailModalProps {
    booking: any;
    onClose: () => void;
}

const ChatDetailModal: React.FC<ChatDetailModalProps> = ({ booking, onClose }) => {
    const { user } = useAuth() as any;
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (booking) {
            fetchMessages();
        }
    }, [booking]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/admin/chats/${booking._id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                setMessages(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    if (!booking) return null;

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
                className="relative w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[80vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl">
                            <MessageSquare className="text-primary" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Conversation Logs</h2>
                            <p className="text-xs text-white/40">Booking ID: {booking._id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Participant Info */}
                <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-primary" />
                        <span className="text-xs font-bold text-white/60">Client:</span>
                        <span className="text-xs text-white">{booking.clientId?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-xs font-bold text-white/60">Astrologer Profile:</span>
                        <span className="text-xs text-white">{booking.astrologerId?._id}</span>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-white/40 animate-pulse text-sm">Decrypting chat logs...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/20">
                            <MessageSquare size={64} className="mb-4 opacity-10" />
                            <p>No messages found in this session.</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div 
                                key={msg._id}
                                className={`flex flex-col ${msg.senderId?._id === booking.clientId?._id ? 'items-start' : 'items-end'}`}
                            >
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                                    msg.senderId?._id === booking.clientId?._id 
                                    ? 'bg-white/5 text-white rounded-tl-none border border-white/10' 
                                    : 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20'
                                }`}>
                                    <div className="text-[10px] font-bold opacity-50 mb-1 uppercase tracking-widest">
                                        {msg.senderId?.name}
                                    </div>
                                    {msg.content}
                                    <div className="text-[10px] opacity-40 mt-2 flex items-center justify-end gap-1">
                                        <Clock size={10} />
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-white/5 border-t border-white/10 text-center">
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                        End of encrypted conversation log
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ChatDetailModal;
const Star = ({ size, className }: any) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
