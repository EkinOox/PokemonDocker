import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            localStorage.removeItem('user');
            sessionStorage.clear();
            navigate('/connexion');
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p>Déconnexion en cours...</p>
        </div>
    );
};

export default Logout;
