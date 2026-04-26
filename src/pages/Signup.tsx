import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Check, Briefcase, UserCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useGoogleLogin } from '@react-oauth/google';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' as 'client' | 'astrologer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const { toast } = useToast();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        await googleLogin(tokenResponse.access_token, formData.role);
        toast({ title: "Success", description: "Account created successfully!" });
      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Google Login failed", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Google Login failed", variant: "destructive" });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains a number', met: /\d/.test(formData.password) },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
  ];

  return (
    <Layout>
      <section className="py-24 min-h-[80vh] flex items-center relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative p-8 sm:p-10 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              {/* Inner card glow top border effect */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {/* Header */}
              <div className="text-center mb-8 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 mb-6 shadow-lg shadow-primary/20"
                >
                  <Logo className="w-10 h-10 animate-pulse-glow" />
                </motion.div>
                <h1 className="font-display text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Create Account</h1>
                <p className="text-white/60 text-sm">Begin your journey with the stars</p>
              </div>

              {/* Google Sign Up */}
              <button 
                type="button" 
                onClick={() => loginWithGoogle()} 
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 mb-6 group"
              >
                <div className="bg-white p-1 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <span className="font-medium text-white/90">Continue with Google</span>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/40 text-xs font-medium uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'client' })}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.role === 'client'
                    ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                    : 'border-white/10 bg-black/20 hover:bg-white/5'
                    }`}
                >
                  <UserCircle className={`w-6 h-6 ${formData.role === 'client' ? 'text-primary' : 'text-white/60'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'client' ? 'text-white' : 'text-white/60'}`}>
                    As Client
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'astrologer' })}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.role === 'astrologer'
                    ? 'border-accent bg-accent/20 shadow-[0_0_15px_rgba(var(--accent),0.2)]'
                    : 'border-white/10 bg-black/20 hover:bg-white/5'
                    }`}
                >
                  <Briefcase className={`w-6 h-6 ${formData.role === 'astrologer' ? 'text-accent' : 'text-white/60'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'astrologer' ? 'text-white' : 'text-white/60'}`}>
                    As Astrologer
                  </span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm text-white/70 mb-2 ml-1">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-white/70 mb-2 ml-1">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-white/70 mb-2 ml-1">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Create a password"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 outline-none transition-all duration-300 pr-12 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/90 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="mt-3 space-y-2 ml-1">
                      {passwordRequirements.map((req) => (
                        <div key={req.text} className="flex items-center gap-2 text-xs">
                          <Check className={`w-3.5 h-3.5 ${req.met ? 'text-primary drop-shadow-[0_0_5px_rgba(var(--primary),0.5)]' : 'text-white/30'}`} />
                          <span className={req.met ? 'text-white/90 font-medium' : 'text-white/40'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-white/70 mb-2 ml-1">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 outline-none transition-all duration-300 pr-12 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group mt-4 ml-1">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="w-4 h-4 rounded border border-white/30 bg-white/10 appearance-none checked:bg-primary checked:border-primary transition-all peer cursor-pointer" required />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:text-accent transition-colors">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary hover:text-accent transition-colors">Privacy Policy</Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 mt-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-white font-medium disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>

              <p className="text-center text-white/60 mt-8">
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:text-white transition-colors font-medium">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SignupPage;
