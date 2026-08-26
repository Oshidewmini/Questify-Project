import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import { createUserProfile, getUserProfile, updateUserProfile } from '../data/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const skipProfileFetch = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
      } else if (!skipProfileFetch.current) {
        const nextProfile = await getUserProfile(nextUser.uid);
        setProfile(nextProfile);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password, { name, jobTitle, department }) => {
    skipProfileFetch.current = true;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const nextProfile = await createUserProfile(cred.user.uid, {
        name,
        email,
        jobTitle,
        department,
      });
      setProfile(nextProfile);
      return cred;
    } finally {
      skipProfileFetch.current = false;
    }
  };

  const updateProfile = async (fields) => {
    if (!auth.currentUser) {
      throw new Error('You must be signed in to update your profile.');
    }
    const nextProfile = await updateUserProfile(auth.currentUser.uid, {
      ...fields,
      email: auth.currentUser.email,
    });
    setProfile(nextProfile);
    return nextProfile;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, signup, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
