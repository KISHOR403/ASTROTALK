import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail, Clock } from 'lucide-react';

const sections = [
    {
        icon: Database,
        title: '1. Information We Collect',
        content: [
            '**Personal Information:** When you create an account, we collect your name, email address, date of birth, and location to provide personalized astrological services.',
            '**Consultation Data:** Details you share during consultations (birth chart data, questions, chat messages) are stored to deliver accurate readings.',
            '**Payment Information:** Payment details are processed through secure third-party gateways. We do not store your card numbers on our servers.',
            '**Usage Data:** We collect anonymized analytics such as pages visited, features used, and session duration to improve our platform.'
        ]
    },
    {
        icon: Eye,
        title: '2. How We Use Your Information',
        content: [
            'Provide and personalize astrological consultations, horoscopes, and compatibility readings.',
            'Match you with relevant astrologers based on your preferences and needs.',
            'Process bookings, payments, and send transaction confirmations.',
            'Send important service updates, booking reminders, and consultation follow-ups.',
            'Improve our platform through anonymized usage analytics.',
            'Ensure the security of your account and prevent fraudulent activity.'
        ]
    },
    {
        icon: Shield,
        title: '3. Data Protection & Security',
        content: [
            'All data transmission is encrypted using industry-standard TLS/SSL protocols.',
            'Passwords are hashed using bcrypt and are never stored in plain text.',
            'Access to user data is restricted to authorized personnel only.',
            'We conduct regular security audits to identify and address vulnerabilities.',
            'Chat messages between you and astrologers are stored securely and are only accessible to the participants of the session.'
        ]
    },
    {
        icon: UserCheck,
        title: '4. Your Rights & Choices',
        content: [
            '**Access:** You can request a copy of all personal data we hold about you at any time.',
            '**Correction:** Update your profile information through your dashboard settings.',
            '**Deletion:** You may request complete deletion of your account and associated data by contacting our support team.',
            '**Opt-out:** You can unsubscribe from marketing communications at any time via your notification settings.',
            '**Data Portability:** Request your data in a structured, machine-readable format.'
        ]
    },
    {
        icon: Globe,
        title: '5. Sharing & Disclosure',
        content: [
            'We do **not** sell, rent, or trade your personal information to third parties.',
            'Astrologers can only see the information you share during a consultation session.',
            'We may share anonymized, aggregated data for research or statistical purposes.',
            'We may disclose information if required by law, regulation, or legal process.',
            'Third-party services (payment processors, analytics) receive only the minimum data necessary to perform their function.'
        ]
    },
    {
        icon: Lock,
        title: '6. Cookies & Tracking',
        content: [
            'We use essential cookies to maintain your session and remember your preferences.',
            'Analytics cookies help us understand how users interact with our platform.',
            'You can manage cookie preferences through your browser settings at any time.',
            'We do not use third-party advertising cookies or trackers.'
        ]
    },
    {
        icon: Clock,
        title: '7. Data Retention',
        content: [
            'Account data is retained for as long as your account is active.',
            'Consultation history is kept for 12 months after your last session for reference.',
            'Upon account deletion, personal data is permanently removed within 30 days.',
            'Anonymized analytics data may be retained indefinitely for platform improvement.'
        ]
    },
    {
        icon: Mail,
        title: '8. Contact Us',
        content: [
            'If you have questions about this Privacy Policy or wish to exercise your data rights, please reach out:',
            '**Email:** privacy@cosmicveda.in',
            '**Response Time:** We aim to respond to all privacy-related inquiries within 48 hours.',
            'For urgent data concerns, please include "URGENT" in your email subject line.'
        ]
    }
];

const PrivacyPolicy = () => {
    return (
        <Layout>
            <div className="pt-28 pb-20 min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-cosmic flex items-center justify-center shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold font-display mb-3">Privacy Policy</h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Your privacy is sacred to us. This policy outlines how CosmicVeda collects, uses, and protects your personal information.
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">Last updated: February 26, 2026</p>
                    </motion.div>

                    {/* Intro */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-primary/5 border border-primary/10 mb-8"
                    >
                        <p className="text-sm leading-relaxed text-foreground/80">
                            CosmicVeda ("we", "us", "our") is committed to safeguarding your personal data. By using our platform — including astrological consultations, horoscope readings, and compatibility services — you agree to the practices described in this Privacy Policy. We comply with applicable data protection regulations and industry best practices to ensure your information remains secure.
                        </p>
                    </motion.div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {sections.map((section, i) => {
                            const Icon = section.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.04 }}
                                    className="glass-card p-6 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <h2 className="text-lg font-bold font-display">{section.title}</h2>
                                    </div>
                                    <ul className="space-y-3 pl-2">
                                        {section.content.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3 text-sm text-foreground/75 leading-relaxed">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                                                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>') }} />
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Footer Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-10 text-center"
                    >
                        <p className="text-xs text-muted-foreground">
                            This Privacy Policy may be updated periodically. We will notify you of any material changes via email or a prominent notice on our platform.
                        </p>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPolicy;
