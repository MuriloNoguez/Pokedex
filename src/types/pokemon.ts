// types/pokemon.ts
export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites: {
    front_default: string;
    front_shiny?: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  height: number;
  weight: number;
  base_experience: number;
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  generation: {
    name: string;
    url: string;
  };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }>;
}

export interface Generation {
  id: number;
  name: string;
  region: string;
  pokemon_species: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonType {
  id: number;
  name: string;
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }>;
}

// Tipos de filtros
export interface FilterState {
  searchTerm: string;
  generation: number | null;
  type: string | null;
  sortBy: 'id' | 'name' | 'type';
  sortOrder: 'asc' | 'desc';
}

// Props comuns para componentes
export interface SearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export interface FilterProps {
  onFilterByGeneration: (generation: number | null) => void;
  onFilterByType: (type: string | null) => void;
  selectedGeneration?: number | null;
  selectedType?: string | null;
}