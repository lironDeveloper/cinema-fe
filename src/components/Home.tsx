import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Welcome, {user.fullName}!</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
        </div>
    );
};

export default Home;
