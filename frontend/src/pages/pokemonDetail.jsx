import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/nav';
import Footer from '../components/footer';
import '../output.css';

const TYPE_COLORS = {
  'Normal':    { bg: '#A8A878', text: '#fff' },
  'Feu':       { bg: '#F08030', text: '#fff' },
  'Eau':       { bg: '#6890F0', text: '#fff' },
  'Électrik':  { bg: '#F8D030', text: '#333' },
  'Plante':    { bg: '#78C850', text: '#fff' },
  'Glace':     { bg: '#98D8D8', text: '#333' },
  'Combat':    { bg: '#C03028', text: '#fff' },
  'Poison':    { bg: '#A040A0', text: '#fff' },
  'Sol':       { bg: '#E0C068', text: '#333' },
  'Vol':       { bg: '#A890F0', text: '#fff' },
  'Psy':       { bg: '#F85888', text: '#fff' },
  'Insecte':   { bg: '#A8B820', text: '#fff' },
  'Roche':     { bg: '#B8A038', text: '#fff' },
  'Spectre':   { bg: '#705898', text: '#fff' },
  'Dragon':    { bg: '#7038F8', text: '#fff' },
  'Ténèbres':  { bg: '#705848', text: '#fff' },
  'Acier':     { bg: '#B8B8D0', text: '#333' },
  'Fée':       { bg: '#EE99AC', text: '#333' },
};

const STAT_LABELS = {
  hp:      { label: 'PV',     color: '#4CAF50' },
  atk:     { label: 'ATK',    color: '#F44336' },
  def:     { label: 'DEF',    color: '#2196F3' },
  spe_atk: { label: 'ATK Sp', color: '#FF9800' },
  spe_def: { label: 'DEF Sp', color: '#9C27B0' },
  vit:     { label: 'VIT',    color: '#00BCD4' },
};

const StatBar = ({ label, value, color }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="w-16 text-right text-sm font-semibold text-gray-600">{label}</span>
    <span className="w-10 text-sm font-bold" style={{ color }}>{value}</span>
    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="h-3 rounded-full transition-all duration-700"
        style={{ width: `${Math.min((value / 255) * 100, 100)}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const TypeBadge = ({ name }) => {
  const c = TYPE_COLORS[name] || { bg: '#999', text: '#fff' };
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {name}
    </span>
  );
};

const MultiplierBadge = ({ multiplier }) => {
  const map = {
    0:    { label: 'Immune', bg: '#607D8B', text: '#fff' },
    0.25: { label: '×¼',    bg: '#4CAF50', text: '#fff' },
    0.5:  { label: '×½',    bg: '#8BC34A', text: '#fff' },
    2:    { label: '×2',    bg: '#FF9800', text: '#fff' },
    4:    { label: '×4',    bg: '#F44336', text: '#fff' },
  };
  const m = map[multiplier] || { label: `×${multiplier}`, bg: '#999', text: '#fff' };
  return (
    <span className="text-xs font-bold px-1.5 py-0.5 rounded ml-1" style={{ backgroundColor: m.bg, color: m.text }}>
      {m.label}
    </span>
  );
};

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [evoPokemon, setEvoPokemon] = useState({ pre: [], next: [], mega: [] });
  const [loading, setLoading] = useState(true);
  const [shiny, setShiny] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (!userData) navigate('/connexion');
  }, []);

  useEffect(() => {
    setLoading(true);
    setShiny(false);
    fetch(`/tyradex/api/v1/pokemon/${id}`)
      .then(r => r.json())
      .then(async (data) => {
        setPokemon(data);

        // Charger les sprites des évolutions
        const fetchEvoSprite = async (pokedexId) => {
          try {
            const r = await fetch(`/tyradex/api/v1/pokemon/${pokedexId}`);
            return await r.json();
          } catch { return null; }
        };

        // pre est un tableau de toute la chaîne d'évolution précédente
        const pre = await Promise.all(
          (data.evolution?.pre || []).map(async (e) => {
            const p = await fetchEvoSprite(e.pokedex_id);
            return p ? { ...p, condition: e.condition } : null;
          })
        );

        // next est un tableau d'évolutions suivantes
        const next = await Promise.all(
          (data.evolution?.next || []).map(async (e) => {
            const p = await fetchEvoSprite(e.pokedex_id);
            return p ? { ...p, condition: e.condition } : null;
          })
        );

        // mega a ses sprites directement, pas de pokedex_id ni de fetch
        const mega = (data.evolution?.mega || []).map(m => ({
          name: { fr: m.orbe },
          sprites: m.sprites,
          pokedex_id: null,
          isMega: true,
        }));

        setEvoPokemon({ pre: pre.filter(Boolean), next: next.filter(Boolean), mega });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-2xl font-bold text-secondary animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!pokemon || pokemon.status === 404) {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-gray-600">Pokémon introuvable</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-secondary text-white rounded-full font-bold hover:opacity-80">
          Retour
        </button>
      </div>
    );
  }

  const firstType = pokemon.types?.[0]?.name;
  const typeColor = TYPE_COLORS[firstType]?.bg || '#f8c400';

  const weaknesses = (pokemon.resistances || []).filter(r => r.multiplier >= 2);
  const resistances = (pokemon.resistances || []).filter(r => r.multiplier > 0 && r.multiplier < 1);
  const immunities = (pokemon.resistances || []).filter(r => r.multiplier === 0);

  const hasEvolutions = evoPokemon.pre.length > 0 || evoPokemon.next.length > 0 || evoPokemon.mega.length > 0;

  const currentSprite = shiny
    ? (pokemon.sprites?.shiny || pokemon.sprites?.regular)
    : (pokemon.sprites?.regular || '');

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Hero banner coloré selon le type */}
      <div
        className="w-full py-12 px-4 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${typeColor}cc 0%, ${typeColor}44 100%)` }}
      >
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/70 hover:bg-white text-gray-800 font-semibold px-4 py-2 rounded-full shadow transition"
        >
          ← Retour
        </button>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Sprite */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-52 h-52 rounded-full bg-white/40 flex items-center justify-center shadow-xl cursor-pointer"
              onClick={() => setShiny(s => !s)}
              title="Cliquer pour voir la version shiny"
            >
              <img
                src={currentSprite}
                alt={pokemon.name?.fr}
                className="w-44 h-44 object-contain drop-shadow-lg transition-transform duration-300 hover:scale-110"
              />
            </div>
            <button
              onClick={() => setShiny(s => !s)}
              className={`px-4 py-1 rounded-full text-xs font-bold border-2 transition ${shiny ? 'bg-yellow-400 border-yellow-600 text-gray-900' : 'bg-white/60 border-white text-gray-700'}`}
            >
            {shiny ? 'Shiny actif' : 'Voir Shiny'}
            </button>
          </div>

          {/* Infos principales */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-white/70 text-lg font-bold">#{String(pokemon.pokedex_id).padStart(3, '0')}</span>
              <h1 className="text-4xl font-extrabold text-white drop-shadow">{pokemon.name?.fr}</h1>
            </div>
            <p className="text-white/80 text-sm italic">{pokemon.name?.en} · {pokemon.name?.jp}</p>
            <p className="text-white font-semibold">{pokemon.category}</p>

            {/* Types */}
            <div className="flex gap-2 flex-wrap">
              {(pokemon.types || []).map(t => <TypeBadge key={t.name} name={t.name} />)}
            </div>

            {/* Infos rapides */}
            <div className="flex gap-6 mt-2 flex-wrap text-white">
              <div className="flex flex-col items-center bg-white/20 rounded-xl px-4 py-2">
                <span className="text-xs opacity-70">Taille</span>
                <span className="font-bold">{pokemon.height}</span>
              </div>
              <div className="flex flex-col items-center bg-white/20 rounded-xl px-4 py-2">
                <span className="text-xs opacity-70">Poids</span>
                <span className="font-bold">{pokemon.weight}</span>
              </div>
              <div className="flex flex-col items-center bg-white/20 rounded-xl px-4 py-2">
                <span className="text-xs opacity-70">Génération</span>
                <span className="font-bold">{pokemon.generation}</span>
              </div>
              <div className="flex flex-col items-center bg-white/20 rounded-xl px-4 py-2">
                <span className="text-xs opacity-70">Taux de capture</span>
                <span className="font-bold">{pokemon.catch_rate ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corps de la page */}
      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-extrabold text-secondary mb-4 border-b pb-2">Statistiques</h2>
          {Object.entries(STAT_LABELS).map(([key, { label, color }]) => (
            <StatBar key={key} label={label} value={pokemon.stats?.[key] ?? 0} color={color} />
          ))}
          <p className="text-right text-xs text-gray-400 mt-2">
            Total : <strong>{Object.keys(STAT_LABELS).reduce((acc, k) => acc + (pokemon.stats?.[k] ?? 0), 0)}</strong>
          </p>
        </div>

        {/* Faiblesses, Résistances, Immunités */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5">
          <h2 className="text-xl font-extrabold text-secondary border-b pb-2">Résistances</h2>

          {weaknesses.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-red-500 mb-2 uppercase tracking-wide">Faiblesses</h3>
              <div className="flex flex-wrap gap-2">
                {weaknesses.map(r => (
                  <div key={r.name} className="flex items-center">
                    <TypeBadge name={r.name} />
                    <MultiplierBadge multiplier={r.multiplier} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {resistances.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-green-600 mb-2 uppercase tracking-wide">Résistances</h3>
              <div className="flex flex-wrap gap-2">
                {resistances.map(r => (
                  <div key={r.name} className="flex items-center">
                    <TypeBadge name={r.name} />
                    <MultiplierBadge multiplier={r.multiplier} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {immunities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Immunités</h3>
              <div className="flex flex-wrap gap-2">
                {immunities.map(r => (
                  <div key={r.name} className="flex items-center">
                    <TypeBadge name={r.name} />
                    <MultiplierBadge multiplier={0} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Talents */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-extrabold text-secondary mb-4 border-b pb-2">Talents</h2>
          <div className="flex flex-col gap-2">
            {(pokemon.talents || []).map(t => (
              <div key={t.name} className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${t.tc ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-blue-50 text-secondary border border-blue-200'}`}>
                  {t.name}
                </span>
                {t.tc && <span className="text-xs text-purple-500 italic">Talent Caché</span>}
              </div>
            ))}
          </div>

          {/* Infos complémentaires */}
          <h2 className="text-xl font-extrabold text-secondary mt-6 mb-4 border-b pb-2">Infos</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {pokemon.egg_groups?.length > 0 && (
              <div>
                <span className="text-gray-500">Groupes Œuf</span>
                <p className="font-semibold">{pokemon.egg_groups.join(', ')}</p>
              </div>
            )}
            {pokemon.sexe && (
              <div>
                <span className="text-gray-500">Genre</span>
                <p className="font-semibold">
                  {pokemon.sexe.male != null ? `♂ ${pokemon.sexe.male}%` : '—'}
                  {pokemon.sexe.female != null ? ` · ♀ ${pokemon.sexe.female}%` : ''}
                </p>
              </div>
            )}
            {pokemon.level_100 != null && (
              <div>
                <span className="text-gray-500">XP niveau 100</span>
                <p className="font-semibold">{pokemon.level_100.toLocaleString('fr-FR')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Évolutions */}
        {hasEvolutions && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-extrabold text-secondary mb-4 border-b pb-2">Évolutions</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">

              {/* Pré-évolutions (chaîne complète) */}
              {evoPokemon.pre.map((evo) => (
                <div key={evo.pokedex_id} className="flex items-center gap-4">
                  <EvoCard p={evo} navigate={navigate} typeColor={typeColor} />
                  <div className="flex flex-col items-center text-gray-400">
                    <span className="text-2xl">→</span>
                    <span className="text-xs text-center">{evo.condition}</span>
                  </div>
                </div>
              ))}

              {/* Pokémon actuel */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-inner ring-4"
                  style={{ backgroundColor: `${typeColor}33`, ringColor: typeColor }}
                >
                  <img src={pokemon.sprites?.regular} alt={pokemon.name?.fr} className="w-16 h-16 object-contain" />
                </div>
                <span className="text-xs font-bold text-gray-700">{pokemon.name?.fr}</span>
                <span className="text-xs text-gray-400">#{String(pokemon.pokedex_id).padStart(3, '0')}</span>
              </div>

              {/* Évolutions suivantes */}
              {evoPokemon.next.map((evo) => (
                <div key={evo.pokedex_id} className="flex items-center gap-4">
                  <div className="flex flex-col items-center text-gray-400">
                    <span className="text-2xl">→</span>
                    <span className="text-xs text-center">{evo.condition}</span>
                  </div>
                  <EvoCard p={evo} navigate={navigate} typeColor={typeColor} />
                </div>
              ))}

              {/* Méga-évolutions */}
              {evoPokemon.mega.length > 0 && (
                <div className="w-full mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wide">Méga-évolutions</p>
                  <div className="flex flex-wrap gap-4">
                    {evoPokemon.mega.map((mega, i) => (
                      <EvoCard key={i} p={mega} navigate={navigate} typeColor={typeColor} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const EvoCard = ({ p, navigate, typeColor }) => (
  <div
    className={`flex flex-col items-center gap-1 ${p.isMega ? 'cursor-default' : 'cursor-pointer group'}`}
    onClick={() => !p.isMega && p.pokedex_id && navigate(`/pokemon/${p.pokedex_id}`)}
  >
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center shadow group-hover:shadow-lg transition"
      style={{ backgroundColor: `${typeColor}22` }}
    >
      <img
        src={p.sprites?.regular}
        alt={p.name?.fr}
        className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-200"
      />
    </div>
    <span className="text-xs font-bold text-gray-700 group-hover:text-secondary transition-colors">{p.name?.fr}</span>
    {p.pokedex_id && <span className="text-xs text-gray-400">#{String(p.pokedex_id).padStart(3, '0')}</span>}
  </div>
);

export default PokemonDetail;
