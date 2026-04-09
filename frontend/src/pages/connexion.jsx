import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/nav";
import Footer from "../components/footer";
import "../output.css";
import axios from 'axios';

function ConnexionForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      const token = response.data.token;
      const userData = response.data.user;
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      setErrorMessage('');

    
      navigate('/');
    } catch (error) {
      
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Une erreur est survenue.');
      }
    }
  };

 
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      sessionStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Erreur de déconnexion', error);
    }
  };

  return (
    <div className="pokemon-page">
      <Navbar />
      <div className="relative z-10 flex justify-center items-center min-h-[80vh] px-4 py-8">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md glass-panel rounded-3xl p-6 md:p-8"
        >
          <h2 className="text-center font-bold pokemon-title text-3xl text-slate-900">Connexion</h2>
          <p className="text-center text-sm text-slate-500 mt-1">Reprends ta progression de dresseur</p>

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

          {errorMessage && (
            <div id="message-connexion" className="text-red-500 mt-3">
              {errorMessage}
            </div>
          )}

          {!user ? (
            <div className="mt-5">
              <button
                type="submit"
                className="bg-secondary text-white p-2.5 px-4 rounded-xl shadow-md w-full hover:brightness-110 transition"
              >
                Se connecter
              </button>
            </div>
          ) : (
            <div>
              <p>Bienvenue, {user.name} !</p>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500 text-white p-2 px-4 rounded-xl shadow-md w-full hover:bg-red-600 hover:duration-300"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ConnexionForm;
