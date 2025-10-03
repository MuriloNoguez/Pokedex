import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
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
}

interface PokemonListProps {
  searchTerm: string;
  selectedGeneration: number | null;
  selectedType: string | null;
  onPokemonClick?: (id: number) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({ searchTerm, selectedGeneration, selectedType, onPokemonClick }) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar TODOS os Pokémon de uma vez (1000+ Pokémon)
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0');
      const data = await response.json();
      
      // Buscar detalhes em lotes para melhor performance
      const batchSize = 50;
      const pokemonDetails: Pokemon[] = [];
      
      // Limitar a 1000 Pokémon para não sobrecarregar
      const pokemonToFetch = data.results.slice(0, 1000);
      
      for (let i = 0; i < pokemonToFetch.length; i += batchSize) {
        const batch = pokemonToFetch.slice(i, i + batchSize);
        const batchDetails = await Promise.all(
          batch.map(async (pokemon: { url: string }) => {
            const pokemonResponse = await fetch(pokemon.url);
            return pokemonResponse.json();
          })
        );
        pokemonDetails.push(...batchDetails);
        
        // Pequena pausa para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      setPokemon(pokemonDetails);
    } catch (err) {
      setError('Erro ao carregar Pokémon. Tente novamente.');
      console.error('Error fetching Pokemon:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  // Função para determinar a geração baseada no ID
  const getGenerationByPokemonId = (id: number): number => {
    if (id <= 151) return 1;      // Kanto
    if (id <= 251) return 2;      // Johto  
    if (id <= 386) return 3;      // Hoenn
    if (id <= 493) return 4;      // Sinnoh
    if (id <= 649) return 5;      // Unova
    if (id <= 721) return 6;      // Kalos
    if (id <= 809) return 7;      // Alola
    if (id <= 905) return 8;      // Galar
    return 9;                     // Paldea
  };

  // Filtrar Pokémon baseado nos critérios
  const filteredPokemon = pokemon.filter((p) => {
    // Filtro por nome ou ID
    const matchesSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm) ||
      p.id.toString().padStart(3, '0').includes(searchTerm);

    // Filtro por geração baseado no ID
    const matchesGeneration = !selectedGeneration || 
      getGenerationByPokemonId(p.id) === selectedGeneration;

    // Filtro por tipo
    const matchesType = !selectedType || 
      p.types.some(type => type.type.name.toLowerCase() === selectedType.toLowerCase());

    return matchesSearch && matchesGeneration && matchesType;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        <span className="ml-3 text-gray-600">Carregando Pokémon...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">❌ {error}</div>
        <button 
          onClick={fetchPokemon}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (filteredPokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">🔍 Nenhum Pokémon encontrado</div>
        <p className="text-gray-400">Tente ajustar os filtros de busca</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold">{filteredPokemon.length}</span> Pokémon
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPokemon.map((p) => (
          <PokemonCard
            key={p.id}
            id={p.id}
            name={p.name}
            image={p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default}
            types={p.types.map(type => type.type.name)}
            onClick={onPokemonClick}
          />
        ))}
      </div>
    </div>
  );
};

export default PokemonList;