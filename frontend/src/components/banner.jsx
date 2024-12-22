import React from "react";

const Banner = ({ name }) => {
  return (
    <div className="relative w-full h-100 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-cover bg-center brightness-50"
        style={{ backgroundImage: "url('/assets/image/banniere/pokemon-banner.png')" }}
      ></div>
      <div className="relative text-center">
        <h1 className="text-2xl py-7 text-white">
          Ce site est destiné à mettre en avant toutes les générations de Pokémon.
        </h1>
        {name && <h2 className="text-xl text-white">Vous explorez la {name}ème génération, <br/>Survolez les pokemons pour voir le version Shiny</h2>}
      </div>
    </div>
  );
};

export default Banner;
