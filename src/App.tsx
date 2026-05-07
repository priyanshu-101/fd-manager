import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { FDPage } from '@/pages/FDPage';
import { InsurancePage } from '@/pages/InsurancePage';
import { LoginPage } from '@/pages/LoginPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';

export default function App() {
  const hydrate = useStore((s) => s.hydrate);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    void hydrate();
    void checkAuth();
  }, [hydrate, checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/fd" element={<FDPage />} />
                  <Route path="/insurance" element={<InsurancePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
