// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="w-full bg-main shadow-inner flex justify-center">
        <img
          className="w-60 m-8"
          src="/assets/image/logo-pokemon.png"
          alt="logo-pokemon"
        />
      </div>
      <div className="w-full h-15 bg-secondary text-center flex justify-around items-center text-white">
        <div className="m-3">
          <p>
            <a href="https://portfolio-kdiochon.fr/" target="_blank" rel="noopener">
              Mon Portfolio
            </a>
          </p>
          <p>© 2024 Kyllian Diochon - Tous droits réservés</p>
        </div>
        <div className="m-3 flex">
          <p className="w-6 ml-3">
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
