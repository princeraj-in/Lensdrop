import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  Shield, 
  Palette, 
  FileText, 
  HelpCircle,
  LogOut,
  Camera,
  X,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Wedding QR Passes', path: '/wedding-qrs', icon: Sparkles },
    { name: 'Profile & Account', path: '/settings/profile', icon: Settings },
    { name: 'Appearance', path: '/settings/appearance', icon: Palette },
    { name: 'Legal & Privacy', path: '/settings/legal', icon: FileText },
    { name: 'Help & Support', path: '/settings/support', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside 
        className={`fixed left-0 top-0 h-screen w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-r border-gray-200/80 dark:border-white/[0.07] flex flex-col z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="h-16 sm:h-20 px-6 border-b border-gray-200/80 dark:border-white/[0.07] flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5 group focus:outline-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Camera className="w-4.5 h-4.5 text-indigo-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white leading-none">
                Lens<span className="text-indigo-500">Drop</span>
              </span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium tracking-wide mt-0.5">
                Host Workspace
              </span>
            </div>
          </Link>
          <button 
            onClick={onClose} 
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-gray-50/80 dark:bg-slate-900/40 border border-gray-200/60 dark:border-white/[0.05]">
          <div className="flex items-center gap-3">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'Host')}&background=6366f1&color=fff`} 
              alt="Profile" 
              className="w-10 h-10 rounded-xl border border-gray-200 dark:border-slate-700 object-cover shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {user.displayName || 'Host Studio'}
                </p>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate mt-0.5">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div className="px-3 pt-2 pb-1">
          <p className="px-3 text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            Workspace
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' 
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 dark:text-slate-500 group-hover:text-indigo-500'
                  }`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </Link>
            );
          })}

          {/* Super Admin Quick Jump if admin */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-200/80 dark:border-white/[0.07]">
              <div className="px-3 pb-1.5">
                <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">
                  Governance
                </p>
              </div>
              <Link
                to="/admin/dashboard"
                onClick={onClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Super Admin Console</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500/80" />
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-200/80 dark:border-white/[0.07] space-y-2">
          <Link
            to="/event/demo"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              Sample Guest View
            </span>
            <span className="text-[10px] text-emerald-500 font-bold">LIVE</span>
          </Link>

          <button 
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
