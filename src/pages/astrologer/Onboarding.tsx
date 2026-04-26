import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
    Briefcase, 
    Globe, 
    DollarSign, 
    Camera, 
    CheckCircle2, 
    ArrowRight, 
    ArrowLeft, 
    Sparkles,
    Star
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Expertise', description: 'Your specializations' },
  { id: 2, title: 'Pricing', description: 'Languages & rates' },
  { id: 3, title: 'Profile', description: 'Bio & photo' }
];

const AstrologerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    specialization: [] as string[],
    experience: 0,
    languages: [] as string[],
    pricePerMin: 0,
    bio: '',
    profilePhoto: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { user } = useAuth() as any;
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/astrologer/profile', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) {
          const profile = await res.json();
          if (profile.status === 'approved') {
            navigate('/astrologer/dashboard');
          } else if (profile.status === 'pending' && profile.specialization && profile.specialization.length > 0) {
            setIsSubmitted(true);
          }
        }
      } catch (error) {
        console.error("Error checking status:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    if (user) checkStatus();
  }, [user]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));


  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/astrologer/onboarding', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        toast({ title: "Error", description: data.message || "Failed to submit profile", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const specializationsList = ["Vedic", "Tarot", "Numerology", "Palmistry", "Vastu", "Face Reading", "Prashna Kundali"];
  const languagesList = ["English", "Hindi", "Bengali", "Marathi", "Tamil", "Telugu", "Gujarati"];

  if (initialLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Checking status...</div>;
  }

  if (isSubmitted) {

    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full text-center p-12 rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/30"
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Application Submitted!</h1>
            <p className="text-white/60 mb-8 text-lg leading-relaxed">
              Your profile is now being reviewed by our expert committee. We'll notify you via email within 24 hours.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-medium"
            >
              Return Home
            </button>
            
            {/* Cosmic sparkles */}
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-12 -right-12 text-primary/20"
            >
              <Sparkles size={120} />
            </motion.div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-24 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                      currentStep >= step.id 
                        ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] text-primary' 
                        : 'bg-white/5 border-white/10 text-white/30'
                    }`}>
                      {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : step.id}
                    </div>
                    <span className={`mt-3 text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-white/30'}`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 h-px mx-4 bg-white/10 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                        className="absolute top-0 left-0 h-full bg-primary"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
              <p className="text-white/50">{steps[currentStep-1].description}</p>
            </div>
          </div>

          {/* Form Card */}
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-8 sm:p-12 rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-lg font-medium mb-6">
                    <Star className="text-primary w-5 h-5" />
                    What are your specializations?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {specializationsList.map(spec => (
                      <button
                        key={spec}
                        onClick={() => toggleSpecialization(spec)}
                        className={`px-4 py-3 rounded-xl border transition-all text-sm ${
                          formData.specialization.includes(spec)
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-lg font-medium mb-4">
                    <Briefcase className="text-primary w-5 h-5" />
                    Years of Experience
                  </label>
                  <input 
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-lg font-medium mb-6">
                    <Globe className="text-primary w-5 h-5" />
                    Languages You Speak
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {languagesList.map(lang => (
                      <button
                        key={lang}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          languages: prev.languages.includes(lang) 
                            ? prev.languages.filter(l => l !== lang)
                            : [...prev.languages, lang]
                        }))}
                        className={`px-4 py-3 rounded-xl border transition-all text-sm ${
                          formData.languages.includes(lang)
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-lg font-medium mb-4">
                    <DollarSign className="text-primary w-5 h-5" />
                    Consultation Price (per min)
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                    <input 
                      type="number"
                      value={formData.pricePerMin}
                      onChange={(e) => setFormData({...formData, pricePerMin: parseInt(e.target.value)})}
                      className="w-full pl-10 pr-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all"
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-lg font-medium mb-4">
                    <Camera className="text-primary w-5 h-5" />
                    Profile Photo URL
                  </label>
                  <input 
                    type="text"
                    value={formData.profilePhoto}
                    onChange={(e) => setFormData({...formData, profilePhoto: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-lg font-medium mb-4">
                    <Sparkles className="text-primary w-5 h-5" />
                    Professional Bio
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all resize-none"
                    placeholder="Tell users about your experience and how you can help them..."
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-12">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
              )}
              <button
                onClick={currentStep === 3 ? handleSubmit : handleNext}
                disabled={isSubmitting}
                className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : currentStep === 3 ? 'Submit Application' : 'Continue'}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AstrologerOnboarding;
