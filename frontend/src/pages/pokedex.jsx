import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/nav";
import Banner from "../components/banner";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

const Pokedex = () => {
  const [pokemons, setPokemons] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  
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
    fetch("https://tyradex.vercel.app/api/v1/pokemon")
      .then((response) => response.json())
      .then((data) => {
        setPokemons(data.slice(1));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des Pokémon :", error);
        setLoading(false);
      });
  }, []);
  

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="bg-gray-200">
      <Navbar />
      <Banner name="" />
      <h2 className="w-full text-center m-4 text-2xl">
        Voici une liste de tous les pokémons existants
      </h2>
      <div className="grid grid-cols-4 gap-5">
        {pokemons.map((pokemon) => {
          const firstType = pokemon.types?.[0]?.name?.toLowerCase();

          // Générer les types sous forme de HTML
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
                  backgroundImage: `url('./assets/image/fond/${firstType}.jpg')`,
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

export default Pokedex;
