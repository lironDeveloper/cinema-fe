import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
    const { user } = useAuth();


    return (
        <div>home</div>
    );
};

export default Home;
