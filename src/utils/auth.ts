import api from '../services/api';
import { Subscription } from '../store/userSlice'; // Import the Subscription type

// Interface for the raw user data returned from the backend API
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: 'seller' | 'buyer';
  token: string;
  password: string;
  subscription: Subscription; // Ensure subscription is expected from the API
}

// Interface for the user object as it's used throughout the frontend
// This is the shape that will be stored in Redux and localStorage
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'seller' | 'buyer';
  token: string;
  joinedDate: string;
  subscription: Subscription; // Ensure subscription is part of the app's user model
}

// Type for the data sent during registration
type RegisterData = Omit<ApiUser, '_id' | 'token' | 'subscription'>;

// Type for the data sent during login
type LoginData = {
  email: string;
  password: string;
};


/**
 * Registers a new user.
 */
export const registerUser = async (userData: RegisterData): Promise<ApiUser> => {
  try {
    const response = await api.post<ApiUser>('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'An unexpected error occurred during registration.';
    throw new Error(message);
  }
};

/**
 * Logs in an existing user.
 */
export const loginUser = async (credentials: LoginData): Promise<ApiUser> => {
  try {
    const response = await api.post<ApiUser>('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
    throw new Error(message);
  }
};


/**
 * Stores the user object in localStorage.
 */
export const storeUser = (user: AppUser) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Retrieves the user object from localStorage.
 */
export const getUser = (): AppUser | null => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

/**
 * Removes the user object from localStorage.
 */
export const removeUser = () => {
  localStorage.removeItem('user');
};
