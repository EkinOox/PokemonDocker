import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../src/pages/home';
import PokemonGen from '../src/pages/pokemonGen';
import Pokedex from '../src/pages/pokedex';
import PokemonDetail from '../src/pages/pokemonDetail';
import Inscription from '../src/pages/inscription';
import Connexion from '../src/pages/connexion';
import Deconnexion from '../src/pages/deconnexion';
import './output.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>  
          <Route path="/" element={<Home />} />
          <Route path="/pokemon-gen/:genId" element={<PokemonGen />} /> 
          <Route path="/pokedex" element={<Pokedex />} /> 
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/inscription" element={<Inscription />} /> 
          <Route path="/connexion" element={<Connexion />} /> 
          <Route path="/deconnexion" element={<Deconnexion />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
