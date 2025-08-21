import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the User's subscription
export interface Subscription {
  tier: 'none' | 'basic' | 'pro' | 'enterprise';
  uploadCount: number;
}

// Define the shape of the User object for the Redux state
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'seller' | 'buyer';
  token: string;
  joinedDate: string;
  subscription: Subscription; // Ensure subscription is part of the user type
}

// Define the shape of the initial state
interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    loginFailure(state) {
      state.isLoading = false;
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    updateProfile(state, action: PayloadAction<{ name: string; email: string }>) {
      if (state.currentUser) {
        state.currentUser.name = action.payload.name;
        state.currentUser.email = action.payload.email;
      }
    },
    updateSubscription(state, action: PayloadAction<Subscription>) {
        if (state.currentUser) {
            state.currentUser.subscription = action.payload;
        }
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile, updateSubscription } = userSlice.actions;
export default userSlice.reducer;
