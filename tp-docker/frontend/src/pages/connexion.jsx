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
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      const userData = response.data.user;
      sessionStorage.setItem('user', JSON.stringify(userData));
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
      await axios.post('http://localhost:8000/api/logout');
      sessionStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Erreur de déconnexion', error);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="border shadow-md p-4 bg-white rounded-md ml-5"
        >
          <h2 className="text-center font-bold">Connexion</h2>

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

          {errorMessage && (
            <div id="message-connexion" className="text-red-500 mt-3">
              {errorMessage}
            </div>
          )}

          {!user ? (
            <div className="mt-5">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 px-4 rounded-md shadow-md w-full hover:bg-blue-600 hover:duration-300"
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
                className="bg-red-500 text-white p-2 px-4 rounded-md shadow-md w-full hover:bg-red-600 hover:duration-300"
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
