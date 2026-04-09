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
            const response = await fetch('/api/users', {
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
        <div className="pokemon-page">
            <Navbar />
            <div className="relative z-10 flex justify-center items-center min-h-[80vh] px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8"
                >
                    <h2 className="text-center font-bold pokemon-title text-3xl text-slate-900">Inscription</h2>
                    <p className="text-center text-sm text-slate-500 mt-1">Crée ton profil dresseur en quelques secondes</p>
                    <div>
                        <label htmlFor="name" className="text-sm font-semibold text-slate-700">Pseudo :</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 border border-slate-200 shadow-sm p-2.5 rounded-xl w-full outline-none focus:border-secondary"
                        />
                    </div>
                    <div className="mt-5">
                        <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email :</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 border border-slate-200 shadow-sm p-2.5 rounded-xl w-full outline-none focus:border-secondary"
                        />
                    </div>
                    <div className="mt-5">
                        <label htmlFor="password" className="text-sm font-semibold text-slate-700">Mot de Passe :</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 border border-slate-200 shadow-sm p-2.5 rounded-xl w-full outline-none focus:border-secondary"
                        />
                    </div>
                    <div className="mt-5">
                        <label htmlFor="password_verify" className="text-sm font-semibold text-slate-700">Confirmation :</label>
                        <input
                            type="password"
                            name="password_verify"
                            id="password_verify"
                            value={passwordVerify}
                            onChange={(e) => setPasswordVerify(e.target.value)}
                            required
                            className="mt-1 border border-slate-200 shadow-sm p-2.5 rounded-xl w-full outline-none focus:border-secondary"
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
                            className="bg-secondary text-white p-2.5 px-4 rounded-xl shadow-md w-full hover:brightness-110 transition"
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
