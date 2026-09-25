import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Sparkles, 
  Plus, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  Home,
  User as UserIcon,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  QrCode,
  Lock,
  Palette,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ProfileMenu } from './ProfileMenu';
import { CommandPalette } from './CommandPalette';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: 'upload' | 'approved' | 'scan';
  unread: boolean;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, title: 'Guest upload received', desc: 'Aisha & Neil dropped 4 photos into Wedding Reception', time: '5m ago', type: 'upload', unread: true },
    { id: 2, title: 'Live QR Scanned', desc: '14 guests scanned your Live QR Pass at Event Hall', time: '28m ago', type: 'scan', unread: true },
    { id: 3, title: 'Photos approved', desc: '6 guest photos approved and published to live screen', time: '1h ago', type: 'approved', unread: false },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/dashboard' || location.pathname === '/';
  const isProfile = location.pathname === '/settings/profile' || location.pathname === '/profile';
  const isQRs = location.pathname === '/wedding-qrs';
  const isAppearance = location.pathname === '/settings/appearance';
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Human readable breadcrumb title
  const getRouteTitle = () => {
    if (location.pathname === '/dashboard' || location.pathname === '/') return 'Home';
    if (location.pathname === '/wedding-qrs') return 'Wedding QR Passes';
    if (location.pathname.startsWith('/upload/')) return 'Event Studio';
    if (location.pathname.startsWith('/event/')) return 'Live Gallery';
    if (location.pathname === '/settings/profile' || location.pathname === '/profile') return 'My Profile';
    if (location.pathname === '/settings/security') return 'Security';
    if (location.pathname === '/settings/appearance') return 'Appearance';
    if (location.pathname === '/settings/support') return 'Support';
    if (location.pathname === '/settings/legal') return 'Legal & Privacy';
    if (location.pathname.startsWith('/admin/dashboard')) return 'Admin Overview';
    if (location.pathname.startsWith('/admin/users')) return 'User Directory';
    if (location.pathname.startsWith('/admin/events')) return 'Platform Events';
    if (location.pathname.startsWith('/admin/settings')) return 'System Settings';
    return null;
  };

  const breadcrumb = getRouteTitle();

  const handleCreateEventClick = () => {
    if (location.pathname === '/dashboard') {
      const input = document.getElementById('newEventInput');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      navigate('/dashboard');
      setTimeout(() => {
        const input = document.getElementById('newEventInput');
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/85 dark:bg-slate-950/85 border-b border-gray-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* LEFT: Brand Logo + Active Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Sidebar toggle for responsive host workspace */}
            {user && onToggleSidebar && (
              <button 
                onClick={onToggleSidebar}
                className="p-2 -ml-1 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors md:hidden"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link 
              to={user ? "/dashboard" : "/"} 
              className="flex items-center gap-2.5 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
            >
              {/* Camera Logo Mark */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Camera className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-indigo-400 group-hover:rotate-6 transition-transform duration-300" />
                </div>
              </div>

              {/* Brand Name */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 dark:text-white">
                    Lens<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Drop</span>
                  </span>
                  <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                    Pro
                  </span>
                </div>
              </div>
            </Link>

            {/* Breadcrumb / Context Pill */}
            {user && breadcrumb && (
              <div className="hidden xl:flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 border-l border-gray-200 dark:border-slate-800 pl-3.5 ml-1">
                <span className="text-gray-300 dark:text-slate-700">/</span>
                <span className="font-semibold text-gray-700 dark:text-slate-200 truncate">
                  {breadcrumb}
                </span>
              </div>
            )}
          </div>

          {/* CENTER: Premium App Navigation Dock (Home, Events, QR Passes, Profile, Admin) */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 dark:bg-slate-900/70 p-1.5 rounded-2xl border border-gray-200/70 dark:border-white/[0.08] backdrop-blur-md shadow-inner">
            {user ? (
              <>
                {/* 1. Home */}
                <Link 
                  to="/dashboard" 
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    isHome 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Home className={`w-3.5 h-3.5 ${isHome ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'}`} />
                  <span>Home</span>
                </Link>

                {/* 2. Wedding QR Passes */}
                <Link 
                  to="/wedding-qrs" 
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    isQRs
                      ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>QR Passes</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
                    4
                  </span>
                </Link>

                {/* 3. Profile Link (Directly in Center Nav as requested!) */}
                <Link 
                  to="/settings/profile" 
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    isProfile 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <UserIcon className={`w-3.5 h-3.5 ${isProfile ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'}`} />
                  <span>Profile</span>
                </Link>

                {/* 4. Super Admin (if admin role) */}
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                      isAdminRoute 
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-sm border border-emerald-500/30' 
                        : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            ) : (
              /* Public / Logged Out Center Nav */
              <>
                <Link 
                  to="/" 
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    location.pathname === '/' 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/wedding-qrs" 
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    isQRs 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Wedding Passes</span>
                </Link>
                <Link 
                  to="/event/demo" 
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all duration-200 flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Sample Gallery</span>
                </Link>
                <Link 
                  to="/settings/support" 
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all duration-200"
                >
                  Help & Support
                </Link>
              </>
            )}
          </nav>

          {/* RIGHT: Actions, Notifications, Theme & Luxury Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Command Palette Launcher (Cmd+K) */}
            {user && (
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-white/10 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20 transition-all text-xs shadow-xs"
                title="Search or Jump... (Cmd + K)"
              >
                <Search className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-medium text-[11px]">Search...</span>
                <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-400">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Quick Action Button for Authenticated Users */}
            {user && (
              <button
                onClick={handleCreateEventClick}
                className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                title="Create a new event"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Event</span>
              </button>
            )}

            {/* Notifications Popover for Logged-In Users */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2 sm:p-2.5 rounded-full text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors relative border ${
                    notificationsOpen 
                      ? 'bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-white/20' 
                      : 'border-transparent hover:bg-gray-100 dark:hover:bg-slate-900'
                  }`}
                  aria-label="Activity and notifications"
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/[0.08] shadow-2xl p-4 z-50 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            Activity Stream
                          </h4>
                          {unreadCount > 0 && (
                            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="divide-y divide-gray-100 dark:divide-white/[0.06] mt-2 space-y-1 max-h-72 overflow-y-auto">
                        {notifications.map((act) => (
                          <div 
                            key={act.id} 
                            className={`pt-2.5 pb-2 text-left flex items-start gap-3 -mx-2 px-2.5 rounded-xl transition-colors ${
                              act.unread 
                                ? 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40' 
                                : 'hover:bg-gray-50 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <div className="mt-0.5 p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                              {act.type === 'upload' ? (
                                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                              ) : act.type === 'scan' ? (
                                <QrCode className="w-3.5 h-3.5 text-purple-500" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                {act.title}
                              </p>
                              <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                {act.desc}
                              </p>
                            </div>
                            <span className="text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap ml-1">
                              {act.time}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
                        <Link 
                          to="/dashboard"
                          onClick={() => setNotificationsOpen(false)} 
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          View all event events →
                        </Link>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500">Auto-sync active</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 sm:p-2.5 rounded-full text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle Color Theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-indigo-600 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>

            {/* USER PROFILE COMPONENT OR GUEST CTA */}
            {user ? (
              <ProfileMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white px-3 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Trigger for Full Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 md:hidden transition-colors ml-0.5"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE APP DRAWER / POPDOWN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 dark:border-white/[0.08] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-5 py-5 space-y-4 shadow-2xl overflow-hidden"
          >
            {user ? (
              <>
                {/* User Mini Card in Mobile */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200/60 dark:border-white/[0.06]">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=6366f1&color=fff`} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {user.displayName || user.email?.split('@')[0]}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/settings/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 shrink-0"
                  >
                    Profile
                  </Link>
                </div>

                {/* Mobile Navigation Links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold transition-colors ${
                      isHome
                        ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <Home className="w-4 h-4 text-indigo-500" />
                    <span>Home</span>
                  </Link>

                  <Link
                    to="/wedding-qrs"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold transition-colors ${
                      isQRs
                        ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>QR Passes</span>
                  </Link>

                  <Link
                    to="/settings/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold transition-colors ${
                      isProfile
                        ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-indigo-500" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/settings/profile?tab=security"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold transition-colors ${
                      location.pathname.includes('profile') && location.search.includes('security')
                        ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <span>Security & Auth</span>
                  </Link>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Super Admin Portal</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}

                {/* Mobile Create Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleCreateEventClick();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Event</span>
                </button>

                {/* Sign Out */}
                <div className="pt-2 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
                  <Link
                    to="/settings/support"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Help & Support
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 py-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              /* Mobile Visitor View */
              <div className="space-y-3">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  <Home className="w-4 h-4 text-indigo-500" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/wedding-qrs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Wedding QR Passes (4 Styles)</span>
                </Link>
                <Link
                  to="/event/demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Sample Live Gallery</span>
                </Link>
                <Link
                  to="/settings/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-semibold text-gray-700 dark:text-slate-300"
                >
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span>Help & Support</span>
                </Link>

                <div className="pt-3 border-t border-gray-100 dark:border-white/[0.06] flex flex-col gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-xs font-semibold rounded-xl border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Cmd+K Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />
    </header>
  );
}
