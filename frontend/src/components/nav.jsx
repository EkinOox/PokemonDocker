import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [userName, setUserName] = useState(null);

  // Charger le nom de l'utilisateur depuis sessionStorage
  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsFixed(window.scrollY >= 117);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        id="navbar"
        className={`w-full bg-main border-b-4 border-secondary flex justify-center ${
          isFixed ? "fixed top-0 z-50 shadow-lg" : ""
        }`}
      >
        <ul className="w-full flex justify-center items-center list-none text-secondary m-3">
          <div className="w-full flex justify-center">
            <li className="mr-3 bg-main rounded-md p-3 shadow-inner shadow-gray-600/40">
              <a href="/">Accueil</a>
            </li>
            <li className="mr-3 bg-main rounded-md p-3 shadow-inner shadow-gray-600/30">
              <a href="/pokedex">Pokédex</a>
            </li>
          </div>
          <div className="w-full flex justify-center">
            <li>
              <img
                className="w-60"
                src="/assets/image/logo-pokemon.png"
                alt="logo-pokemon"
              />
            </li>
          </div>
          <div className="w-full flex justify-end">
            <li className="relative group bg-main rounded-md p-3 shadow-inner shadow-gray-600/30">
              {!userName ? (
                <>
                  <a href="#">Mon Compte</a>
                  <ul className="hidden group-hover:block shadow-sm absolute w-full z-[1000]">
                    <li className="bg-main rounded-md p-3 shadow-inner shadow-gray-600/30 w-100 flex flex-col">
                      <a href="/connexion">Connexion</a>
                      <a href="/inscription">Inscription</a>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <a href="#">Bonjour, {userName}</a>
                  <ul className="hidden group-hover:block shadow-sm absolute w-full z-[1000]">
                    <li className="bg-main rounded-md p-3 shadow-inner shadow-gray-600/30 w-100 flex flex-col">
                      <a href="/deconnexion">Déconnexion</a>
                    </li>
                  </ul>
                </>
              )}
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
