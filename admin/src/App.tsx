import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ZoneMapPage from './pages/zone-map/ZoneMapPage';
import ResourceAllocationPage from './pages/resource-allocation/ResourceAllocationPage';
import HighPriorityPage from './pages/high-priority/HighPriorityPage';
import InsightsPage from './pages/insights/InsightsPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected routes with role-based access */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Analyst role routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'analyst']} />}>
            <Route path="insights" element={<InsightsPage />} />
          </Route>
          
          {/* Planner role routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'planner']} />}>
            <Route path="high-priority" element={<HighPriorityPage />} />
            <Route path="resource-allocation" element={<ResourceAllocationPage />} />
          </Route>
          
          {/* All roles can access the map */}
          <Route element={<ProtectedRoute />}>
            <Route path="zone-map" element={<ZoneMapPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;