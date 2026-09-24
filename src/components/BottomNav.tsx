import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  Plus, 
  Settings, 
  Sparkles, 
  Users, 
  Calendar, 
  ShieldCheck, 
  UploadCloud, 
  LogIn, 
  UserPlus, 
  Home, 
  Layers,
  QrCode
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export function BottomNav() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isEventGallery = location.pathname.startsWith('/event/');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboard = location.pathname === '/dashboard';
  const isSettings = location.pathname.startsWith('/settings/');

  const handleCenterAction = () => {
    if (isEventGallery) {
      // Trigger guest upload modal in gallery
      window.dispatchEvent(new CustomEvent('open-guest-upload'));
    } else if (user) {
      // In host app: navigate to dashboard and focus the create input
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
    } else {
      // Public: jump to demo
      navigate('/event/demo');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="mx-auto px-3 pb-2 pt-1.5">
        <div className="relative flex items-center justify-around h-16 rounded-2xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border border-gray-200/90 dark:border-white/[0.08] shadow-[0_-8px_32px_rgba(0,0,0,0.15)] px-2">

          {/* ADMIN ROUTE NAVIGATION */}
          {user && isAdminRoute && (
            <>
              <Link
                to="/admin/dashboard"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  location.pathname === '/admin/dashboard'
                    ? 'text-emerald-500 font-bold'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Overview</span>
              </Link>

              <Link
                to="/admin/users"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  location.pathname === '/admin/users'
                    ? 'text-emerald-500 font-bold'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                <Users className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Users</span>
              </Link>

              <Link
                to="/admin/events"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  location.pathname === '/admin/events'
                    ? 'text-emerald-500 font-bold'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                <Calendar className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Events</span>
              </Link>

              <Link
                to="/admin/settings"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  location.pathname === '/admin/settings'
                    ? 'text-emerald-500 font-bold'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                <Settings className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Settings</span>
              </Link>

              <Link
                to="/dashboard"
                className="flex flex-col items-center justify-center flex-1 py-1 text-gray-400 dark:text-slate-500 hover:text-indigo-500"
              >
                <Sparkles className="w-5 h-5 mb-0.5 text-indigo-400" />
                <span className="text-[10px]">Host App</span>
              </Link>
            </>
          )}

          {/* GUEST VIEW ON EVENT GALLERY */}
          {!isAdminRoute && isEventGallery && (
            <>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex flex-col items-center justify-center flex-1 py-1 text-indigo-600 dark:text-indigo-400 font-bold"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Gallery</span>
              </button>

              {/* Elevated Center Action: Drop Photos */}
              <div className="relative -top-4 flex items-center justify-center flex-1">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleCenterAction}
                  className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 border-2 border-white dark:border-slate-900 flex flex-col items-center justify-center active:brightness-110"
                  aria-label="Upload Photos"
                >
                  <UploadCloud className="w-6 h-6" />
                </motion.button>
              </div>

              <Link
                to="/signup"
                className="flex flex-col items-center justify-center flex-1 py-1 text-gray-400 dark:text-slate-500 hover:text-gray-800 dark:hover:text-white"
              >
                <Sparkles className="w-5 h-5 mb-0.5 text-purple-400" />
                <span className="text-[10px]">Host Free</span>
              </Link>
            </>
          )}

          {/* AUTHENTICATED HOST VIEW */}
          {user && !isAdminRoute && !isEventGallery && (
            <>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  isDashboard
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Dashboard</span>
              </Link>

              {/* Wedding QR Passes */}
              <Link
                to="/wedding-qrs"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  location.pathname === '/wedding-qrs'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                <QrCode className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">QR Passes</span>
              </Link>

              {/* Elevated Center Action: Create Event */}
              <div className="relative -top-4 flex items-center justify-center flex-1">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleCenterAction}
                  className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl shadow-indigo-500/40 border-2 border-white dark:border-slate-900 flex items-center justify-center active:brightness-110"
                  aria-label="New Event"
                  title="Create New Event"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </motion.button>
              </div>

              {/* Admin Jump (if admin) or Security */}
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="flex flex-col items-center justify-center flex-1 py-1 text-emerald-500"
                >
                  <ShieldCheck className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">Admin</span>
                </Link>
              ) : (
                <Link
                  to="/settings/security"
                  className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                    location.pathname === '/settings/security'
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Sparkles className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">Security</span>
                </Link>
              )}

              {/* Settings */}
              <Link
                to="/settings/profile"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  isSettings
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                <Settings className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Settings</span>
              </Link>
            </>
          )}

          {/* PUBLIC VISITOR VIEW (LOGGED OUT) */}
          {!user && !isEventGallery && (
            <>
              <Link
                to="/login"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  location.pathname === '/login'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-400 dark:text-slate-500'
                }`}
              >
                <LogIn className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Sign In</span>
              </Link>

              <Link
                to="/wedding-qrs"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  location.pathname === '/wedding-qrs'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-400 dark:text-slate-500'
                }`}
              >
                <QrCode className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">QR Passes</span>
              </Link>

              {/* Elevated Center Action: Live Demo */}
              <div className="relative -top-4 flex items-center justify-center flex-1">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleCenterAction}
                  className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl shadow-indigo-500/40 border-2 border-white dark:border-slate-900 flex items-center justify-center active:brightness-110"
                  aria-label="Try Live Demo"
                >
                  <Camera className="w-6 h-6 stroke-[2.5]" />
                </motion.button>
              </div>

              <Link
                to="/signup"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  location.pathname === '/signup'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-400 dark:text-slate-500'
                }`}
              >
                <UserPlus className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Register</span>
              </Link>

              <Link
                to="/settings/support"
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  location.pathname === '/settings/support'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-400 dark:text-slate-500'
                }`}
              >
                <Sparkles className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Help</span>
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
