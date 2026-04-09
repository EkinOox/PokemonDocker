import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Navbar = ({ overlay = false }) => {
  const [isFixed, setIsFixed] = useState(false);
  const [userName, setUserName] = useState(null);

  let navStateClass = "relative";
  if (isFixed) {
    navStateClass = "fixed top-0 z-50 bg-slate-50/92 backdrop-blur-md shadow-[0_12px_36px_rgba(15,23,42,0.18)]";
  } else if (overlay) {
    navStateClass = "absolute top-0 left-0 z-40 bg-transparent";
  }

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
    <header className="relative z-50">
      <nav
        id="navbar"
        className={`w-full transition-all duration-300 ${navStateClass}`}
      >
        <div className="w-full max-w-7xl mx-auto px-3 md:px-5 py-3">
          <div className="relative flex flex-col lg:flex-row items-center gap-3 lg:gap-4 rounded-3xl border border-slate-200/90 bg-white/90 px-3 md:px-5 py-3 shadow-[0_10px_26px_rgba(1,103,156,0.14)]">
            <span className="absolute -left-2 -top-2 h-5 w-5 rounded-full bg-red-500 border-2 border-white" />
            <span className="absolute -right-2 -bottom-2 h-5 w-5 rounded-full bg-main border-2 border-white" />

            <div className="w-full lg:w-auto flex justify-center lg:justify-start">
              <Link to="/" className="flex items-center gap-3">
                <img
                  className="w-36 md:w-44 drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]"
                  src="/assets/image/logo-pokemon.png"
                  alt="logo-pokemon"
                />
                <span className="hidden md:inline text-xs uppercase tracking-[0.2em] text-secondary/80 font-semibold">
                  Trainer Hub
                </span>
              </Link>
            </div>

            <div className="w-full lg:flex-1 flex justify-center items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-slate-800 border border-slate-200 bg-white hover:bg-main/20 hover:border-main/70 transition-colors"
              >
                Accueil
              </Link>
              <Link
                to="/pokedex"
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-slate-800 border border-slate-200 bg-white hover:bg-secondary hover:text-white hover:border-secondary transition-colors"
              >
                Pokedex
              </Link>
            </div>

            <div className="w-full lg:w-auto flex justify-center lg:justify-end">
              <div className="relative group">
                {userName ? (
                  <>
                    <button
                      type="button"
                      className="pokemon-title inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-900 bg-main/85 border border-main/70 hover:bg-main transition-colors"
                    >
                      Bonjour, {userName}
                    </button>
                    <ul className="hidden group-hover:block group-focus-within:block absolute right-0 top-full pt-1 min-w-[180px] z-[1000]">
                      <li className="glass-panel rounded-2xl p-3 w-full flex flex-col gap-2 text-sm shadow-lg">
                        <Link to="/deconnexion" className="hover:text-secondary">Déconnexion</Link>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="pokemon-title inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white bg-secondary border border-secondary hover:brightness-110 transition"
                    >
                      Mon Compte
                    </button>
                    <ul className="hidden group-hover:block group-focus-within:block absolute right-0 top-full pt-1 min-w-[180px] z-[1000]">
                      <li className="glass-panel rounded-2xl p-3 w-full flex flex-col gap-2 text-sm shadow-lg">
                        <Link to="/connexion" className="hover:text-secondary">Connexion</Link>
                        <Link to="/inscription" className="hover:text-secondary">Inscription</Link>
                      </li>
                    </ul>
                  </>
                )}
            </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

Navbar.propTypes = {
  overlay: PropTypes.bool,
};

export default Navbar;
