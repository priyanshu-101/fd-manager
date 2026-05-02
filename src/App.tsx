import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { FDPage } from '@/pages/FDPage';
import { InsurancePage } from '@/pages/InsurancePage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/fd" element={<FDPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
