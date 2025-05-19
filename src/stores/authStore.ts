import { create } from 'zustand';

interface User {
  _id: string;
  fullName: string;
  email: string;
  image: string;
  role: string;
  coverImage: string;
  isOnline: boolean;
  followers: Follow[];
  following: Follow[];
  messages?: Message[];
}

interface AuthStore {
  isLoggedIn: boolean;
  isLoading: boolean;
  accessToken: string | null;
  user: User | null;
  login: (accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const storeToken = sessionStorage.getItem('token');

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  accessToken: storeToken,
  user: null,
  isLoading: true,

  login: (accessToken) => {
    sessionStorage.setItem('token', accessToken);
    set({ accessToken, isLoggedIn: true });
  },

  logout: () => {
    sessionStorage.removeItem('token');
    set({ accessToken: null, isLoggedIn: false, user: null, isLoading: false });
  },

  setUser: (userData) => {
    const user = {
      _id: userData._id,
      fullName: userData.fullName,
      coverImage: userData.coverImage,
      email: userData.email,
      image: userData.image,
      role: userData.role,
      isOnline: true,
      followers: userData.followers,
      following: userData.following,
      messages: userData.messages,
    };
    set({ user, isLoading: false, isLoggedIn: true });
  },
}));
