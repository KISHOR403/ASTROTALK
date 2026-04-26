import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ApproveModalProps {
    name: string;
    onConfirm: () => void;
    onClose: () => void;
}

const ApproveModal = ({ name, onConfirm, onClose }: ApproveModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1A1A1A] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[100px]" />
                
                <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/30">
                        <CheckCircle size={40} className="text-primary" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">Approve Astrologer</h2>
                    <p className="text-white/50 mb-8">
                        Are you sure you want to approve <span className="text-white font-bold">{name}</span>? 
                        They will receive an email confirmation and can start consulting immediately.
                    </p>

                    <div className="flex w-full gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-4 bg-white/5 text-white/70 rounded-2xl font-bold hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                        >
                            Yes, Approve
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ApproveModal;
