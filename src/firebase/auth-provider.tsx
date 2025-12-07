
'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Auth,
  User,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { setDocumentNonBlocking } from './non-blocking-updates';

// Define the shape of the user profile data
type UserProfile = {
  role: 'Farmer' | 'Agronomist' | 'Admin';
  // Add other profile fields as needed, e.g., location, expertise
};

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Effect to listen for auth state changes
  useEffect(() => {
    if (!auth) {
      setIsUserLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          // This could happen if Firestore data creation fails during signup
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  // Login function
  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized.');

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;

    // Update the user's profile display name
    await updateProfile(firebaseUser, { displayName: name });
    
    // Create the user profile document in Firestore
    const userDocRef = doc(firestore, 'users', firebaseUser.uid);
    const newUserProfile = {
      uid: firebaseUser.uid,
      displayName: name,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      role: 'Farmer', // Default role for new users
      createdAt: serverTimestamp(),
    };
    
    // Using non-blocking set to avoid awaiting here and let UI update faster
    setDocumentNonBlocking(userDocRef, newUserProfile, { merge: true });

    // Manually update local state to reflect the new user immediately
    setUser(firebaseUser);
    setUserProfile({ role: 'Farmer' });
  };

  // Logout function
  const logout = async () => {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    await signOut(auth);
  };

  const value = {
    user,
    userProfile,
    isUserLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
