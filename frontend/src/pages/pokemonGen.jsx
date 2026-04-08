import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/nav";
import Banner from "../components/banner";
import Footer from "../components/footer";
import '../output.css';

const PokemonGen = () => {
  const { genId } = useParams();
  const [pokemons, setPokemons] = useState([]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name);
    }else{
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
    <div className="bg-gray-200">
      <Navbar />
      <Banner name={genId} />

      {/* Barre de filtres sticky */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm shadow-md border-b border-gray-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">

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
                className="w-full pl-9 pr-4 py-2 border-2 border-gray-200 rounded-full text-sm focus:outline-none focus:border-secondary transition-colors"
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
                className="text-xs text-white bg-secondary px-3 py-1.5 rounded-full hover:opacity-80 transition whitespace-nowrap"
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
                  ? 'bg-main border-main text-gray-800 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
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
                    : 'bg-white border-gray-200 text-gray-700 hover:border-secondary hover:text-secondary'
                }`}
              >
                <img src={image} alt={name} className="w-4 h-4 object-contain" />
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-8 lg:max-w-4xl grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl-grid-cols-4">
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
            <div
              key={pokemon.pokedex_id}
              className="bg-white shadow-lg rounded-lg m-4 transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate(`/pokemon/${pokemon.pokedex_id}`)}
            >
              <img
                className="rounded-t-lg"
                src={pokemon.sprites?.regular || "https://via.placeholder.com/150"}
                alt={pokemon.name?.fr || "Inconnu"}
                style={{
                  backgroundImage: `url('../assets/image/fond/${firstType}.jpg')`,
                  backgroundSize: "cover",
                }}
                onMouseOver={(e) => (e.currentTarget.src = pokemon.sprites?.shiny || pokemon.sprites?.regular)}
                onMouseOut={(e) => (e.currentTarget.src = pokemon.sprites?.regular || "")}
              />
              <div className="p-4 rounded-b-md">
                <div className="flex">
                  <h3 className="text-2xl"><strong>{pokemon.name?.fr || "Inconnu"}</strong></h3>
                  <p className="mt-1 ml-auto text-lg font-medium text-gray-900 text-right flex justify-center">
                    {typesHTML.length > 0 ? typesHTML : <span>Aucun type</span>}
                  </p>
                </div>
                <div className="flex flex-col mb-5 mt-2">
                  <p>{pokemon.stats.hp} HP</p>
                  <p>{pokemon.stats.atk} ATK</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default PokemonGen;
