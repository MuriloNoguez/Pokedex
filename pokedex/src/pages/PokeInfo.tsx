import React, { useState, useEffect } from 'react';

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    front_shiny: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  species: {
    url: string;
  };
}

interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;
}

interface PokeInfoProps {
  pokemonId: number;
  onBack: () => void;
}

const PokeInfo: React.FC<PokeInfoProps> = ({ pokemonId, onBack }) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-blue-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300'
    };
    return colors[type.toLowerCase()] || 'bg-gray-400';
  };

  const getStatName = (statName: string) => {
    const names: { [key: string]: string } = {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      'special-attack': 'Sp. Attack',
      'special-defense': 'Sp. Defense',
      speed: 'Speed'
    };
    return names[statName] || statName;
  };

  const getDescription = () => {
    if (!species) return 'Descrição não disponível';
    
    // Busca especificamente português do Brasil
    const ptBrDescription = species.flavor_text_entries.find(
      entry => entry.language.name === 'pt-BR'
    );
    
    // Se não encontrar pt-BR, tenta português genérico
    const ptDescription = species.flavor_text_entries.find(
      entry => entry.language.name === 'pt'
    );
    
    // Fallback para inglês se não tiver português
    const enDescription = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    
    const description = ptBrDescription || ptDescription || enDescription;
    return description ? description.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : 'Descrição não disponível';
  };

  const getGenus = () => {
    if (!species) return 'Pokémon';
    
    const enGenus = species.genera.find(
      genus => genus.language.name === 'en'
    );
    
    return enGenus?.genus || 'Pokémon';
  };

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados do Pokémon
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonData = await pokemonResponse.json();
        setPokemon(pokemonData);

        // Buscar dados da espécie
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);
      } catch (err) {
        setError('Erro ao carregar detalhes do Pokémon');
        console.error('Error fetching Pokemon details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={onBack}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header com botão voltar */}
      <div className="bg-gradient-to-r from-red-500 to-blue-500 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={onBack}
            className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-white capitalize">
            {pokemon.name}
          </h1>
          <span className="text-white/80">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Seção principal */}
          <div className="md:flex">
            {/* Imagem */}
            <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
              <div className="text-center">
                <img 
                  src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-64 h-64 object-contain mx-auto mb-4"
                />
                <div className="flex gap-2 justify-center mb-4">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`px-4 py-2 rounded-full text-white font-medium ${getTypeColor(type.type.name)}`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 font-medium">{getGenus()}</p>
              </div>
            </div>

            {/* Informações */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold text-gray-800 capitalize mb-4">
                {pokemon.name}
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {getDescription()}
              </p>

              {/* Informações básicas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Altura</p>
                  <p className="text-xl font-bold text-gray-800">
                    {(pokemon.height / 10).toFixed(1)}m
                  </p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Peso</p>
                  <p className="text-xl font-bold text-gray-800">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </p>
                </div>
              </div>

              {/* Habilidades */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Habilidades</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ability.is_hidden 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ability.ability.name}
                      {ability.is_hidden && ' (Oculta)'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-8 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Estatísticas Base</h3>
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {getStatName(stat.stat.name)}
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {stat.base_stat}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokeInfo;
