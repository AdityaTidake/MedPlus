import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import PharmacyDashboard from './pages/dashboards/PharmacyDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor"
                    element={
                        <ProtectedRoute allowedRoles={['doctor']}>
                            <DoctorDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pharmacy"
                    element={
                        <ProtectedRoute allowedRoles={['pharmacist']}>
                            <PharmacyDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
