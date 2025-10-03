import React, { useState } from 'react';

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
  onFilterByGeneration?: (generation: number | null) => void;
  onFilterByType?: (type: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onFilterByGeneration, 
  onFilterByType 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const generations = [
    { id: 1, name: 'Kanto (I)' },
    { id: 2, name: 'Johto (II)' },
    { id: 3, name: 'Hoenn (III)' },
    { id: 4, name: 'Sinnoh (IV)' },
    { id: 5, name: 'Unova (V)' },
    { id: 6, name: 'Kalos (VI)' },
    { id: 7, name: 'Alola (VII)' },
    { id: 8, name: 'Galar (VIII)' },
    { id: 9, name: 'Paldea (IX)' }
  ];

  const types = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
    'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleGenerationChange = (generation: number | null) => {
    setSelectedGeneration(generation);
    onFilterByGeneration?.(generation);
  };

  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
    onFilterByType?.(type);
  };



  return (
    <header className="bg-gradient-to-r from-red-500 to-blue-500 shadow-lg sticky top-0 z-50 p-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
        
        {/* Logo e Título */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-transparent rounded-full overflow-hidden cursor-pointer hover:animate-spin">
            <img src="pokedex.png" alt="" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            <span className='text-yellow-400'>My</span>Poké<span className="text-yellow-400">dex</span>
          </h1>
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex-1 min-w-80">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Buscar Pokémon... (ex: Pikachu, #025)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-12 rounded-full border-none outline-none text-gray-700 shadow-md focus:shadow-lg transition-shadow"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-white p-2 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
            >
              <img src="./pesquisa.png" alt="Buscar" className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Filtro por Geração */}
          <div className="flex items-center gap-2">
            <label className="text-white font-semibold text-sm">Geração:</label>
            <select
              value={selectedGeneration || ''}
              onChange={(e) => handleGenerationChange(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-1 rounded-lg text-sm border-none outline-none cursor-pointer"
            >
              <option value="">Todas</option>
              {generations.map((gen) => (
                <option key={gen.id} value={gen.id}>
                  {gen.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Tipo */}
          <div className="flex items-center gap-2">
            <label className="text-white font-semibold text-sm">Tipo:</label>
            <select
              value={selectedType || ''}
              onChange={(e) => handleTypeChange(e.target.value || null)}
              className="px-3 py-1 rounded-lg text-sm border-none outline-none cursor-pointer"
            >
              <option value="">Todos</option>
              {types.map((type) => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>


        </div>
      </div>
    </header>
  );
};

export default Header;
