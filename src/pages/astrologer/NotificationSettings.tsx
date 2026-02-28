import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Bell,
    MessageSquare,
    Calendar,
    IndianRupee,
    Star,
    Save,
    Volume2,
    Mail
} from 'lucide-react';

interface NotifSetting {
    id: string;
    label: string;
    description: string;
    icon: any;
    color: string;
    enabled: boolean;
}

const NotificationSettings = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState<NotifSetting[]>([
        {
            id: 'new_booking',
            label: 'New Booking Alerts',
            description: 'Get notified when a seeker books a consultation with you',
            icon: Calendar,
            color: 'text-primary',
            enabled: true
        },
        {
            id: 'payment',
            label: 'Payment Confirmations',
            description: 'Receive alerts when payments are processed for your sessions',
            icon: IndianRupee,
            color: 'text-success',
            enabled: true
        },
        {
            id: 'chat_message',
            label: 'Chat Messages',
            description: 'Get notified when a client sends you a message during a session',
            icon: MessageSquare,
            color: 'text-accent',
            enabled: true
        },
        {
            id: 'review',
            label: 'New Reviews',
            description: 'Be alerted when a seeker leaves a review on your profile',
            icon: Star,
            color: 'text-warning',
            enabled: true
        },
        {
            id: 'sound',
            label: 'Sound Notifications',
            description: 'Play a sound when new notifications arrive',
            icon: Volume2,
            color: 'text-purple-400',
            enabled: false
        },
        {
            id: 'email',
            label: 'Email Digests',
            description: 'Receive a daily summary of your activity via email',
            icon: Mail,
            color: 'text-blue-400',
            enabled: false
        }
    ]);

    const toggleSetting = (id: string) => {
        setSettings(prev =>
            prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate saving — these are local preferences for now
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsSaving(false);
        toast.success('Notification preferences saved!');
        navigate('/astrologer/dashboard');
    };

    return (
        <Layout>
            <div className="pt-28 pb-20 min-h-screen">
                <div className="container mx-auto px-4 max-w-3xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl border border-white/5"
                                onClick={() => navigate('/astrologer/dashboard')}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold font-display">Notification Settings</h1>
                                <p className="text-sm text-muted-foreground">Control how the Sanctuary reaches you</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-cosmic px-6 rounded-xl"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save
                        </Button>
                    </motion.div>

                    {/* Settings List */}
                    <Card className="glass-card border-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-accent" /> Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {settings.map((setting, i) => {
                                const Icon = setting.icon;
                                return (
                                    <motion.div
                                        key={setting.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => toggleSetting(setting.id)}
                                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/20 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center ${setting.color} group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">{setting.label}</h4>
                                                <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                                            </div>
                                        </div>

                                        {/* Toggle Switch */}
                                        <div
                                            className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${setting.enabled
                                                    ? 'bg-gradient-to-r from-primary to-accent'
                                                    : 'bg-muted/40'
                                                }`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${setting.enabled ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Bottom Save */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-end pt-6">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-cosmic px-8 py-6 rounded-xl text-base"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <Save className="w-5 h-5 mr-2" />
                            )}
                            Save Preferences
                        </Button>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default NotificationSettings;
