// config/app.ts
// Configurações centralizadas da aplicação

export const config = {
  // API
  api: {
    baseUrl: import.meta.env.VITE_POKEMON_API_BASE_URL || 'https://pokeapi.co/api/v2',
    cacheDuration: parseInt(import.meta.env.VITE_API_CACHE_DURATION) || 300000, // 5 minutos
    defaultLimit: parseInt(import.meta.env.VITE_DEFAULT_POKEMON_LIMIT) || 20,
    maxSearchResults: parseInt(import.meta.env.VITE_MAX_POKEMON_SEARCH_RESULTS) || 50,
    debugCalls: import.meta.env.VITE_DEBUG_API_CALLS === 'true',
  },

  // App
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Pokédex',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  // Features
  features: {
    favorites: import.meta.env.VITE_ENABLE_FAVORITES === 'true',
    advancedSearch: import.meta.env.VITE_ENABLE_ADVANCED_SEARCH === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // UI
  ui: {
    animationDuration: 300,
    debounceDelay: 500,
    toastDuration: 3000,
  },

  // LocalStorage keys
  storage: {
    favorites: 'pokedex_favorites',
    settings: 'pokedex_settings',
    cache: 'pokedex_cache',
  },

  // Pokémon generations
  generations: [
    { id: 1, name: 'Kanto (I)', region: 'Kanto', range: [1, 151] },
    { id: 2, name: 'Johto (II)', region: 'Johto', range: [152, 251] },
    { id: 3, name: 'Hoenn (III)', region: 'Hoenn', range: [252, 386] },
    { id: 4, name: 'Sinnoh (IV)', region: 'Sinnoh', range: [387, 493] },
    { id: 5, name: 'Unova (V)', region: 'Unova', range: [494, 649] },
    { id: 6, name: 'Kalos (VI)', region: 'Kalos', range: [650, 721] },
    { id: 7, name: 'Alola (VII)', region: 'Alola', range: [722, 809] },
    { id: 8, name: 'Galar (VIII)', region: 'Galar', range: [810, 905] },
    { id: 9, name: 'Paldea (IX)', region: 'Paldea', range: [906, 1025] },
  ],

  // Pokémon types with colors
  types: {
    normal: { color: '#A8A878', icon: '⚪' },
    fire: { color: '#F08030', icon: '🔥' },
    water: { color: '#6890F0', icon: '💧' },
    electric: { color: '#F8D030', icon: '⚡' },
    grass: { color: '#78C850', icon: '🌿' },
    ice: { color: '#98D8D8', icon: '❄️' },
    fighting: { color: '#C03028', icon: '👊' },
    poison: { color: '#A040A0', icon: '☠️' },
    ground: { color: '#E0C068', icon: '🌍' },
    flying: { color: '#A890F0', icon: '🦅' },
    psychic: { color: '#F85888', icon: '🔮' },
    bug: { color: '#A8B820', icon: '🐛' },
    rock: { color: '#B8A038', icon: '🗿' },
    ghost: { color: '#705898', icon: '👻' },
    dragon: { color: '#7038F8', icon: '🐉' },
    dark: { color: '#705848', icon: '🌑' },
    steel: { color: '#B8B8D0', icon: '⚙️' },
    fairy: { color: '#EE99AC', icon: '🧚' },
  } as const,

  // Environment info
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Type helpers
export type PokemonTypeName = keyof typeof config.types;
export type GenerationId = typeof config.generations[number]['id'];

// Validation functions
export const validateEnvVars = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.api.baseUrl) {
    errors.push('VITE_POKEMON_API_BASE_URL is required');
  }

  if (config.api.cacheDuration < 0) {
    errors.push('VITE_API_CACHE_DURATION must be a positive number');
  }

  if (config.api.defaultLimit < 1 || config.api.defaultLimit > 100) {
    errors.push('VITE_DEFAULT_POKEMON_LIMIT must be between 1 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper to get generation by Pokemon ID
export const getGenerationByPokemonId = (id: number): typeof config.generations[number] | null => {
  return config.generations.find(gen => id >= gen.range[0] && id <= gen.range[1]) || null;
};

// Helper to get type color
export const getTypeColor = (type: string): string => {
  const typeKey = type.toLowerCase() as PokemonTypeName;
  return config.types[typeKey]?.color || '#68A090';
};

// Helper to get type icon
export const getTypeIcon = (type: string): string => {
  const typeKey = type.toLowerCase() as PokemonTypeName;
  return config.types[typeKey]?.icon || '❓';
};