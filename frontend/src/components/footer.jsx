// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="relative mt-16">
      <div className="w-full bg-gradient-to-r from-secondary via-sky-700 to-slate-900 shadow-inner flex justify-center border-t-4 border-main">
        <img
          className="w-44 md:w-56 m-6 md:m-8 drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
          src="/assets/image/logo-pokemon.png"
          alt="logo-pokemon"
        />
      </div>
      <div className="w-full bg-slate-950 text-center flex flex-col md:flex-row justify-between items-center text-slate-100 px-6 py-5 gap-4">
        <div className="m-1 text-sm">
          <p>
            <a href="https://portfolio-kdiochon.fr/" target="_blank" rel="noopener" className="text-main hover:text-amber-300 transition-colors">
              Mon Portfolio
            </a>
          </p>
          <p>© 2024 Kyllian Diochon - Tous droits réservés</p>
        </div>
        <div className="m-1 flex items-center gap-4 text-xs uppercase tracking-wider text-slate-400">
          <p className="w-6">
            <a href="https://www.instagram.com/_ekin0ox_/" target="_blank" rel="noopener">
              {/* SVG pour Instagram */}
            </a>
          </p>
          <p className="w-6">
            <a
              href="https://www.linkedin.com/in/kyllian-diochon-6905a5225/"
              target="_blank"
              rel="noopener"
            >
              {/* SVG pour LinkedIn */}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
