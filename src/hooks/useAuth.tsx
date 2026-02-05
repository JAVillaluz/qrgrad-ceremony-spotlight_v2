import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as localAuth from '@/lib/localAuth';

// Local user interface (compatible with Supabase User type)
interface User {
  id: string;
  email: string;
}

// Local session interface (compatible with Supabase Session type)
interface Session {
  user: User;
  access_token: string;
  expires_at: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminRole = (userId: string) => {
    return localAuth.isUserAdmin(userId);
  };

  useEffect(() => {
    // Set up auth state listener
    const subscription = localAuth.onAuthStateChange((localSession) => {
      setSession(localSession as Session | null);
      setUser(localSession?.user ?? null);

      if (localSession?.user) {
        const adminStatus = checkAdminRole(localSession.user.id);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { session: newSession, error } = await localAuth.signIn(email, password);
    
    if (newSession) {
      setSession(newSession as Session);
      setUser(newSession.user);
      setIsAdmin(checkAdminRole(newSession.user.id));
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { session: newSession, error } = await localAuth.signUp(email, password);
    
    if (newSession) {
      setSession(newSession as Session);
      setUser(newSession.user);
      setIsAdmin(checkAdminRole(newSession.user.id));
    }
    
    return { error };
  };

  const signOut = async () => {
    await localAuth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
