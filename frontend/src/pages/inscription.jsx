import React, { useState } from 'react';
import Navbar from "../components/nav";
import Footer from "../components/footer";
import "../output.css";

const Inscription = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            setErrorMessage(
                "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial."
            );
            return;
        }

        if (password !== passwordVerify) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        const userData = {
            name: name,
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Inscription réussie !');
                setErrorMessage('');
            } else {
                if (data.message === "Cet utilisateur existe déjà.") {
                    setErrorMessage("Cet email est déjà utilisé. Veuillez en choisir un autre.");
                } else {
                    setErrorMessage(data.message || "Erreur d'inscription.");
                }
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage("Erreur lors de l'envoi des données.");
            console.log(error);
            setSuccessMessage('');
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen">
            <Navbar />
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <form
                    onSubmit={handleSubmit}
                    className="border shadow-md p-4 bg-white rounded-md w-1/3"
                >
                    <h2 className="text-center font-bold">Inscription</h2>
                    <div>
                        <label htmlFor="name">Pseudo :</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="border shadow-sm p-2 rounded-md w-full outline-none"
                        />
                    </div>
                    <div className="mt-5">
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border shadow-sm p-2 rounded-md w-full outline-none"
                        />
                    </div>
                    <div className="mt-5">
                        <label htmlFor="password">Mot de Passe :</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border shadow-sm p-2 rounded-md w-full outline-none"
                        />
                    </div>
                    <div className="mt-5">
                        <label htmlFor="password_verify">Confirmation :</label>
                        <input
                            type="password"
                            name="password_verify"
                            id="password_verify"
                            value={passwordVerify}
                            onChange={(e) => setPasswordVerify(e.target.value)}
                            required
                            className="border shadow-sm p-2 rounded-md w-full outline-none"
                        />
                    </div>
                    {errorMessage && (
                        <div id="message-inscription" className="text-red-500 mt-3">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div id="message-success" className="text-green-500 mt-3">
                            {successMessage}
                        </div>
                    )}
                    <div className="mt-5">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 px-4 rounded-md shadow-md w-full hover:bg-blue-600 hover:duration-300"
                        >
                            S'inscrire
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Inscription;
