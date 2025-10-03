import React from 'react';

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
  types: string[];
  onClick?: (id: number) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id, name, image, types, onClick }) => {
  const formatId = (id: number) => `#${id.toString().padStart(3, '0')}`;
  
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

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer p-6 text-center transform hover:scale-105"
      onClick={() => onClick?.(id)}
    >
      <div className="mb-3">
        <span className="text-sm text-gray-500 font-medium">{formatId(id)}</span>
      </div>
      
      <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-44 h-44 object-contain hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-3 capitalize text-lg">
        {name}
      </h3>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {types.map((type) => (
          <span
            key={type}
            className={`px-3 py-1 rounded-md text-white text-sm font-medium ${getTypeColor(type)}`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;