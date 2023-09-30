import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notify from '../utils/ErrorToast';
import User from '../interfaces/User';

// interface User {
//     id: number;
//     fullName: string;
//     email: string;
//     role: string;
//     createdOn: string;
// }

interface AuthContextProps {
    user: User | null;
    token: string | null;
    login: (newToken: string) => void;
    logout: () => void;
}



const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = window.localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState<string | null>(window.localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        window.localStorage.setItem('user', JSON.stringify(user));
    }, [user])

    const login = async (newToken: string) => {
        setToken(newToken);
        window.localStorage.setItem('token', newToken);

        try {
            const response = await fetch('http://localhost:8080/api/user/me', {
                headers: {
                    'Authorization': `Bearer ${newToken}`
                },
                credentials: 'include'
            });
            let data = await response.json();

            if (response.ok) {
                setUser({ ...data });
                navigate('/');
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');

        navigate('/signin');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
