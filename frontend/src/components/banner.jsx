import React from "react";
import PropTypes from "prop-types";

const Banner = (props) => {
  const { name } = props;
  return (
    <section className="relative w-full min-h-[42rem] md:min-h-[46rem] flex items-center overflow-hidden pt-24 md:pt-28">
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-main/35 blur-2xl animate-float-soft" />
      <div className="absolute -right-16 bottom-8 w-52 h-52 rounded-full bg-secondary/35 blur-2xl animate-float-soft" style={{ animationDelay: '700ms' }} />
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.35] scale-105"
        style={{ backgroundImage: "url('/assets/image/banniere/pokemon-banner.png')" }}
      ></div>
      <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(2,6,23,.88)_0%,rgba(2,6,23,.6)_45%,rgba(2,6,23,.22)_100%)]" />
      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 animate-fade-up">
        <div className="max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white animate-pulse-ring">
            Projet Etudiant
          </div>
          <h1 className="pokemon-title text-4xl md:text-6xl lg:text-7xl py-5 text-white font-bold leading-[0.95]">
            Une vision moderne de l'univers Pokemon
          </h1>
          <p className="max-w-2xl text-sm md:text-lg text-slate-100/90 leading-relaxed">
            Ce projet etudiant reimagine le Pokedex avec une interface actuelle, des filtres rapides et une navigation fluide entre les generations.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="rounded-full bg-main text-slate-900 font-semibold text-sm px-4 py-2">Design System Pokemon</span>
            <span className="rounded-full bg-white/15 border border-white/25 text-white font-medium text-sm px-4 py-2">Animations fluides</span>
            <span className="rounded-full bg-white/15 border border-white/25 text-white font-medium text-sm px-4 py-2">Navigation detaillee</span>
          </div>
        </div>

        {name && (
          <h2 className="mt-8 text-base md:text-xl text-white font-semibold bg-white/12 border border-white/25 rounded-2xl px-5 py-3 inline-block">
            Vous explorez la {name}eme generation. Survolez les Pokemon pour voir la version Shiny.
          </h2>
        )}
      </div>
    </section>
  );
};

Banner.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Banner;
