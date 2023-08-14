import { Navigate, } from 'react-router-dom';
import { FC } from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;