import { useState } from 'react'
import Header from './components/header'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    console.log('Searching for:', term)
  }

  const handleFilterByGeneration = (generation: number | null) => {
    setSelectedGeneration(generation)
    console.log('Filtering by generation:', generation)
  }

  const handleFilterByType = (type: string | null) => {
    setSelectedType(type)
    console.log('Filtering by type:', type)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        onSearch={handleSearch}
        onFilterByGeneration={handleFilterByGeneration}
        onFilterByType={handleFilterByType}
      />
      
      <main className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Bem-vindo à sua Pokédex!
          </h2>
          
          {/* Display dos filtros ativos */}
          {(searchTerm || selectedGeneration || selectedType) && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
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
                  Tipo: <span className="font-semibold">{selectedType}</span>
                </p>
              )}
            </div>
          )}
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              🔄 Lista de Pokémon virá aqui
            </h3>
            <p className="text-gray-600">
              Use os filtros do header para buscar e filtrar Pokémon!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
