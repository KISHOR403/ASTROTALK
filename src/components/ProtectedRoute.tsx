import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: string[];
    allowedStatus?: string[];
}

const ProtectedRoute = ({ allowedRoles, allowedStatus }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const effectiveStatus = user.status || (user.role === 'astrologer' ? 'pending' : 'active');

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    if (allowedStatus && !allowedStatus.includes(effectiveStatus)) {
        if (user.role === 'astrologer' && effectiveStatus === 'pending') {
            return <Navigate to="/astrologer/onboarding" replace />;
        }
        return <Navigate to="/" replace />;
    }


    return <Outlet />;
};

export default ProtectedRoute;

