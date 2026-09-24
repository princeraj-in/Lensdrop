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
  LayoutDashboard, 
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
  Clock,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ProfileMenu } from './ProfileMenu';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const isEventGallery = location.pathname.startsWith('/event/');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboard = location.pathname === '/dashboard';

  // Sample recent activity for notifications popover
  const recentActivities = [
    { id: 1, title: 'Guest upload received', desc: 'Aisha & Neil dropped 4 photos', time: '5m ago', type: 'pending' },
    { id: 2, title: 'Photos approved', desc: '3 photos moved to Live Gallery', time: '1h ago', type: 'approved' },
    { id: 3, title: 'Gallery visited', desc: '14 guests scanned your QR code', time: '3h ago', type: 'info' },
  ];

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

  // Derive breadcrumb title
  const getRouteTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname.startsWith('/upload/')) return 'Event Studio';
    if (location.pathname.startsWith('/event/')) return 'Live Gallery';
    if (location.pathname.startsWith('/admin/dashboard')) return 'Admin Overview';
    if (location.pathname.startsWith('/admin/users')) return 'User Directory';
    if (location.pathname.startsWith('/admin/events')) return 'Platform Events';
    if (location.pathname.startsWith('/admin/settings')) return 'System Settings';
    if (location.pathname.startsWith('/settings/')) return 'Settings';
    return null;
  };

  const breadcrumb = getRouteTitle();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-gray-200/80 dark:border-white/[0.07] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Left: Brand + Breadcrumbs / Mobile Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {user && onToggleSidebar && (
              <button 
                onClick={onToggleSidebar}
                className="p-2 -ml-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors md:hidden"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link 
              to="/" 
              className="flex items-center gap-2.5 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Camera className="w-5 h-5 text-indigo-400 group-hover:rotate-6 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
                    Lens<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Drop</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                    Pro
                  </span>
                </div>
              </div>
            </Link>

            {/* Breadcrumb if authenticated & inside workspace */}
            {user && breadcrumb && (
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500 border-l border-gray-200 dark:border-slate-800 pl-4 ml-1">
                <span>/</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200 truncate">
                  {breadcrumb}
                </span>
              </div>
            )}
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link 
              to="/wedding-qrs" 
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/wedding-qrs'
                  ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Wedding QR Passes</span>
              <span className="text-[10px] bg-indigo-500 text-white font-bold px-1.5 py-0.2 rounded-full">4</span>
            </Link>

            {!user ? (
              <>
                <Link 
                  to="/event/demo" 
                  className="px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sample Gallery
                </Link>
                <Link 
                  to="/settings/support" 
                  className="px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Help & Support
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-900/60 p-1 rounded-xl border border-gray-200 dark:border-slate-800/80">
                <Link 
                  to="/dashboard" 
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isDashboard 
                      ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      isAdminRoute 
                        ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30' 
                        : 'text-gray-600 dark:text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <Link 
                  to="/settings/profile" 
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                >
                  Settings
                </Link>
              </div>
            )}
          </nav>

          {/* Right: Actions, Theme Switcher & User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Quick Action Button for Authenticated Users */}
            {user && (
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Event</span>
              </button>
            )}

            {/* Notifications Popover for Logged-In Users */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors relative"
                  aria-label="Recent activity"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-950"></span>
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl p-4 z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Bell className="w-4 h-4 text-indigo-500" /> Activity Stream
                        </h4>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">Real-time</span>
                      </div>

                      <div className="divide-y divide-gray-100 dark:divide-slate-800/60 mt-2 space-y-1">
                        {recentActivities.map((act) => (
                          <div key={act.id} className="pt-2.5 pb-2 text-left flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-xl transition-colors">
                            <div className="mt-0.5 p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                              {act.type === 'pending' ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{act.title}</p>
                              <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{act.desc}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap">{act.time}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800 text-center">
                        <Link 
                          to="/dashboard"
                          onClick={() => setNotificationsOpen(false)} 
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          View all event events →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle Color Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>

            {/* User Profile or Sign In / Sign Up */}
            {user ? (
              <ProfileMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white px-3 py-2 rounded-xl transition-colors hidden sm:inline-block"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 hidden sm:inline-block" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger for Public View */}
            {!user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 md:hidden transition-colors ml-1"
                aria-label="Open Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation for Logged Out or Global */}
      <AnimatePresence>
        {mobileMenuOpen && !user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4 shadow-2xl"
          >
            <div className="flex flex-col space-y-3">
              <Link
                to="/wedding-qrs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-indigo-600 dark:text-indigo-400 py-1 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Wedding QR Passes (4 Albums)</span>
              </Link>
              <Link
                to="/event/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-emerald-600 dark:text-emerald-400 py-1 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sample Live Gallery
              </Link>
              <Link
                to="/settings/support"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-gray-800 dark:text-slate-200 hover:text-indigo-500 py-1"
              >
                Help & Support
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-semibold rounded-xl border border-gray-300 dark:border-slate-700 text-gray-800 dark:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-semibold rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              >
                Create Free Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
