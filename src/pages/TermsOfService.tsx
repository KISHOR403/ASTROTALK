import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { ScrollText, Users, CreditCard, MessageSquare, Ban, Scale, AlertTriangle, RefreshCw, FileText } from 'lucide-react';

const sections = [
    {
        icon: Users,
        title: '1. Account & Eligibility',
        content: [
            'You must be at least 18 years old to create an account on CosmicVeda.',
            'You are responsible for maintaining the confidentiality of your account credentials.',
            'Each person may only maintain one account. Duplicate accounts may be suspended.',
            'You agree to provide accurate and complete information during registration.',
            'We reserve the right to suspend or terminate accounts that violate these terms.'
        ]
    },
    {
        icon: MessageSquare,
        title: '2. Consultation Services',
        content: [
            'CosmicVeda connects seekers with independent astrologers for personalized consultations.',
            'Astrological readings are provided for **entertainment and guidance purposes only** and should not replace professional medical, legal, or financial advice.',
            'Astrologers are independent practitioners and their views do not represent CosmicVeda.',
            'Session content shared between you and an astrologer is confidential to both parties.',
            'You agree to communicate respectfully during all consultations.'
        ]
    },
    {
        icon: CreditCard,
        title: '3. Payments & Refunds',
        content: [
            'All consultation fees are displayed before booking and must be paid in advance.',
            'Payments are processed through secure third-party gateways. CosmicVeda does not store card details.',
            '**Cancellation Policy:** Bookings cancelled 2+ hours before the session are eligible for a full refund.',
            'No-shows or cancellations within 2 hours of the session may forfeit the consultation fee.',
            'If an astrologer fails to attend a scheduled session, you will receive a full refund within 5–7 business days.',
            'All prices are listed in Indian Rupees (₹) unless otherwise stated.'
        ]
    },
    {
        icon: ScrollText,
        title: '4. Intellectual Property',
        content: [
            'All content on CosmicVeda — including designs, logos, text, and software — is owned by CosmicVeda or its licensors.',
            'You may not reproduce, distribute, or create derivative works from our content without written permission.',
            'Horoscope readings and consultation summaries generated for you are for your personal use only.',
            'User-generated content (reviews, messages) remains your property, but you grant CosmicVeda a license to display it on the platform.'
        ]
    },
    {
        icon: Ban,
        title: '5. Prohibited Conduct',
        content: [
            'Using the platform for any unlawful or fraudulent purpose.',
            'Harassing, abusing, or threatening astrologers or other users.',
            'Attempting to reverse-engineer, hack, or disrupt platform services.',
            'Sharing misleading information or impersonating another person.',
            'Using automated bots or scrapers to access platform content.',
            'Soliciting astrologers for services outside the CosmicVeda platform.'
        ]
    },
    {
        icon: AlertTriangle,
        title: '6. Disclaimers & Limitation of Liability',
        content: [
            'CosmicVeda is provided on an **"as-is"** and **"as-available"** basis without warranties of any kind.',
            'We do not guarantee the accuracy, completeness, or reliability of any astrological reading.',
            'CosmicVeda shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
            'Our total liability to you for any claim shall not exceed the amount you paid in the preceding 12 months.',
            'We are not responsible for third-party services, links, or integrations available through the platform.'
        ]
    },
    {
        icon: RefreshCw,
        title: '7. Modifications to Terms',
        content: [
            'We may update these Terms of Service at any time. Material changes will be communicated via email or platform notification.',
            'Continued use of CosmicVeda after changes constitutes acceptance of the updated terms.',
            'We encourage you to review these terms periodically.',
            'Previous versions of these terms are available upon request.'
        ]
    },
    {
        icon: Scale,
        title: '8. Governing Law & Disputes',
        content: [
            'These Terms are governed by the laws of India.',
            'Any disputes shall be resolved through binding arbitration in accordance with Indian arbitration laws.',
            'The arbitration shall be conducted in New Delhi, India.',
            'If arbitration is not applicable, the courts of New Delhi shall have exclusive jurisdiction.',
            'For questions about these Terms, contact us at **legal@cosmicveda.in**.'
        ]
    }
];

const TermsOfService = () => {
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
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold font-display mb-3">Terms of Service</h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Please read these terms carefully before using CosmicVeda. By accessing our platform, you agree to be bound by these terms.
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">Last updated: February 26, 2026</p>
                    </motion.div>

                    {/* Intro */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-accent/5 border border-accent/10 mb-8"
                    >
                        <p className="text-sm leading-relaxed text-foreground/80">
                            Welcome to CosmicVeda. These Terms of Service ("Terms") govern your use of our website, mobile applications, and all related services (collectively, the "Platform"). By creating an account or using any part of the Platform, you agree to comply with and be bound by these Terms. If you do not agree, please do not use our services.
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
                                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5 text-accent" />
                                        </div>
                                        <h2 className="text-lg font-bold font-display">{section.title}</h2>
                                    </div>
                                    <ul className="space-y-3 pl-2">
                                        {section.content.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3 text-sm text-foreground/75 leading-relaxed">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
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
                            By using CosmicVeda, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        </p>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default TermsOfService;
