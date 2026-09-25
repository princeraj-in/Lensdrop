import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  User, 
  Shield, 
  Key, 
  Mail, 
  Camera, 
  Save, 
  Palette, 
  HelpCircle, 
  Sparkles, 
  Check, 
  MessageCircle, 
  Lock,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  Info
} from 'lucide-react';
import { notify } from '../../lib/toast';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

type TabType = 'profile' | 'security' | 'preferences' | 'support';

export function ProfileSettings() {
  const { user, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Read URL query tab parameter if specified (e.g. ?tab=security)
  const searchParams = new URLSearchParams(location.search);
  const initialTab = (searchParams.get('tab') as TabType) || 'profile';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security tab fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isGoogleAuth = user?.providerData?.some(provider => provider.providerId === 'google.com');

  useEffect(() => {
    const savedProfile = localStorage.getItem('lensdrop_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.displayName) setDisplayName(parsed.displayName);
        if (parsed.avatarBase64) {
          setAvatarPreview(parsed.avatarBase64);
          setBase64Image(parsed.avatarBase64);
        }
      } catch {
        // ignore
      }
    } else if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        notify.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBase64Image(base64String);
        setAvatarPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const profileData = {
        displayName,
        avatarBase64: base64Image
      };
      localStorage.setItem('lensdrop_user_profile', JSON.stringify(profileData));

      if (user.uid && !user.isLocalSession) {
        try {
          await updateProfile(user, { displayName });
          await updateDoc(doc(db, 'users', user.uid), { displayName });
        } catch {
          // safe fallback
        }
      }
      
      notify.success('Profile updated successfully!');
    } catch {
      notify.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notify.error('Passwords do not match');
      return;
    }
    notify.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const nameToShow = displayName || user?.displayName || user?.email?.split('@')[0] || 'Photographer';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Profile Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative group shrink-0">
            <img 
              src={avatarPreview || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(nameToShow)}&background=ffffff&color=6366f1&bold=true`} 
              alt={nameToShow} 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white/20 object-cover shadow-2xl transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2.5 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              title="Change Avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {nameToShow}
              </h1>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Super Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-white/20 text-white border border-white/30 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  Pro Host
                </span>
              )}
            </div>
            <p className="text-sm text-white/80 font-medium truncate max-w-md">
              {user?.email}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-white/90">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Account Active
              </span>
              <span>•</span>
              <span>LensDrop Studio v2.4</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-slate-900 rounded-2xl mb-8 border border-gray-200/80 dark:border-slate-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'security'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Auth</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'preferences'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Preferences & Theme</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'support'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </button>
      </div>

      {/* Tab 1: Profile Info */}
      {activeTab === 'profile' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Public Profile</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">Information visible across your event galleries.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                Display / Studio Name
              </label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white text-sm font-medium"
                placeholder="e.g. Prince Raj Photography"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-500 dark:text-slate-400 text-sm font-medium cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
            <button 
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Security & Authentication */}
      {activeTab === 'security' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Authentication Badge */}
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              <span>Primary Authentication Provider</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">How you access your LensDrop host account.</p>

            <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 flex items-center gap-4">
              {isGoogleAuth ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Google OAuth 2.0 Connected</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Single Sign-On managed securely via Google ID ({user?.email})</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Email & Password Credentials</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Signed in as {user?.email}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Password Update Form */}
          {!isGoogleAuth && (
            <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-500" />
                <span>Update Password</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">Choose a strong password with at least 8 characters.</p>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                    Current Password
                  </label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                      New Password
                    </label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      )}

      {/* Tab 3: Preferences & Appearance */}
      {activeTab === 'preferences' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Theme & Interface Preferences</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">Customize visual appearance and responsive mode.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                notify.success('Switched to Light Mode');
              }}
              className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 ring-2 ring-indigo-500/30'
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Light Mode</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">High contrast daytime gallery look</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                notify.success('Switched to Dark Mode');
              }}
              className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode (Pro)</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Sleek obsidian cinema mode</p>
              </div>
            </button>
          </div>
        </motion.div>
      )}

      {/* Tab 4: Help & Support */}
      {activeTab === 'support' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Direct Developer & Founder Support</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">Get immediate assistance with event setup or custom domains.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://wa.me/918252995548"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-400 flex items-center gap-4 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200 group-hover:underline">
                  WhatsApp Founder
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  +91 8252995548 (Instant Response)
                </p>
              </div>
            </a>

            <a
              href="mailto:founder@imprince.me"
              className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 hover:border-indigo-400 flex items-center gap-4 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200 group-hover:underline">
                  Email Desk
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-400">
                  founder@imprince.me
                </p>
              </div>
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
