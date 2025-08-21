import api from '../services/api';

// --- TYPE DEFINITIONS ---

// Raw user data from the backend API
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  password?: string; // Optional for API responses
  role: 'seller' | 'buyer';
  token: string;
}

// User object used throughout the frontend (in Redux, localStorage)
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'seller' | 'buyer';
  token: string;
  joinedDate: string;
}

// Data sent during registration
type RegisterData = Omit<ApiUser, '_id' | 'token'>;

// Data sent during login
type LoginData = Pick<RegisterData, 'email' | 'password'>;


// --- API FUNCTIONS ---

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


// --- LOCAL STORAGE FUNCTIONS ---

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
