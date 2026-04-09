import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../components/nav";
import Banner from "../components/banner";
import Footer from "../components/footer";
import '../output.css';

const PokemonGen = () => {
  const { genId } = useParams();
  const [pokemons, setPokemons] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      navigate('/connexion');
    }
  }, []);
  
  useEffect(() => {
    fetch(`/tyradex/api/v1/gen/${genId}`)
      .then(response => response.json())
      .then(data => {
        setPokemons(data);
        
        // Extraire les types uniques avec leur image
        const typeMap = new Map();
        data.forEach(p => {
          (p.types || []).forEach(t => {
            if (!typeMap.has(t.name)) typeMap.set(t.name, t.image);
          });
        });
        setTypes([...typeMap.entries()].map(([name, image]) => ({ name, image })));
      })
      .catch(error => console.error('Erreur lors de la récupération des Pokémon:', error));
  }, [genId]);
  
  // Filtrer les Pokémon
  const filteredPokemons = pokemons.filter(pokemon => {
    const matchesSearch = pokemon.name?.fr?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pokemon.name?.en?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || pokemon.types?.some(t => t.name === selectedType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="pokemon-page">
      <Navbar />
      <Banner name={genId} />

      {/* Barre de filtres sticky */}
      <div className="sticky top-0 z-40 px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-3 glass-panel rounded-3xl px-4 md:px-5 py-4">

          {/* Recherche + compteur */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-200 rounded-full text-sm focus:outline-none focus:border-secondary transition-colors bg-white/85"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              )}
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              <strong className="text-secondary">{filteredPokemons.length}</strong> Pokémon{filteredPokemons.length > 1 ? 's' : ''}
            </span>
            {(searchTerm || selectedType) && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedType(''); }}
                className="text-xs text-white bg-secondary px-3 py-1.5 rounded-full hover:brightness-110 transition whitespace-nowrap"
              >
                Tout effacer
              </button>
            )}
          </div>

          {/* Pills de types */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedType('')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                selectedType === ''
                  ? 'bg-main border-main text-slate-900 shadow-sm'
                  : 'bg-white/90 border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              Tous
            </button>
            {types.map(({ name, image }) => (
              <button
                key={name}
                onClick={() => setSelectedType(selectedType === name ? '' : name)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                  selectedType === name
                    ? 'border-secondary bg-secondary text-white shadow-sm scale-105'
                    : 'bg-white/90 border-gray-200 text-gray-700 hover:border-secondary hover:text-secondary'
                }`}
              >
                <img src={image} alt={name} className="w-4 h-4 object-contain" />
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredPokemons.map((pokemon) => {
          const firstType = pokemon.types?.[0]?.name?.toLowerCase();

          const typesHTML = (pokemon.types || []).map((type) => (
            <img
              key={type.name}
              src={type.image}
              alt={type.name}
              title={type.name}
              className="ml-2 w-7 h-7 rounded-md"
              style={{ backgroundImage: `url('./assets/image/fond/${firstType}.jpg')` }}
            />
          ));

          return (
            <button
              type="button"
              key={pokemon.pokedex_id}
              className="group bg-white/90 border border-white/70 shadow-[0_16px_32px_rgba(15,23,42,0.12)] rounded-3xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(1,103,156,0.22)] cursor-pointer"
              onClick={() => navigate(`/pokemon/${pokemon.pokedex_id}`)}
            >
              <img
                className="rounded-t-3xl h-48 w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                src={pokemon.sprites?.regular || "https://via.placeholder.com/150"}
                alt={pokemon.name?.fr || "Inconnu"}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.2), rgba(15,23,42,0.15)), url('../assets/image/fond/${firstType}.jpg')`,
                  backgroundSize: "cover",
                }}
                onMouseOver={(e) => (e.currentTarget.src = pokemon.sprites?.shiny || pokemon.sprites?.regular)}
                onMouseOut={(e) => (e.currentTarget.src = pokemon.sprites?.regular || "")}
                onFocus={(e) => (e.currentTarget.src = pokemon.sprites?.shiny || pokemon.sprites?.regular)}
                onBlur={(e) => (e.currentTarget.src = pokemon.sprites?.regular || "")}
              />
              <div className="p-4 rounded-b-3xl">
                <div className="flex">
                  <h3 className="text-2xl pokemon-title"><strong>{pokemon.name?.fr || "Inconnu"}</strong></h3>
                  <p className="mt-1 ml-auto text-lg font-medium text-gray-900 text-right flex justify-center">
                    {typesHTML.length > 0 ? typesHTML : <span>Aucun type</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-5 mt-3 text-sm font-semibold text-slate-700">
                  <span className="px-2 py-1 rounded-full bg-emerald-100">HP {pokemon.stats.hp}</span>
                  <span className="px-2 py-1 rounded-full bg-rose-100">ATK {pokemon.stats.atk}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default PokemonGen;
