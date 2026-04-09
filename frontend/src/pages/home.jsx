import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/nav";
import Banner from "../components/banner";
import Footer from "../components/footer";

const Home = () => {
  const [generations] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      navigate('/connexion');
    }
  }, []);


  const handleClick = (genId) => {
    navigate(`/pokemon-gen/${genId}`);
  };

  return (
    <div className="pokemon-page">
      <Navbar />
      <Banner name="" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-10">
        <h2 className="w-full text-center mb-8 text-3xl md:text-4xl pokemon-title text-slate-900">
          Choisissez votre génération
        </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {generations.map((genId) => (
          <button
            type="button"
            key={genId}
            className="group relative overflow-hidden rounded-3xl border border-white/50 glass-panel cursor-pointer transition-all duration-300 hover:-translate-y-2"
            onClick={() => handleClick(genId)}
          >
            <img
              className="rounded-3xl h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={`./assets/image/${genId}.jpg`}
              alt={`Generation ${genId}`}
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-900/85 to-transparent text-white">
              <p className="pokemon-title text-2xl">Génération {genId}</p>
              <p className="text-sm text-slate-200">Explorer les Pokémon de cette ère</p>
            </div>
          </button>
        ))}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
