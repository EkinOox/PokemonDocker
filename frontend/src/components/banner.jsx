import React from "react";

const Banner = ({ name }) => {
  return (
    <div className="relative w-full min-h-[28rem] flex justify-center items-center overflow-hidden">
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-main/35 blur-2xl" />
      <div className="absolute -right-16 bottom-8 w-52 h-52 rounded-full bg-secondary/35 blur-2xl" />
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.35] scale-105"
        style={{ backgroundImage: "url('/assets/image/banniere/pokemon-banner.png')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-900/20 to-slate-900/70" />
      <div className="relative text-center px-4 max-w-4xl">
        <h1 className="pokemon-title text-3xl md:text-5xl py-4 text-white font-bold leading-tight">
          Ce site est destiné à mettre en avant toutes les générations de Pokémon.
        </h1>
        <p className="text-sm md:text-base text-slate-100/90 tracking-wide uppercase">
          Pokédex moderne, filtrage rapide et navigation fluide
        </p>
        {name && <h2 className="mt-5 text-lg md:text-2xl text-white font-semibold bg-white/10 border border-white/20 rounded-2xl px-5 py-3 inline-block">Vous explorez la {name}ème génération. Survolez les Pokémon pour voir la version Shiny.</h2>}
      </div>
    </div>
  );
};

export default Banner;
