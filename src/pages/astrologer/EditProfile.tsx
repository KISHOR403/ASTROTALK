import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
    Save,
    ArrowLeft,
    User,
    Briefcase,
    Star,
    Languages,
    IndianRupee,
    FileText,
    X,
    Plus
} from 'lucide-react';
import Logo from '@/components/Logo';

const AVATAR_OPTIONS = ['✨', '🔮', '⭐', '🌙', '☀️', '🧙', '🪐', '💫', '🌟', '🔯', '🕉️', '☮️'];

const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [form, setForm] = useState({
        title: '',
        bio: '',
        specializations: [] as string[],
        experience: 0,
        pricePerMinute: 0,
        languages: [] as string[],
        avatar: '✨'
    });

    const [newSpecialization, setNewSpecialization] = useState('');
    const [newLanguage, setNewLanguage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/astrologers/me', {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setForm({
                        title: data.title || '',
                        bio: data.bio || '',
                        specializations: data.specializations || [],
                        experience: data.experience || 0,
                        pricePerMinute: data.pricePerMinute || 0,
                        languages: data.languages || [],
                        avatar: data.avatar || '✨'
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchProfile();
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/astrologers/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                toast.success('Profile updated successfully!');
                navigate('/astrologer/dashboard');
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('An error occurred while saving');
        } finally {
            setIsSaving(false);
        }
    };

    const addSpecialization = () => {
        if (newSpecialization.trim() && !form.specializations.includes(newSpecialization.trim())) {
            setForm({ ...form, specializations: [...form.specializations, newSpecialization.trim()] });
            setNewSpecialization('');
        }
    };

    const removeSpecialization = (spec: string) => {
        setForm({ ...form, specializations: form.specializations.filter(s => s !== spec) });
    };

    const addLanguage = () => {
        if (newLanguage.trim() && !form.languages.includes(newLanguage.trim())) {
            setForm({ ...form, languages: [...form.languages, newLanguage.trim()] });
            setNewLanguage('');
        }
    };

    const removeLanguage = (lang: string) => {
        setForm({ ...form, languages: form.languages.filter(l => l !== lang) });
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Layout>
        );
    }

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
                                <h1 className="text-2xl font-bold font-display">Edit Profile</h1>
                                <p className="text-sm text-muted-foreground">Customize how seekers see you in the Sanctuary</p>
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
                            Save Changes
                        </Button>
                    </motion.div>

                    <div className="space-y-6">
                        {/* Avatar Selection */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                            <Card className="glass-card border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Logo className="w-6 h-6 animate-pulse-glow" /> Avatar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-3">
                                        {AVATAR_OPTIONS.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => setForm({ ...form, avatar: emoji })}
                                                className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all duration-200 border-2 ${form.avatar === emoji
                                                        ? 'border-primary bg-primary/20 scale-110 shadow-lg shadow-primary/20'
                                                        : 'border-white/5 bg-muted/20 hover:border-white/20 hover:scale-105'
                                                    }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Title & Experience */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="glass-card border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" /> Identity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Professional Title</label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            placeholder="e.g. Vedic Astrology Expert"
                                            className="w-full bg-muted/20 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                                                <Briefcase className="w-3 h-3 inline mr-1" /> Experience (Years)
                                            </label>
                                            <input
                                                type="number"
                                                value={form.experience}
                                                onChange={e => setForm({ ...form, experience: parseInt(e.target.value) || 0 })}
                                                min={0}
                                                className="w-full bg-muted/20 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                                                <IndianRupee className="w-3 h-3 inline mr-1" /> Price / Min (₹)
                                            </label>
                                            <input
                                                type="number"
                                                value={form.pricePerMinute}
                                                onChange={e => setForm({ ...form, pricePerMinute: parseInt(e.target.value) || 0 })}
                                                min={0}
                                                className="w-full bg-muted/20 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Bio */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <Card className="glass-card border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-accent" /> Bio
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <textarea
                                        value={form.bio}
                                        onChange={e => setForm({ ...form, bio: e.target.value })}
                                        placeholder="Share your journey, expertise, and what seekers can expect from your consultations..."
                                        rows={5}
                                        className="w-full bg-muted/20 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    />
                                    <p className="text-[11px] text-muted-foreground mt-2">{form.bio.length} / 500 characters</p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Specializations */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="glass-card border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Star className="w-5 h-5 text-warning" /> Specializations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {form.specializations.map(spec => (
                                            <Badge key={spec} variant="outline" className="px-3 py-1.5 rounded-xl border-primary/20 text-primary bg-primary/5 group hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all cursor-pointer" onClick={() => removeSpecialization(spec)}>
                                                {spec}
                                                <X className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Badge>
                                        ))}
                                        {form.specializations.length === 0 && (
                                            <p className="text-sm text-muted-foreground italic">No specializations added yet</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newSpecialization}
                                            onChange={e => setNewSpecialization(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                                            placeholder="e.g. Vedic, Numerology, Tarot..."
                                            className="flex-1 bg-muted/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                        <Button onClick={addSpecialization} size="sm" variant="outline" className="rounded-xl border-white/10 px-4">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Languages */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <Card className="glass-card border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Languages className="w-5 h-5 text-success" /> Languages
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {form.languages.map(lang => (
                                            <Badge key={lang} variant="outline" className="px-3 py-1.5 rounded-xl border-success/20 text-success bg-success/5 group hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all cursor-pointer" onClick={() => removeLanguage(lang)}>
                                                {lang}
                                                <X className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Badge>
                                        ))}
                                        {form.languages.length === 0 && (
                                            <p className="text-sm text-muted-foreground italic">No languages added yet</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newLanguage}
                                            onChange={e => setNewLanguage(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                                            placeholder="e.g. Hindi, English, Sanskrit..."
                                            className="flex-1 bg-muted/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                        <Button onClick={addLanguage} size="sm" variant="outline" className="rounded-xl border-white/10 px-4">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Bottom Save */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-end pt-4">
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
                                Save Profile
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EditProfile;
