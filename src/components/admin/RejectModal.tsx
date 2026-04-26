import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface RejectModalProps {
    name: string;
    onConfirm: (reason: string) => void;
    onClose: () => void;
}

const RejectModal = ({ name, onConfirm, onClose }: RejectModalProps) => {
    const [reason, setReason] = useState('');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1A1A1A] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[100px]" />
                
                <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
                        <AlertCircle size={40} className="text-red-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">Reject Application</h2>
                    <p className="text-white/50 text-center mb-6">
                        Provide a reason for rejecting <span className="text-white font-bold">{name}</span>'s application.
                    </p>

                    <textarea 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., Missing documentation, insufficient experience..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:border-red-500/50 outline-none h-32 mb-8 transition-all resize-none"
                    />

                    <div className="flex w-full gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-4 bg-white/5 text-white/70 rounded-2xl font-bold hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => onConfirm(reason)}
                            disabled={!reason.trim()}
                            className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-500/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RejectModal;
