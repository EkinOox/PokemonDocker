import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/nav";
import Banner from "../components/banner";
import Footer from "../components/footer";

const Home = () => {
  const [generations] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const navigate = useNavigate();

  const getCardClass = (index) => {
    if (index === 0) return 'md:col-span-4 md:row-span-2';
    if (index === 1 || index === 4) return 'md:col-span-2 md:row-span-2';
    if (index === 7) return 'md:col-span-4 md:row-span-1';
    return 'md:col-span-2 md:row-span-1';
  };
  
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
      <Navbar overlay />
      <Banner name="" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-10 animate-fade-up">
          <h2 className="w-full mb-3 text-3xl md:text-4xl pokemon-title text-slate-900">
            Choisissez votre generation
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Chaque carte ouvre un univers complet avec les Pokemon de la generation selectionnee.
          </p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[180px] md:auto-rows-[150px] gap-5 md:gap-6">
        {generations.map((genId, index) => (
          <button
            type="button"
            key={genId}
            className={`group relative overflow-hidden rounded-3xl border border-white/65 bg-white/85 shadow-[0_18px_36px_rgba(1,103,156,0.14)] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_44px_rgba(239,68,68,0.25)] animate-fade-up ${getCardClass(index)}`}
            onClick={() => handleClick(genId)}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-main/20 via-transparent to-secondary/25" />
            <img
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={`./assets/image/${genId}.jpg`}
              alt={`Generation ${genId}`}
            />
            <div className="absolute top-4 left-4 rounded-full px-3 py-1 bg-white/90 text-secondary text-xs font-bold border border-secondary/20">
              Gen {genId}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-900/90 to-transparent text-white text-left">
              <p className="pokemon-title text-2xl">Generation {genId}</p>
              <p className="text-sm text-slate-200">Explorer les Pokemon de cette ere</p>
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
