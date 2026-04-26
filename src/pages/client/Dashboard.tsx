import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  User as UserIcon, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Download, 
  Settings, 
  LogOut, 
  Star, 
  MessageCircle, 
  AlertCircle, 
  ChevronDown, 
  CalendarDays,
  Sparkles,
  TrendingUp,
  History,
  Info
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as UiCalendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';

const mockReports = [
  { id: 1, name: 'Birth Chart Analysis', date: 'Feb 1, 2026', type: 'Kundli', size: '1.2 MB' },
  { id: 2, name: 'Annual Prediction 2026', date: 'Jan 15, 2026', type: 'Varshaphal', size: '0.8 MB' },
  { id: 3, name: 'Career Guidance Report', date: 'Jan 10, 2026', type: 'Career', size: '1.5 MB' },
];

const makeTimeSlots = (stepMinutes: number) => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
};

const timeSlots = makeTimeSlots(15);

const DashboardPage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    birthDetails: {
      date: (user as any)?.birthDetails?.date ? new Date((user as any).birthDetails.date).toISOString().split('T')[0] : '',
      time: (user as any)?.birthDetails?.time || '',
      place: (user as any)?.birthDetails?.place || ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const selectedBirthDate = formData.birthDetails.date
    ? parse(formData.birthDetails.date, 'yyyy-MM-dd', new Date())
    : undefined;

  useEffect(() => {
    if (activeTab === 'settings' && user) {
        fetch('http://localhost:5000/api/users/profile', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        }).then(res => res.json()).then(data => {
            setFormData({
                name: data.name || '',
                email: data.email || '',
                birthDetails: {
                    date: data.birthDetails?.date ? new Date(data.birthDetails.date).toISOString().split('T')[0] : '',
                    time: data.birthDetails?.time || '',
                    place: data.birthDetails?.place || ''
                }
            });
        });
    }
  }, [activeTab, user]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data);
        alert('Settings saved successfully!');
      } else {
        alert(data.message || 'Failed to save settings');
      }
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings/user', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  const upcomingConsultations = bookings.filter(b => b.status === 'scheduled');
  const completedConsultations = bookings.filter(b => b.status === 'completed');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'reports', label: 'My Reports', icon: FileText },
    { id: 'consultations', label: 'Consultations', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <section className="py-24 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10" />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 space-y-6"
            >
              <div className="glass-card p-8 text-center relative overflow-hidden group border-glow">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-full bg-gradient-cosmic p-1 mx-auto mb-6 shadow-glow">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-5xl overflow-hidden">
                      {user?.name?.[0] || '👤'}
                    </div>
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight mb-1">{user?.name}</h2>
                  <p className="text-muted-foreground text-sm font-medium mb-6">{user?.email}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <nav className="glass-card p-3 space-y-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden",
                        isActive 
                          ? "text-primary-foreground shadow-glow" 
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-cosmic -z-10"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <tab.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-primary")} />
                      <span className="font-semibold">{tab.label}</span>
                    </button>
                  );
                })}
                
                <div className="h-px bg-white/5 my-4 mx-4" />
                
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-300 group"
                >
                  <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  <span className="font-semibold">Sign Out</span>
                </button>
              </nav>
            </motion.aside>

            {/* Main Content Area */}
            <div className="lg:col-span-9 min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-8"
                >
                  
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      {/* Welcome Banner */}
                      <div className="relative rounded-3xl overflow-hidden glass-card p-10 border-glow group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-card/80 to-accent/20" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                          <div className="max-w-xl">
                            <div className="flex items-center gap-3 mb-4">
                              <Logo className="w-12 h-12 animate-float-antigravity" />
                              <span className="text-accent uppercase font-bold tracking-[0.2em] text-xs">Cosmic Connection</span>
                            </div>
                            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                              Welcome back, <span className="text-gradient-gold">{user?.name?.split(' ')[0]}</span>
                            </h1>
                            <p className="text-lg text-foreground/80 leading-relaxed">
                              "The stars incline, they do not determine. Your journey through the celestial spheres continues with favorable alignments today."
                            </p>
                          </div>
                          
                          <div className="hidden md:flex flex-col items-end gap-2">
                            <div className="p-4 glass-card bg-white/5 backdrop-blur-md rounded-2xl border-white/10 text-center min-w-[140px]">
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Today's Moon</p>
                              <p className="text-2xl font-display font-bold text-gradient-cosmic">Taurus</p>
                            </div>
                            <div className="p-4 glass-card bg-white/5 backdrop-blur-md rounded-2xl border-white/10 text-center min-w-[140px]">
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Sun Sign</p>
                              <p className="text-2xl font-display font-bold text-gradient-gold">Pisces</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Insights Grid */}
                      <div className="grid md:grid-cols-3 gap-6">
                        {[
                          { label: 'Reports Ready', value: mockReports.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10', gradient: 'text-gradient-cosmic' },
                          { label: 'Total Consultations', value: bookings.length, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/10', gradient: 'text-gradient-aurora' },
                          { label: 'Upcoming Sessions', value: upcomingConsultations.length, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-400/10', gradient: 'text-gradient-gold' }
                        ].map((stat, idx) => (
                          <motion.div 
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="glass-card p-6 flex flex-col items-center text-center group border-glow"
                          >
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110", stat.bg)}>
                              <stat.icon className={cn("w-7 h-7", stat.color)} />
                            </div>
                            <div className={cn("text-4xl font-display font-bold mb-1", stat.gradient)}>{stat.value}</div>
                            <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Birth Details Status */}
                      <div className="glass-card p-8 relative overflow-hidden border-glow">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <AlertCircle className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                          <h3 className="font-display text-2xl font-bold mb-4">Celestial Profile</h3>
                          {!(user as any)?.birthDetails?.date ? (
                            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-muted/20 rounded-2xl border border-dashed border-white/10">
                              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                <Info className="w-8 h-8 text-accent animate-pulse" />
                              </div>
                              <div className="text-center md:text-left flex-1">
                                <p className="text-foreground font-medium mb-1">Your birth details are incomplete</p>
                                <p className="text-sm text-muted-foreground">To provide accurate daily horoscopes and deep chart analysis, we need your birth time and location.</p>
                              </div>
                              <Button 
                                onClick={() => setActiveTab('settings')} 
                                className="btn-cosmic px-8"
                              >
                                Complete Profile
                              </Button>
                            </div>
                          ) : (
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Birth Date</p>
                                    <p className="text-xl font-semibold">{format(new Date((user as any).birthDetails.date), 'MMMM dd, yyyy')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Birth Time</p>
                                    <p className="text-xl font-semibold">{(user as any).birthDetails.time}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Birth Place</p>
                                    <p className="text-xl font-semibold">{(user as any).birthDetails.place}</p>
                                </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reports' && (
                    <div className="glass-card p-8 border-glow">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="font-display text-3xl font-bold mb-2">My Reports</h2>
                          <p className="text-muted-foreground">Your cosmic insights, ready for download.</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      
                      <div className="grid gap-4">
                        {mockReports.map((report, idx) => (
                          <motion.div 
                            key={report.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all group"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-cosmic p-0.5 group-hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-primary" />
                                </div>
                              </div>
                              <div>
                                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{report.name}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {report.date}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Info className="w-3 h-3" /> {report.type}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> {report.size}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" className="mt-4 sm:mt-0 glass-card border-white/10 hover:bg-primary hover:text-white transition-all gap-2 group-hover:shadow-glow">
                              <Download className="w-4 h-4" />
                              Download PDF
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'consultations' && (
                    <div className="glass-card p-8 border-glow">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="font-display text-3xl font-bold mb-2">Consultations</h2>
                          <p className="text-muted-foreground">Manage your sessions with our master astrologers.</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-accent" />
                        </div>
                      </div>

                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-muted-foreground font-medium animate-pulse">Reading the stars...</p>
                        </div>
                      ) : bookings.length === 0 ? (
                        <div className="text-center py-16 bg-muted/10 rounded-3xl border border-dashed border-white/5">
                          <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                          <p className="text-xl font-medium text-muted-foreground mb-4">No sessions found in your orbit</p>
                          <Button onClick={() => navigate('/booking')} className="btn-cosmic px-10">
                            Book Your First Session
                          </Button>
                        </div>
                      ) : (
                        <div className="grid gap-6">
                          {bookings.map((consultation, idx) => (
                            <motion.div 
                              key={consultation._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="group relative overflow-hidden glass-card p-6 border-white/5 hover:border-primary/30 transition-all duration-500"
                            >
                              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles className="w-20 h-20" />
                              </div>
                              
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-6">
                                  <div className="w-20 h-20 rounded-3xl bg-gradient-cosmic p-1 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                    <div className="w-full h-full rounded-[20px] bg-card flex items-center justify-center text-3xl overflow-hidden relative group-hover:bg-transparent transition-colors">
                                      {consultation.astrologer?.avatar || '🧙'}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-2xl font-bold mb-1 tracking-tight">{consultation.astrologer?.user?.name || consultation.astrologer?.title}</h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" /> {new Date(consultation.startTime).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                      </span>
                                      <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" /> {new Date(consultation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                      <Badge variant="outline" className={cn(
                                        "px-3 py-1 text-[10px] uppercase font-bold tracking-widest",
                                        consultation.status === 'scheduled' ? "bg-blue-400/10 border-blue-400/30 text-blue-400" :
                                        consultation.status === 'completed' ? "bg-success/10 border-success/30 text-success" :
                                        "bg-muted/10 border-white/10 text-muted-foreground"
                                      )}>
                                        {consultation.status}
                                      </Badge>
                                      <Badge variant="outline" className={cn(
                                        "px-3 py-1 text-[10px] uppercase font-bold tracking-widest",
                                        consultation.paymentStatus === 'paid' ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-amber-400/10 border-amber-400/30 text-amber-400"
                                      )}>
                                        {consultation.paymentStatus}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                  {consultation.status === 'scheduled' && consultation.paymentStatus === 'paid' && (
                                    <Button
                                      onClick={() => navigate(`/chat/${consultation._id}`)}
                                      className="btn-cosmic w-full sm:w-auto px-8 group-hover:scale-105"
                                    >
                                      <MessageCircle className="w-5 h-5 mr-2" /> Start Now
                                    </Button>
                                  )}
                                  {consultation.status === 'completed' && (
                                    <Button variant="outline" className="w-full sm:w-auto glass-card border-white/10 hover:bg-white/5 font-semibold">
                                      View Summary
                                    </Button>
                                  )}
                                  <Button variant="ghost" className="w-full sm:w-auto text-muted-foreground hover:text-white">
                                    Details
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="glass-card p-8 border-glow">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h2 className="font-display text-3xl font-bold mb-2">Account Settings</h2>
                          <p className="text-muted-foreground">Manage your personal information and birth details.</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Settings className="w-6 h-6 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-10 max-w-3xl">
                        {/* Profile Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-px flex-1 bg-white/5" />
                                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-primary">Personal Identity</h3>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all focus:bg-white/10"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all focus:bg-white/10"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Birth Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-px flex-1 bg-white/5" />
                                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-accent">Celestial Details</h3>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Date of Birth</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full justify-start rounded-2xl px-4 py-7 bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-left font-normal"
                                            >
                                                <CalendarDays className="w-5 h-5 mr-3 text-primary" />
                                                {selectedBirthDate ? format(selectedBirthDate, 'PPP') : <span className="text-muted-foreground">Select date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 glass-card border-white/10 shadow-2xl" align="start">
                                            <UiCalendar
                                                mode="single"
                                                selected={selectedBirthDate}
                                                fromYear={1900}
                                                toYear={2030}
                                                onSelect={(d) => {
                                                    if (!d) return;
                                                    setFormData({ ...formData, birthDetails: { ...formData.birthDetails, date: format(d, 'yyyy-MM-dd') } });
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Time of Birth</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full justify-start rounded-2xl px-4 py-7 bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-left font-normal"
                                            >
                                                <Clock className="w-5 h-5 mr-3 text-primary" />
                                                {formData.birthDetails.time ? format(parse(formData.birthDetails.time, 'HH:mm', new Date()), 'hh:mm a') : <span className="text-muted-foreground">Select time</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-72 p-4 glass-card border-white/10 shadow-2xl" align="start">
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Celestial Alignment Time</p>
                                            <ScrollArea className="h-64 rounded-xl border border-white/5 bg-black/20">
                                                <div className="p-2 grid grid-cols-2 gap-2">
                                                    {timeSlots.map((t) => {
                                                        const isSelected = formData.birthDetails.time === t;
                                                        return (
                                                            <button
                                                                key={t}
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, birthDetails: { ...formData.birthDetails, time: t } })}
                                                                className={cn(
                                                                    "px-3 py-2 rounded-xl text-sm font-medium transition-all border",
                                                                    isSelected
                                                                        ? "bg-primary border-primary text-white shadow-glow"
                                                                        : "bg-transparent border-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                                                                )}
                                                            >
                                                                {format(parse(t, 'HH:mm', new Date()), 'hh:mm a')}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </ScrollArea>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Place of Birth</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.birthDetails.place}
                                            onChange={(e) => setFormData({...formData, birthDetails: {...formData.birthDetails, place: e.target.value}})}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all focus:bg-white/10"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button 
                                onClick={handleSaveSettings} 
                                disabled={isSaving} 
                                className="btn-cosmic px-12 h-14 text-lg group overflow-hidden relative"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isSaving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Update Profile
                                        </>
                                    )}
                                </span>
                            </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DashboardPage;
