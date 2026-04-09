import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useProfiles } from "./hooks/useProfiles";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { ProfileSelectPage } from "./pages/ProfileSelectPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-2xl">🌿 Loading...</span>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppWithAuth() {
  useProfiles();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profiles" element={<ProtectedRoute><ProfileSelectPage /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWithAuth />
    </BrowserRouter>
  );
}
