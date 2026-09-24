import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { FirebaseDomainNotice } from '../components/FirebaseDomainNotice';
import { notify } from '../lib/toast';

export function Login() {
  const { user, loading: authLoading, loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);

  if (authLoading) return null;
  if (user) {
    const sessionToken = localStorage.getItem('lensdrop_session_token');
    let isAdminRole = false;
    if (sessionToken) {
      try {
        const parsed = JSON.parse(sessionToken);
        isAdminRole = parsed.role === 'admin';
      } catch (e) {}
    }
    const userEmailLower = user.email?.toLowerCase();
    if (userEmailLower === 'pkskkumar900@gmail.com' || userEmailLower === 'kusprince.raj@gmail.com' || isAdminRole) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      
      let sessionConfig = { role: 'user' };

      const lowerEmail = email.toLowerCase().trim();
      if (lowerEmail === 'pkskkumar900@gmail.com' || lowerEmail === 'kusprince.raj@gmail.com') {
        sessionConfig.role = 'admin';
        localStorage.setItem('lensdrop_session_token', JSON.stringify(sessionConfig));
        navigate('/admin/dashboard');
      } else {
        localStorage.setItem('lensdrop_session_token', JSON.stringify(sessionConfig));
        navigate('/dashboard');
      }
    } catch (err: any) {
      let errorMessage = 'Authentication failed. Please try again.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminDemo = () => {
    const sessionConfig = { role: 'admin', email: 'kusprince.raj@gmail.com' };
    localStorage.setItem('lensdrop_session_token', JSON.stringify(sessionConfig));
    notify.success('Signed in as Admin (kusprince.raj@gmail.com)');
    navigate('/admin/dashboard');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsUnauthorizedDomain(false);
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      const userEmail = result?.user?.email?.toLowerCase();

      let sessionConfig = { role: 'user' };

      if (userEmail === 'pkskkumar900@gmail.com' || userEmail === 'kusprince.raj@gmail.com') {
        sessionConfig.role = 'admin';
        localStorage.setItem('lensdrop_session_token', JSON.stringify(sessionConfig));
        navigate('/admin/dashboard');
      } else {
        localStorage.setItem('lensdrop_session_token', JSON.stringify(sessionConfig));
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      let errorMessage = 'Google sign-in failed. Please try again.';
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('auth/unauthorized-domain')) {
        setIsUnauthorizedDomain(true);
        errorMessage = 'Firebase Google Sign-In: Unauthorized domain. Please see resolution steps below, or use Email & Password.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed before completing.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-slate-800 p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center">
            <Camera className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Welcome back
        </h2>
        <p className="text-center text-gray-500 dark:text-slate-400 mb-8">
          Enter your details to access your dashboard.
        </p>

        {isUnauthorizedDomain && (
          <FirebaseDomainNotice 
            onUseDemoAdmin={handleQuickAdminDemo}
          />
        )}

        {error && !isUnauthorizedDomain && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 dark:text-slate-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
              <Link to="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 dark:text-slate-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </motion.button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400">
                OR
              </span>
            </div>
          </div>

          <div className="mt-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800/50 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </motion.button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
            Sign up
          </Link>
        </p>

        {/* Guest Fast Access */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Looking for a wedding album or guest access?</p>
          <div className="flex items-center justify-center gap-3 text-xs font-semibold">
            <Link to="/wedding-qrs" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Scan Wedding QR Passes →
            </Link>
            <span className="text-gray-300 dark:text-slate-700">•</span>
            <Link to="/event/demo" className="text-gray-500 dark:text-slate-400 hover:text-indigo-500">
              Live Gallery
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
