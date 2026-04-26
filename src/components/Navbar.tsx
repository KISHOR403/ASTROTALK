import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Star, LogOut, User as UserIcon, Bell, Calendar } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import socket from '@/lib/socket';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Horoscope', path: '/horoscope' },
  { name: 'Birth Chart', path: '/birth-chart' },
  { name: 'Book Consultation', path: '/booking' },
  { name: 'Blog', path: '/blog' },
  { name: 'Chat', path: '/chat' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowNotifications(false);
  }, [location]);

  // Socket for Notifications
  useEffect(() => {
    if (user) {
      // Join user-specific room for notifications
      socket.emit('join_room', user._id);

      socket.on('new_notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        // Play sound or show toast could be added here
      });

      return () => {
        socket.off('new_notification');
      };
    }
  }, [user]);

  const unreadCount = notifications.length;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <Logo className="w-9 h-9 animate-pulse-glow" />
              <span className="font-display text-xl md:text-2xl font-semibold text-gradient-gold">
                Astrotalk
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-body text-sm tracking-wide transition-colors duration-300 ${location.pathname === link.path
                    ? 'text-accent'
                    : 'text-foreground/70 hover:text-foreground'
                    }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-gold rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Auth/Notification Icons */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 rounded-xl glass-card border border-white/5 hover:border-primary/20 transition-all"
                    >
                      <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-primary animate-wiggle' : 'text-foreground/70'}`} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-4 w-80 glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-muted/30">
                            <h3 className="font-bold text-sm">Notifications</h3>
                            <button
                              onClick={() => setNotifications([])}
                              className="text-[10px] uppercase tracking-wider font-bold text-accent hover:opacity-80"
                            >
                              Clear All
                            </button>
                          </div>
                          <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                              notifications.map((n, i) => (
                                <div key={i} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer">
                                  <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                      <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium leading-relaxed">{n.message}</p>
                                      <span className="text-[10px] text-muted-foreground mt-1 block">
                                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-10 text-center">
                                <Bell className="w-10 h-10 text-muted-foreground opacity-20 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground italic">No new notifications</p>
                              </div>
                            )}
                          </div>
                          {notifications.length > 0 && (
                            <Link to="/astrologer/bookings" className="block p-3 text-center bg-muted/30 text-xs font-bold hover:bg-muted transition-colors border-t border-white/5">
                              View All Bookings
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'astrologer' ? '/astrologer/dashboard' : '/dashboard'} className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors px-3 py-1.5 rounded-xl hover:bg-white/5">
                    <UserIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl glass-card border border-white/5 hover:border-destructive/20 text-destructive/70 hover:text-destructive transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/signup" className="btn-cosmic text-sm py-2 px-6">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
            <div className="relative pt-24 px-6 h-full overflow-y-auto">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`block py-3 font-display text-xl ${location.pathname === link.path
                        ? 'text-accent'
                        : 'text-foreground/70'
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="section-divider my-4" />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-3 pb-20"
                >
                  {user ? (
                    <>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-white/5 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-cosmic flex items-center justify-center text-lg shadow-glow">
                          👤
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{user.role}</p>
                        </div>
                      </div>
                      <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'astrologer' ? '/astrologer/dashboard' : '/dashboard'} className="btn-cosmic text-center py-3">
                        Dashboard
                      </Link>
                      <button onClick={logout} className="btn-outline-cosmic text-center py-3 flex items-center justify-center gap-2">
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/signup" className="btn-cosmic text-center py-3">
                        Get Started
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
