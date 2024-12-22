import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import Navbar from "../components/nav";
import Banner from "../components/banner";
import Footer from "../components/footer";
import '../output.css';

const PokemonGen = () => {
  const { genId } = useParams();
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch(`https://tyradex.vercel.app/api/v1/gen/${genId}`)
      .then(response => response.json())
      .then(data => setPokemons(data))
      .catch(error => console.error('Erreur lors de la récupération des Pokémon:', error));
  }, [genId]);

  return (
    <div className="bg-gray-200">
      <Navbar />
      <Banner name={genId} />
      <div className="max-w-2xl mx-auto px-4 py-8 lg:max-w-4xl grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl-grid-cols-4">
        {pokemons.map((pokemon) => {
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
            <div key={pokemon.pokedex_id} className="bg-white shadow-lg rounded-lg m-4 transform transition-transform duration-300 hover:-translate-y-2">
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
                  <h3 className="text-2xl"><strong>{pokemon.name?.fr || "Inconnu"}</strong></h3><br />
                  <p className="mt-1 ml-auto text-lg font-medium text-gray-900 text-right flex justify-center">
                    {typesHTML.length > 0 ? typesHTML : <span>Aucun type</span>}
                  </p>
                </div>
                <div className="flex flex-col mb-5 mt-2">
                  <p>{pokemon.stats.hp} HP</p>
                  <p>{pokemon.stats.atk} ATK</p>
                </div>
                {/* <Link
                  to={`/pokemon-profile/${pokemon.pokedex_id}`}
                  className="inline-flex items-center justify-between px-5 py-1 shadow-sm font-medium rounded-md bg-red-600 hover:bg-red-800"
                >
                  <span className="text-gray-100 text-lg">Voir plus</span>
                </Link> */}
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
