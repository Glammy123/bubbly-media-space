
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/hooks/useAuth';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Create from '@/pages/Create';
import NotFound from '@/pages/NotFound';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create" element={
            <RequireAuth>
              <Create />
            </RequireAuth>
          } />
          <Route path="/:username" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
};

// Protected route component
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default App;
