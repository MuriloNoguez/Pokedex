// utils/api.ts
import type { Pokemon, PokemonListResponse, PokemonSpecies, Generation, PokemonType } from '../types/pokemon';
import { config } from '../config/app';

// Configurações da API
const { baseUrl: BASE_URL, cacheDuration: CACHE_DURATION, defaultLimit: DEFAULT_LIMIT, maxSearchResults: MAX_SEARCH_RESULTS, debugCalls: DEBUG_API } = config.api;

// Cache com expiração
interface CacheItem {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheItem>();

// Função auxiliar para verificar se o cache ainda é válido
function isCacheValid(item: CacheItem): boolean {
  return Date.now() - item.timestamp < CACHE_DURATION;
}

// Função auxiliar para fazer requisições com cache
async function fetchWithCache<T>(url: string): Promise<T> {
  // Verificar se existe no cache e ainda é válido
  if (cache.has(url)) {
    const cacheItem = cache.get(url)!;
    if (isCacheValid(cacheItem)) {
      if (DEBUG_API) {
        console.log(`📦 Cache hit: ${url}`);
      }
      return cacheItem.data;
    } else {
      // Remove cache expirado
      cache.delete(url);
    }
  }

  try {
    if (DEBUG_API) {
      console.log(`🔄 Fetching: ${url}`);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Salvar no cache com timestamp
    cache.set(url, {
      data,
      timestamp: Date.now()
    });

    if (DEBUG_API) {
      console.log(`✅ Cached: ${url}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ Error fetching data from ${url}:`, error);
    throw error;
  }
}

// Funções da API
export const pokemonApi = {
  // Buscar lista de Pokémon com paginação
  async getPokemonList(limit: number = DEFAULT_LIMIT, offset: number = 0): Promise<PokemonListResponse> {
    const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    return fetchWithCache<PokemonListResponse>(url);
  },

  // Buscar Pokémon específico por ID ou nome
  async getPokemon(idOrName: string | number): Promise<Pokemon> {
    const url = `${BASE_URL}/pokemon/${idOrName}`;
    return fetchWithCache<Pokemon>(url);
  },

  // Buscar espécie do Pokémon (para descrição, geração, etc.)
  async getPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies> {
    const url = `${BASE_URL}/pokemon-species/${idOrName}`;
    return fetchWithCache<PokemonSpecies>(url);
  },

  // Buscar Pokémon por geração
  async getPokemonByGeneration(generationId: number): Promise<Generation> {
    const url = `${BASE_URL}/generation/${generationId}`;
    return fetchWithCache<Generation>(url);
  },

  // Buscar Pokémon por tipo
  async getPokemonByType(typeName: string): Promise<PokemonType> {
    const url = `${BASE_URL}/type/${typeName}`;
    return fetchWithCache<PokemonType>(url);
  },

  // Buscar múltiplos Pokémon de uma vez
  async getMultiplePokemon(pokemonUrls: string[]): Promise<Pokemon[]> {
    const promises = pokemonUrls.map(url => fetchWithCache<Pokemon>(url));
    return Promise.all(promises);
  },

  // Buscar Pokémon por nome (busca parcial)
  async searchPokemonByName(searchTerm: string, limit: number = 1000): Promise<Pokemon[]> {
    try {
      // Primeiro, busca uma lista grande de Pokémon
      const listResponse = await this.getPokemonList(limit, 0);
      
      // Filtra por nome
      const filteredResults = listResponse.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Busca os dados completos dos Pokémon filtrados (limitado pela env var)
      const pokemonPromises = filteredResults.slice(0, MAX_SEARCH_RESULTS).map(pokemon =>
        this.getPokemon(pokemon.name)
      );

      return Promise.all(pokemonPromises);
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      return [];
    }
  },

  // Limpar cache (útil para desenvolvimento)
  clearCache(): void {
    cache.clear();
    if (DEBUG_API) {
      console.log('🗑️ Cache cleared');
    }
  },

  // Obter estatísticas do cache
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: cache.size,
      entries: Array.from(cache.keys())
    };
  }
};

// Utilitários para formatação
export const formatUtils = {
  // Capitalizar primeira letra
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Formatar ID do Pokémon com zeros à esquerda
  formatPokemonId: (id: number): string => {
    return id.toString().padStart(3, '0');
  },

  // Formatar altura (decímetros para metros)
  formatHeight: (heightInDecimeters: number): string => {
    const meters = heightInDecimeters / 10;
    return `${meters.toFixed(1)}m`;
  },

  // Formatar peso (hectogramas para quilogramas)
  formatWeight: (weightInHectograms: number): string => {
    const kilograms = weightInHectograms / 10;
    return `${kilograms.toFixed(1)}kg`;
  },

  // Extrair ID do Pokémon da URL
  extractPokemonId: (url: string): number => {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
  },

  // Obter descrição em português (ou inglês como fallback)
  getPokemonDescription: (species: PokemonSpecies): string => {
    // Tentar encontrar descrição em português
    let description = species.flavor_text_entries.find(
      entry => entry.language.name === 'pt'
    )?.flavor_text;

    // Fallback para inglês se não encontrar português
    if (!description) {
      description = species.flavor_text_entries.find(
        entry => entry.language.name === 'en'
      )?.flavor_text;
    }

    // Limpar caracteres especiais
    return description ? description.replace(/\f/g, ' ').replace(/\n/g, ' ') : 'Descrição não disponível';
  },

  // Obter gênero em português
  getPokemonGenus: (species: PokemonSpecies): string => {
    let genus = species.genera.find(
      entry => entry.language.name === 'pt'
    )?.genus;

    if (!genus) {
      genus = species.genera.find(
        entry => entry.language.name === 'en'
      )?.genus;
    }

    return genus || 'Pokémon';
  },

  // Cores para tipos de Pokémon
  getTypeColor: (type: string): string => {
    const typeColors: Record<string, string> = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[type.toLowerCase()] || '#68A090';
  }
};

// Hook customizado para debounce (útil para busca)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Importar React para o hook
import React from 'react';