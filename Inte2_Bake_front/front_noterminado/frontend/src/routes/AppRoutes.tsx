import { Routes, Route, Navigate } from 'react-router-dom';
import AboutPage from '../pages/AboutPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminDashboard from '../pages/AdminDashboard';
import HomePage from '../pages/HomePage';
import SensorsPage from '../pages/SensorsPage';
import SunPage from '../pages/SunPage';
import TemperaturePage from '../pages/TemperaturePage';
import WindPage from '../pages/WindPage';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/radiacion" element={<SunPage />} />
      <Route path="/temperatura" element={<TemperaturePage />} />
      <Route path="/Viento" element={<WindPage />} />

      {!isLoggedIn && <Route path="/login" element={<AdminLoginPage />} />}

      {isLoggedIn ? (
        <>
          <Route path="/sensores" element={<SensorsPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </>
      ) : (
        <>
          <Route path="/sensores" element={<Navigate to="/login" replace />} />
          <Route path="/admin-dashboard" element={<Navigate to="/login" replace />} />
        </>
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
