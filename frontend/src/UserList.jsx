import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les utilisateurs depuis l'API Symfony
    useEffect(() => {
        axios.get('http://localhost:8000/api/users')
            .then((response) => {
                setUsers(response.data); // Stocker les données dans l'état
                setLoading(false); // Désactiver le chargement
            })
            .catch((error) => {
                setError(error); // Gérer les erreurs
                setLoading(false);
            });
    }, []);

    // Si les données sont en train de se charger
    if (loading) {
        return <div>Loading...</div>;
    }

    // Si une erreur se produit
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Affichage des utilisateurs
    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <strong>{user.name}</strong> - {user.email} (Created At: {user.createdAt})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
