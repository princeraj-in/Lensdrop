import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Home, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Plus, 
  HelpCircle, 
  ArrowRight,
  X,
  Calendar,
  Camera
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState<any[]>([]);

  // Load events for instant jumping
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      try {
        const stored = localStorage.getItem('lensdrop_events');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setEvents(parsed.slice(0, 5));
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  // Handle global keydown Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from Navbar state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (action: () => void) => {
    action();
    onClose();
  };

  const navCommands = [
    {
      id: 'dashboard',
      title: 'Home Dashboard',
      subtitle: 'Overview of all active wedding galleries & uploads',
      icon: Home,
      action: () => navigate('/dashboard')
    },
    {
      id: 'wedding-qrs',
      title: 'Wedding QR Passes',
      subtitle: 'Scan or generate event passes for wedding guests',
      icon: Sparkles,
      action: () => navigate('/wedding-qrs')
    },
    {
      id: 'profile',
      title: 'Profile & Account Settings',
      subtitle: 'Manage your name, avatar, password & security',
      icon: User,
      action: () => navigate('/settings/profile')
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Contact founder directly via WhatsApp or Email',
      icon: HelpCircle,
      action: () => navigate('/settings/support')
    },
    ...(isAdmin ? [{
      id: 'admin',
      title: 'Super Admin Console',
      subtitle: 'User directory, system events & platform settings',
      icon: ShieldCheck,
      action: () => navigate('/admin/dashboard')
    }] : [])
  ];

  const actionCommands = [
    {
      id: 'toggle-theme',
      title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: `Currently in ${theme} mode`,
      icon: theme === 'dark' ? Sun : Moon,
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark')
    },
    {
      id: 'create-event',
      title: 'Create New Wedding Event',
      subtitle: 'Launch a new photo stream in 30 seconds',
      icon: Plus,
      action: () => {
        navigate('/dashboard');
        setTimeout(() => {
          const input = document.getElementById('newEventInput');
          if (input) {
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    }
  ];

  const filteredNav = navCommands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = events.filter(e => 
    e.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="relative flex items-center px-4 border-b border-gray-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-gray-400 dark:text-slate-500 shrink-0 ml-1" />
            <input 
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, page, or search event..."
              className="w-full px-3 py-4 text-sm sm:text-base bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700">
                ESC
              </kbd>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Quick Navigation Section */}
            {filteredNav.length > 0 && (
              <div>
                <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                  Navigation & Pages
                </p>
                <div className="space-y-1">
                  {filteredNav.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.action)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-left transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <cmd.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {cmd.title}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                            {cmd.subtitle}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Event Jump */}
            {filteredEvents.length > 0 && (
              <div>
                <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                  Active Event Streams
                </p>
                <div className="space-y-1">
                  {filteredEvents.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => handleSelect(() => navigate(`/event/${evt.id}`))}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-500/10 text-left transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {evt.title}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-slate-400">
                            {evt.images?.length || 0} photos uploaded
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20 px-2 py-0.5 rounded-md">
                        Open Stream
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Actions & Customization
              </p>
              <div className="space-y-1">
                {actionCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.action)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <cmd.icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {cmd.title}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400">
                          {cmd.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer status bar */}
          <div className="p-3 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-500 px-4">
            <span>Pro Tip: Press <kbd className="font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700">Cmd + K</kbd> anywhere to launch</span>
            <span className="font-semibold text-indigo-500">LensDrop Studio</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
