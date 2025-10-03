import { useState } from 'react'
import Header from './components/header'
import PokemonList from './components/PokemonList'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilterByGeneration = (generation: number | null) => {
    setSelectedGeneration(generation)
  }

  const handleFilterByType = (type: string | null) => {
    setSelectedType(type)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        onSearch={handleSearch}
        onFilterByGeneration={handleFilterByGeneration}
        onFilterByType={handleFilterByType}
      />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Display dos filtros ativos */}
          {(searchTerm || selectedGeneration || selectedType) && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md text-center">
              {searchTerm && (
                <p className="text-gray-600">
                  Buscando por: <span className="font-semibold">{searchTerm}</span>
                </p>
              )}
              {selectedGeneration && (
                <p className="text-gray-600">
                  Geração: <span className="font-semibold">{selectedGeneration}</span>
                </p>
              )}
              {selectedType && (
                <p className="text-gray-600">
                  Tipo: <span className="font-semibold capitalize">{selectedType}</span>
                </p>
              )}
            </div>
          )}
          
          {/* Lista de Pokémon */}
          <PokemonList 
            searchTerm={searchTerm}
            selectedGeneration={selectedGeneration}
            selectedType={selectedType}
          />
        </div>
      </main>
    </div>
  )
}

export default App
