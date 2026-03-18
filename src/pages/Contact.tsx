import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Send, MessageCircle, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Get in </span>
              <span className="text-gradient-cosmic">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Have questions about our services or need guidance? 
              We're here to help you on your cosmic journey.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground text-sm mb-2">We'll respond within 24 hours</p>
                    <a href="mailto:hello@astrotalk.com" className="text-accent hover:underline">
                      hello@astrotalk.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground text-sm mb-2">Mon-Fri, 9am-6pm IST</p>
                    <a href="tel:+15551234567" className="text-accent hover:underline">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cosmic-teal/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-cosmic-teal" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-1">Visit Us</h3>
                    <p className="text-muted-foreground text-sm">
                      123 Celestial Avenue<br />
                      Cosmic City, Universe 12345
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/15551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              {isSubmitted ? (
                <div className="glass-card p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-4">Message Sent!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="btn-outline-cosmic"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card p-8">
                  <h2 className="font-display text-2xl font-semibold mb-6">Send a Message</h2>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Your Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm text-muted-foreground mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm text-muted-foreground mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your inquiry..."
                      rows={6}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-cosmic w-full flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
