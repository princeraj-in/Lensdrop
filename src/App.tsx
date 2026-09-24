import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Github, Linkedin, Instagram, MessageCircle, Mail, Menu, Camera } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { EventAdmin } from './pages/EventAdmin';
import { EventGallery } from './pages/EventGallery';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Settings Pages
import { ProfileSettings } from './pages/settings/ProfileSettings';
import { SecuritySettings } from './pages/settings/SecuritySettings';
import { AppearanceSettings } from './pages/settings/AppearanceSettings';
import { LegalSettings } from './pages/settings/LegalSettings';
import { SupportSettings } from './pages/settings/SupportSettings';

import { AdminSidebar } from './components/AdminSidebar';
import { WeddingShowcase } from './pages/WeddingShowcase';

import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';

function AppLayout() {
  const { user, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className={`min-h-screen ${isAdminRoute ? 'bg-slate-950 text-slate-50' : 'bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50'} font-sans selection:bg-indigo-500/30 selection:text-indigo-800 dark:selection:text-indigo-200 relative overflow-x-hidden transition-colors duration-300`}>
      <Toaster position="bottom-right" />
      {!isAdminRoute && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '11s' }} />
        </>
      )}
      
      {user && !isAdminRoute && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      {user && isAdminRoute && isAdmin && <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      
      <div className={`relative z-10 flex flex-col min-h-screen ${user && !isAdminRoute ? 'md:ml-64' : ''} ${user && isAdminRoute ? 'md:ml-72' : ''}`}>
        <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

        <main className={`flex-grow ${isAdminRoute ? 'max-w-[1600px]' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 md:pb-8 w-full`}>
          <Routes>
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/upload/:id" element={<EventAdmin />} />
            <Route path="/event/:id" element={<EventGallery />} />
            <Route path="/wedding-qrs" element={<WeddingShowcase />} />
            <Route path="/showcase" element={<WeddingShowcase />} />
            {/* Settings Routes */}
            <Route path="/settings/profile" element={<ProfileSettings />} />
            <Route path="/settings/security" element={<SecuritySettings />} />
            <Route path="/settings/appearance" element={<AppearanceSettings />} />
            <Route path="/settings/legal" element={<LegalSettings />} />
            <Route path="/settings/support" element={<SupportSettings />} />
            
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>
        
        <footer className="w-full py-8 text-center text-gray-500 dark:text-slate-400 border-t border-gray-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm mt-auto mb-20 md:mb-0">
          <div className="flex justify-center gap-6 mb-4">
            <a href="https://github.com/pkskkumar900-debug" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/prince-raj-ba4b973b3?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/princerjjjjj?igsh=MWhnMHp1c3UyM2cwdA==" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://wa.me/918252995548" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="WhatsApp">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="mailto:founder@imprince.me" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
          <p className="text-sm">Copyright &copy; {new Date().getFullYear()} LensDrop. Developed by Prince.</p>
        </footer>

        {/* Mobile Bottom Navigation Bar (< md) */}
        <BottomNav />
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
