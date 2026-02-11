import { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user has admin claim
        const token = await user.getIdTokenResult();
        setIsAdmin(!!token.claims.admin);
        setUser(user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdTokenResult();
      
      if (!token.claims.admin) {
        await signOut(auth);
        throw new Error('Access denied. Admin privileges required.');
      }
      
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, isAdmin, login, logout };
};
