import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ADMIN_EMAILS = [
  'kusprince.raj@gmail.com',
  'pkskkumar900@gmail.com'
];

export interface LensDropUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
  isLocalSession?: boolean;
}

interface AuthContextType {
  user: User | LensDropUser | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<any>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, fullName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithDemo: (email?: string, role?: string, displayName?: string) => Promise<LensDropUser>;
  logout: () => Promise<void>;
  login: () => Promise<void>; // Keep for backward compatibility
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | LensDropUser | null>(() => {
    try {
      const savedSession = localStorage.getItem('lensdrop_session_token');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.email) {
          const emailLower = parsed.email.toLowerCase();
          const adminStatus = parsed.role === 'admin' || ADMIN_EMAILS.includes(emailLower);
          return {
            uid: parsed.uid || `user_${emailLower.replace(/[^a-zA-Z0-9]/g, '_')}`,
            email: parsed.email,
            displayName: parsed.displayName || (emailLower === 'kusprince.raj@gmail.com' ? 'Prince Raj' : parsed.email.split('@')[0]),
            photoURL: parsed.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsed.displayName || parsed.email)}&background=6366f1&color=fff&bold=true`,
            role: adminStatus ? 'admin' : 'user',
            isLocalSession: true
          };
        }
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const savedSession = localStorage.getItem('lensdrop_session_token');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.email) {
          return parsed.role === 'admin' || ADMIN_EMAILS.includes(parsed.email.toLowerCase());
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userEmail = currentUser.email?.toLowerCase() || '';
        const adminStatus = ADMIN_EMAILS.includes(userEmail);
        setIsAdmin(adminStatus);
        
        localStorage.setItem('lensdrop_session_token', JSON.stringify({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          role: adminStatus ? 'admin' : 'user'
        }));

        // Save user to Firestore (safe fail)
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              createdAt: serverTimestamp(),
              role: adminStatus ? 'admin' : 'user'
            });
          } else if (adminStatus && userSnap.data()?.role !== 'admin') {
            await setDoc(userRef, { role: 'admin' }, { merge: true });
          }
        } catch (error) {
          console.warn("Notice: Firestore user sync skipped or offline:", error);
        }
      } else {
        // Firebase has no active session. Check if we have an active local/demo session.
        try {
          const savedSession = localStorage.getItem('lensdrop_session_token');
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            if (parsed?.email) {
              const emailLower = parsed.email.toLowerCase();
              const adminStatus = parsed.role === 'admin' || ADMIN_EMAILS.includes(emailLower);
              setUser({
                uid: parsed.uid || `user_${emailLower.replace(/[^a-zA-Z0-9]/g, '_')}`,
                email: parsed.email,
                displayName: parsed.displayName || (emailLower === 'kusprince.raj@gmail.com' ? 'Prince Raj' : parsed.email.split('@')[0]),
                photoURL: parsed.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsed.displayName || parsed.email)}&background=6366f1&color=fff&bold=true`,
                role: adminStatus ? 'admin' : 'user',
                isLocalSession: true
              });
              setIsAdmin(adminStatus);
              setLoading(false);
              return;
            }
          }
        } catch {
          // ignore
        }
        setUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result;
    } catch (error: any) {
      if (error?.code === 'auth/unauthorized-domain' || error?.message?.includes('unauthorized-domain')) {
        console.warn('Firebase Google Auth Notice: The current domain is not yet authorized in Firebase Console settings. Please add it to Firebase Console > Authentication > Settings > Authorized domains, or use Email/Password or Demo Admin login.');
      } else {
        console.error('Error signing in with Google:', error);
      }
      throw error;
    }
  };

  const loginWithDemo = async (
    email = 'kusprince.raj@gmail.com', 
    role = 'admin', 
    displayName = 'Prince Raj'
  ): Promise<LensDropUser> => {
    const emailLower = email.toLowerCase().trim();
    const adminStatus = role === 'admin' || ADMIN_EMAILS.includes(emailLower);
    const demoUser: LensDropUser = {
      uid: `user_${emailLower.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: emailLower,
      displayName: displayName || (emailLower === 'kusprince.raj@gmail.com' ? 'Prince Raj' : emailLower.split('@')[0]),
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || emailLower)}&background=6366f1&color=fff&bold=true`,
      role: adminStatus ? 'admin' : 'user',
      isLocalSession: true
    };
    
    localStorage.setItem('lensdrop_session_token', JSON.stringify(demoUser));
    setUser(demoUser);
    setIsAdmin(adminStatus);
    
    // Attempt background sync to Firestore if possible
    try {
      const userRef = doc(db, 'users', demoUser.uid);
      await setDoc(userRef, {
        uid: demoUser.uid,
        email: demoUser.email,
        displayName: demoUser.displayName,
        photoURL: demoUser.photoURL,
        role: demoUser.role,
        lastLogin: serverTimestamp()
      }, { merge: true });
    } catch {
      // Safe fallback
    }

    return demoUser;
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      setUser(result.user);
    } catch (error) {
      console.error('Error signing in with Email:', error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string, fullName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (fullName && fullName.trim()) {
        try {
          await updateProfile(result.user, {
            displayName: fullName.trim()
          });
        } catch (profileErr) {
          console.warn('Could not set displayName on auth user:', profileErr);
        }
      }
      setUser(result.user);
    } catch (error) {
      console.error('Error signing up with Email:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('lensdrop_session_token');
      setUser(null);
      setIsAdmin(false);
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      isAdmin,
      loginWithGoogle, 
      loginWithEmail, 
      signupWithEmail,
      resetPassword,
      loginWithDemo,
      logout,
      login: loginWithGoogle 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
