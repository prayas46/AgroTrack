
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/client"; // Use client-side instances

type UserProfile = {
  role: "Farmer" | "Agronomist" | "Admin";
  // Add other profile fields as needed
};

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          setUserProfile(null); 
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, isUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

    