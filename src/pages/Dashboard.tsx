import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { User as UserIcon, Calendar, Clock, MapPin, FileText, Download, Settings, LogOut, Star, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockUser = {
  name: 'Priya Sharma',
  email: 'priya@example.com',
  avatar: '👩🏽',
  birthDetails: {
    date: '1995-03-15',
    time: '10:30',
    place: 'Mumbai, India',
  },
  sunSign: 'Pisces',
  moonSign: 'Taurus',
  ascendant: 'Cancer',
};

const mockReports = [
  { id: 1, name: 'Birth Chart Analysis', date: 'Feb 1, 2026', type: 'Kundli' },
  { id: 2, name: 'Annual Prediction 2026', date: 'Jan 15, 2026', type: 'Varshaphal' },
  { id: 3, name: 'Career Guidance Report', date: 'Jan 10, 2026', type: 'Career' },
];

const mockConsultations = [
  { id: 1, astrologer: 'Pandit Rajesh', date: 'Jan 25, 2026', type: 'Video', status: 'Completed' },
  { id: 2, astrologer: 'Dr. Meera Sharma', date: 'Feb 10, 2026', type: 'Phone', status: 'Upcoming' },
];

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

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-6 mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-cosmic flex items-center justify-center text-4xl mx-auto mb-4">
                    {user?.name?.[0] || '👤'}
                  </div>
                  <h2 className="font-display text-xl font-semibold">{user?.name}</h2>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
                </div>
                <div className="section-divider my-6" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Type</span>
                    <span className="text-accent uppercase font-bold tracking-widest text-[10px]">{user?.role}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Joined Sanctuary</span>
                    <span className="text-accent">Feb 2026</span>
                  </div>
                </div>
              </div>

              <nav className="glass-card p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
                <div className="section-divider my-4" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </motion.aside>

            {/* Main Content */}
            <motion.main
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Welcome Card */}
                  <div className="glass-card p-8 bg-gradient-to-r from-primary/20 to-accent/10">
                    <div className="flex items-center gap-4 mb-4">
                      <Sparkles className="w-8 h-8 text-accent" />
                      <div>
                        <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                        <p className="text-muted-foreground">Your cosmic journey continues...</p>
                      </div>
                    </div>
                    <p className="text-foreground/80">
                      Today's energy is favorable for new beginnings. The Moon in your 5th house
                      encourages creativity and self-expression.
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="glass-card p-6 text-center">
                      <div className="text-3xl font-display font-bold text-gradient-gold mb-1">{mockReports.length}</div>
                      <div className="text-sm text-muted-foreground">Reports Generated</div>
                    </div>
                    <div className="glass-card p-6 text-center">
                      <div className="text-3xl font-display font-bold text-gradient-cosmic mb-1">{bookings.length}</div>
                      <div className="text-sm text-muted-foreground">Total Consultations</div>
                    </div>
                    <div className="glass-card p-6 text-center">
                      <div className="text-3xl font-display font-bold text-gradient-aurora mb-1">{upcomingConsultations.length}</div>
                      <div className="text-sm text-muted-foreground">Upcoming Sessions</div>
                    </div>
                  </div>

                  {/* Birth Details */}
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Your Birth Details</h3>
                    <div className="flex items-center gap-4 p-8 border-2 border-dashed border-white/5 rounded-2xl text-center flex-col">
                      <AlertCircle className="w-10 h-10 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground italic">Your birth details haven't been completed yet. Update them in settings to get personalized daily horoscopes.</p>
                      <Button variant="link" onClick={() => setActiveTab('settings')} className="text-accent underline">Complete Profile</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="glass-card p-6">
                  <h2 className="font-display text-xl font-semibold mb-6">My Reports</h2>
                  <div className="space-y-4">
                    {mockReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <FileText className="w-8 h-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{report.name}</h4>
                            <p className="text-sm text-muted-foreground">{report.type} • {report.date}</p>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'consultations' && (
                <div className="glass-card p-6">
                  <h2 className="font-display text-xl font-semibold mb-6">Consultation History</h2>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        <p>No consultations booked yet.</p>
                        <Button onClick={() => navigate('/astrologers')} variant="link" className="text-accent">Browse Astrologers</Button>
                      </div>
                    ) : (
                      bookings.map((consultation) => (
                        <div key={consultation._id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-muted/30 rounded-2xl border border-white/5 hover:border-white/10 transition-all gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-cosmic flex items-center justify-center text-xl shadow-lg">
                              {consultation.astrologer?.avatar || '🧙'}
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">{consultation.astrologer?.user?.name || consultation.astrologer?.title}</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3" /> {new Date(consultation.startTime).toLocaleDateString()} at {new Date(consultation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-widest ${consultation.status === 'completed' ? 'border-success/30 text-success' : 'border-primary/30 text-primary'
                                  }`}>
                                  {consultation.status}
                                </Badge>
                                <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-widest ${consultation.paymentStatus === 'paid' ? 'border-success/30 text-success' : 'border-warning/30 text-warning'
                                  }`}>
                                  {consultation.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {consultation.status === 'scheduled' && consultation.paymentStatus === 'paid' && (
                              <Button
                                onClick={() => navigate(`/chat/${consultation._id}`)}
                                className="btn-cosmic px-6 group"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" /> Start Consultation
                              </Button>
                            )}
                            {consultation.status === 'completed' && (
                              <Button variant="outline" className="glass-card hover:bg-white/5">
                                View Summary
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="glass-card p-6">
                  <h2 className="font-display text-xl font-semibold mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                      />
                    </div>
                    <div className="section-divider" />
                    <h3 className="font-display text-lg font-semibold">Birth Details</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={formData.birthDetails.date}
                          onChange={(e) => setFormData({...formData, birthDetails: {...formData.birthDetails, date: e.target.value}})}
                          className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Time of Birth</label>
                        <input
                          type="time"
                          value={formData.birthDetails.time}
                          onChange={(e) => setFormData({...formData, birthDetails: {...formData.birthDetails, time: e.target.value}})}
                          className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Place of Birth</label>
                        <input
                          type="text"
                          value={formData.birthDetails.place}
                          onChange={(e) => setFormData({...formData, birthDetails: {...formData.birthDetails, place: e.target.value}})}
                          className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                    <button onClick={handleSaveSettings} disabled={isSaving} className="btn-cosmic">
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </motion.main>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DashboardPage;
