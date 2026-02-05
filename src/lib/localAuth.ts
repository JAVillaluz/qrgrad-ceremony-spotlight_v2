// Local Authentication System - Offline Alternative to Supabase
// This provides a complete authentication system using localStorage

export interface LocalUser {
  id: string;
  email: string;
  password: string; // In real production, this should be hashed
  created_at: string;
}

export interface LocalUserRole {
  user_id: string;
  role: 'admin' | 'user';
}

export interface LocalSession {
  user: {
    id: string;
    email: string;
  };
  access_token: string;
  expires_at: number;
}

const STORAGE_KEYS = {
  USERS: 'qrgrad_users',
  ROLES: 'qrgrad_user_roles',
  SESSION: 'qrgrad_session',
};

// Initialize default admin account
const initializeDefaultAdmin = () => {
  const users = getUsers();
  const roles = getRoles();
  
  // Create default admin if no users exist
  if (users.length === 0) {
    const adminId = 'admin-' + Date.now();
    const defaultAdmin: LocalUser = {
      id: adminId,
      email: 'admin@local.com',
      password: 'admin123', // Default password
      created_at: new Date().toISOString(),
    };
    
    users.push(defaultAdmin);
    roles.push({
      user_id: adminId,
      role: 'admin',
    });
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
    
    console.log('Default admin account created: admin@local.com / admin123');
  }
};

// Get all users from localStorage
const getUsers = (): LocalUser[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  return stored ? JSON.parse(stored) : [];
};

// Get all roles from localStorage
const getRoles = (): LocalUserRole[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ROLES);
  return stored ? JSON.parse(stored) : [];
};

// Get current session
export const getSession = (): LocalSession | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!stored) return null;
  
  const session: LocalSession = JSON.parse(stored);
  
  // Check if session is expired
  if (session.expires_at < Date.now()) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return null;
  }
  
  return session;
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<{ session: LocalSession | null; error: Error | null }> => {
  initializeDefaultAdmin();
  
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return {
      session: null,
      error: new Error('Invalid email or password'),
    };
  }
  
  // Create session (expires in 7 days)
  const session: LocalSession = {
    user: {
      id: user.id,
      email: user.email,
    },
    access_token: 'local-token-' + Date.now(),
    expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000),
  };
  
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  
  return { session, error: null };
};

// Sign up with email and password
export const signUp = async (email: string, password: string): Promise<{ session: LocalSession | null; error: Error | null }> => {
  initializeDefaultAdmin();
  
  const users = getUsers();
  const roles = getRoles();
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return {
      session: null,
      error: new Error('Email already exists'),
    };
  }
  
  // Create new user
  const userId = 'user-' + Date.now();
  const newUser: LocalUser = {
    id: userId,
    email,
    password,
    created_at: new Date().toISOString(),
  };
  
  users.push(newUser);
  
  // First user after default admin becomes user, not admin
  roles.push({
    user_id: userId,
    role: 'user',
  });
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
  
  // Auto sign in after signup
  return signIn(email, password);
};

// Sign out
export const signOut = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

// Check if user is admin
export const isUserAdmin = (userId: string): boolean => {
  const roles = getRoles();
  return roles.some(r => r.user_id === userId && r.role === 'admin');
};

// Auth state change listener (simulated)
export type AuthChangeCallback = (session: LocalSession | null) => void;

const authListeners: AuthChangeCallback[] = [];

export const onAuthStateChange = (callback: AuthChangeCallback) => {
  authListeners.push(callback);
  
  // Immediately call with current session
  callback(getSession());
  
  return {
    unsubscribe: () => {
      const index = authListeners.indexOf(callback);
      if (index > -1) {
        authListeners.splice(index, 1);
      }
    },
  };
};

// Notify all listeners of auth state change
const notifyAuthChange = (session: LocalSession | null) => {
  authListeners.forEach(callback => callback(session));
};

// Initialize on module load
initializeDefaultAdmin();
