import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User as UserIcon,
  Home,
  Settings, 
  Moon, 
  Sun, 
  Shield, 
  FileText, 
  LogOut,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  QrCode,
  Check,
  Copy,
  ExternalLink,
  HelpCircle,
  Camera,
  Lock,
  Palette
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SettingsModal, ModalView } from './SettingsModal';
import { notify } from '../lib/toast';

export function ProfileMenu() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const openModal = (view: ModalView) => {
    setModalView(view);
    setIsOpen(false);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.email) {
      navigator.clipboard.writeText(user.email);
      setCopiedEmail(true);
      notify.success('Email copied to clipboard');
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'Photographer';
  const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&bold=true`;

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Luxury Profile Trigger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2.5 p-1 sm:pl-1.5 sm:pr-3 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            isOpen 
              ? 'border-indigo-500/50 bg-indigo-50/70 dark:bg-slate-800 ring-2 ring-indigo-500/20' 
              : 'border-gray-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-slate-800/80 shadow-xs'
          }`}
          aria-expanded={isOpen}
          aria-label="User Profile Menu"
        >
          {/* Avatar with live status indicator */}
          <div className="relative">
            <img 
              src={avatarUrl} 
              alt={displayName} 
              className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-700 object-cover shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          {/* User info preview on tablet & desktop */}
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[110px]">
              {displayName}
            </span>
            <span className="text-[10px] font-medium leading-none mt-0.5 text-gray-500 dark:text-slate-400">
              {isAdmin ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Admin</span>
              ) : (
                <span>Pro Host</span>
              )}
            </span>
          </div>

          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-slate-400 transition-transform duration-200 group-hover:text-gray-700 dark:group-hover:text-white ${isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`} />
        </button>

        {/* Premium Popover Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="absolute right-0 mt-2.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200/90 dark:border-white/[0.08] overflow-hidden z-50 backdrop-blur-xl"
            >
              {/* Profile Card Header */}
              <div className="p-4 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border-b border-gray-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={avatarUrl} 
                      alt={displayName} 
                      className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-800 shadow-md object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      {isAdmin ? (
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 shrink-0">
                          Pro
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate select-all">
                        {user.email}
                      </p>
                      <button
                        onClick={handleCopyEmail}
                        className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors rounded"
                        title="Copy email"
                      >
                        {copiedEmail ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Link to Edit Profile */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 dark:text-slate-400">Account status</span>
                  <Link
                    to="/settings/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Edit Profile</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Main Menu Links */}
              <div className="p-2 space-y-0.5">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Home className="w-4 h-4 text-indigo-500" />
                  <span>Home Dashboard</span>
                </Link>

                <Link
                  to="/settings/profile"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    location.pathname === '/settings/profile'
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  <span>My Profile & Avatar</span>
                </Link>

                <Link
                  to="/wedding-qrs"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    location.pathname === '/wedding-qrs'
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-4 h-4 text-purple-500" />
                    <span>Wedding QR Passes</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
                    4 Styles
                  </span>
                </Link>

                <Link
                  to="/settings/profile?tab=security"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    location.pathname.includes('/settings/profile') && location.search.includes('security')
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Lock className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  <span>Security & Auth</span>
                </Link>

                <Link
                  to="/settings/appearance"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    location.pathname === '/settings/appearance'
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Palette className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  <span>Appearance & Themes</span>
                </Link>

                {/* Admin Quick Jump */}
                {isAdmin && (
                  <div className="pt-1 mt-1 border-t border-gray-100 dark:border-white/[0.06]">
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50/70 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Super Admin Console</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-bold">Portal</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Support & Legal */}
              <div className="p-2 border-t border-gray-100 dark:border-white/[0.06] space-y-0.5">
                <Link
                  to="/settings/support"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help Center & Support</span>
                </Link>
                <Link
                  to="/settings/legal"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Privacy Policy & Terms</span>
                </Link>
              </div>

              {/* Footer: Theme Toggle & Sign Out */}
              <div className="p-2 bg-gray-50/80 dark:bg-slate-950/60 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors border border-gray-200/60 dark:border-white/10"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SettingsModal view={modalView} onClose={() => setModalView(null)} />
    </>
  );
}
