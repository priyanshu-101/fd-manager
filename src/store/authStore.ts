import { create } from 'zustand';
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { name: string; email: string }) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
  clearError: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API helper function
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('authToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        `Server returned non-JSON response: ${response.status} ${response.statusText}. Check if API is running at ${API_URL}`
      );
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid API response. Make sure the backend is running and VITE_API_URL is correct.');
    }
    throw error;
  }
}

// Convert backend user format to frontend User type
const formatUser = (backendUser: any): User => ({
  id: backendUser._id,
  email: backendUser.email,
  name: backendUser.name,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.email}`,
});

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest<any>('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const user = formatUser(response.user);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signup: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await apiRequest<any>('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const user = formatUser(response.user);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        await apiRequest('/api/users/logout', {
          method: 'POST',
        });
      }

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (err) {
      // Still clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        // Verify token with backend
        const response = await apiRequest<any>('/api/users/profile', {
          method: 'GET',
        });

        const user = formatUser(response);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest<any>('/api/users/edit', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      const updatedUser = formatUser(response.user);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  changePassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest<any>('/api/users/change-password', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      set({ isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password change failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
