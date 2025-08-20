import { User } from '../store/userSlice';

// Mock authentication utility - API-ready structure
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role: 'Seller' | 'Buyer';
}

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'seller@example.com',
    name: 'John Seller',
    role: 'Seller',
    joinedDate: '2024-01-15'
  },
  {
    id: '2',
    email: 'buyer@example.com',
    name: 'Jane Buyer',
    role: 'Buyer',
    joinedDate: '2024-02-20'
  }
];

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === credentials.email);
  if (!user) {
    throw new Error('User not found');
  }
  
  // In real implementation, validate password hash
  return user;
};

export const registerUser = async (credentials: RegisterCredentials): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === credentials.email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    email: credentials.email,
    name: credentials.name,
    role: credentials.role,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  
  mockUsers.push(newUser);
  return newUser;
};

export const validateToken = (token: string): boolean => {
  // Mock token validation
  return token && token.length > 0;
};

export const getStoredUser = (): User | null => {
  const userData = localStorage.getItem('marketsafe_user');
  return userData ? JSON.parse(userData) : null;
};

export const storeUser = (user: User): void => {
  localStorage.setItem('marketsafe_user', JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  localStorage.removeItem('marketsafe_user');
};