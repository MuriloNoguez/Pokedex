import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import { pokemonApi } from '../utils/api';
import { config } from '../config/app';

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

interface GenerationBlock {
  id: number;
  name: string;
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
}

interface PokemonListProps {
  searchTerm: string;
  selectedGeneration: number | null;
  selectedType: string | null;
  onPokemonClick?: (id: number) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({ searchTerm, selectedGeneration, selectedType, onPokemonClick }) => {
  // Usa as gerações definidas em config
  const generations = config.generations;

  const [loadedGenerations, setLoadedGenerations] = useState<GenerationBlock[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const loadingGenRef = React.useRef<Set<number>>(new Set());
  const loadingTypeRef = React.useRef<boolean>(false);
  const TYPE_BLOCK_ID = -1;

  // Carrega uma geração específica (busca lista e detalhes em lotes)
  const loadGeneration = async (genId: number) => {
    // evitar duplicatas e condições de corrida
    if (loadingGenRef.current.has(genId)) return;
    if (loadedGenerations.some(g => g.id === genId)) return;

    const gen = generations.find(g => g.id === genId);
    if (!gen) return;

    // marcar como em progresso imediatamente
    loadingGenRef.current.add(genId);

    setLoadedGenerations(prev => {
      if (prev.some(g => g.id === genId)) return prev;
      return [...prev, { id: gen.id, name: gen.name, pokemons: [], loading: true, error: null }];
    });

    try {
      setGlobalLoading(true);

      const offset = gen.range[0] - 1;
      const limit = gen.range[1] - gen.range[0] + 1;

      const listResponse = await pokemonApi.getPokemonList(limit, offset);

      const batchSize = 30;
      const details: Pokemon[] = [];

      const results = listResponse.results || [];

      for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);
        const batchDetails = await Promise.all(
          batch.map(async (item: { url: string }) => {
            try {
              // extrair id da url
              const parts = item.url.split('/').filter(Boolean);
              const id = parts[parts.length - 1];
              return await pokemonApi.getPokemon(id);
            } catch (e) {
              console.error('Erro ao buscar Pokémon detalhe:', e);
              return null;
            }
          })
        );

        details.push(...batchDetails.filter(Boolean) as Pokemon[]);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setLoadedGenerations(prev => prev.map(b => b.id === gen.id ? { ...b, pokemons: details, loading: false, error: null } : b));
      
      // Ajustar scroll para que a seção carregada não fique coberta pelo header sticky
      setTimeout(() => {
        try {
          const el = document.getElementById(`generation-${gen.id}`);
          if (el) {
            const header = document.querySelector('header');
            const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
            const rect = el.getBoundingClientRect();
            const offsetTop = rect.top + window.scrollY - headerHeight - 12; // pequeno espaçamento
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        } catch (e) {
          console.warn('Scroll adjustment failed', e);
        }
      }, 100);
    } catch (err: any) {
      console.error('Erro ao carregar geração:', err);
      setLoadedGenerations(prev => prev.map(b => b.id === gen.id ? { ...b, loading: false, error: 'Erro ao carregar geração' } : b));
    } finally {
      // remover marcação de progresso
      loadingGenRef.current.delete(genId);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    if (loadedGenerations.length === 0) {
      loadGeneration(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Se o usuário selecionar uma geração via header, garantir que ela seja carregada
  useEffect(() => {
    if (selectedGeneration && !loadedGenerations.some(g => g.id === selectedGeneration)) {
      loadGeneration(selectedGeneration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGeneration]);

  // Se o usuário selecionar apenas um tipo (sem geração e sem busca), carregar todos do tipo
  useEffect(() => {
    const shouldLoadType = selectedType && !selectedGeneration && !searchTerm;
    if (!shouldLoadType) return;
    // evitar reentrada
    if (loadingTypeRef.current) return;

    const loadType = async (typeName: string) => {
      try {
        loadingTypeRef.current = true;
        setGlobalLoading(true);

        // buscar lista por tipo
        const typeResponse = await pokemonApi.getPokemonByType(typeName);
        const entries: Array<{ pokemon: { name: string; url: string } }> = (typeResponse as any).pokemon || [];

        const batchSize = 30;
        const details: Pokemon[] = [];

        for (let i = 0; i < entries.length; i += batchSize) {
          const batch = entries.slice(i, i + batchSize);
          const batchDetails = await Promise.all(
            batch.map(async (item) => {
              try {
                const parts = item.pokemon.url.split('/').filter(Boolean);
                const id = parts[parts.length - 1];
                return await pokemonApi.getPokemon(id);
              } catch (e) {
                console.error('Erro ao buscar Pokémon detalhe (type):', e);
                return null;
              }
            })
          );

          details.push(...batchDetails.filter(Boolean) as Pokemon[]);
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // substituir bloco carregado pelas gerações anteriores com o bloco do tipo
        setLoadedGenerations([{ id: TYPE_BLOCK_ID, name: `Tipo: ${typeName}`, pokemons: details, loading: false, error: null }]);
      } catch (err) {
        console.error('Erro ao carregar Pokémon por tipo:', err);
        setLoadedGenerations([{ id: TYPE_BLOCK_ID, name: `Tipo: ${selectedType}`, pokemons: [], loading: false, error: 'Erro ao carregar tipo' }]);
      } finally {
        loadingTypeRef.current = false;
        setGlobalLoading(false);
      }
    };

    loadType(selectedType as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedGeneration, searchTerm]);

  const handleLoadNextGeneration = () => {
    const lastLoadedId = loadedGenerations.length ? loadedGenerations[loadedGenerations.length - 1].id : 0;
    const nextGen = generations.find(g => g.id === lastLoadedId + 1);
    if (nextGen) loadGeneration(nextGen.id);
  };

  const applyFilters = (pokemons: Pokemon[]) => {
    return pokemons.filter(p => {
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm) ||
        p.id.toString().padStart(3, '0').includes(searchTerm);

      const matchesType = !selectedType || p.types.some(t => t.type.name.toLowerCase() === selectedType.toLowerCase());

      return matchesSearch && matchesType;
    });
  };

  return (
    <div>
      <div className="mb-6">
        {/* Mostrar apenas as gerações visíveis (filtradas pela seleção) */}
        {(() => {
          const visibleGens = loadedGenerations.filter(g => !selectedGeneration || g.id === selectedGeneration);
          const visibleCount = visibleGens.reduce((acc, g) => acc + (applyFilters(g.pokemons).length || 0), 0);
          const isTypeMode = !!selectedType && !selectedGeneration && !searchTerm;

          if (isTypeMode) {
            return (
              <p className="text-gray-600">Mostrando {visibleCount} Pokémon{selectedType ? ` — Tipo: ${selectedType}` : ''}</p>
            );
          }

          const gensText = visibleGens.length === 1 ? '1 geração' : `${visibleGens.length} gerações`;
          return (
            <p className="text-gray-600">Mostrando {visibleCount} Pokémon em {gensText}</p>
          );
        })()}
      </div>

      <div className="space-y-10">
        {loadedGenerations
          .filter(gen => !selectedGeneration || gen.id === selectedGeneration)
          .map((gen) => (
          <section id={`generation-${gen.id}`} key={gen.id} className="bg-white p-4 rounded-lg shadow-sm">
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{gen.name}</h2>
              <span className="text-sm text-gray-500">{applyFilters(gen.pokemons).length} Pokémon</span>
            </header>

            {gen.loading && (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="text-gray-600">Carregando geração...</span>
              </div>
            )}

            {gen.error && (
              <div className="text-red-500">{gen.error}</div>
            )}

            {!gen.loading && gen.pokemons.length === 0 && !gen.error && (
              <div className="text-gray-500">Nenhum Pokémon disponível para essa geração.</div>
            )}

            {!gen.loading && gen.pokemons.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {applyFilters(gen.pokemons).map(p => (
                  <PokemonCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    image={p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default}
                    types={p.types.map(t => t.type.name)}
                    onClick={onPokemonClick}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Botão para carregar a próxima geração - posicionado abaixo das seções */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleLoadNextGeneration}
          disabled={loadedGenerations.length >= generations.length || globalLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {globalLoading ? 'Carregando...' : 'Próxima Geração'}
        </button>
      </div>
    </div>
  );
};

export default PokemonList;