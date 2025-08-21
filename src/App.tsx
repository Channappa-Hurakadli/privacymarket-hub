import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from './store';
import { loginSuccess } from './store/userSlice';
import { getUser } from './utils/auth';
import { RootState } from './store'; // Import RootState for ProtectedRoute

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import Subscription from './pages/Subscription'; // Import the new Subscription page

const queryClient = new QueryClient();

// Component to handle initial user loading
const UserInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      // Ensure subscription property exists
      const userWithSubscription = {
        ...storedUser,
        subscription: storedUser.subscription ?? { tier: "none", uploadCount: 0 }
      };
      dispatch(loginSuccess(userWithSubscription));
    }
  }, [dispatch]);

  return <>{children}</>;
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user);

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />; // Or a dedicated "Unauthorized" page
  }

  return <>{children}</>;
};


const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserInitializer>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute allowedRoles={['seller']}><Upload /></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute allowedRoles={['buyer']}><Marketplace /></ProtectedRoute>} />
                <Route path="/subscribe" element={<ProtectedRoute allowedRoles={['seller']}><Subscription /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </UserInitializer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
