# Pokédex Header Component

## 📱 Sobre a PokéAPI

A **PokéAPI** (https://pokeapi.co/) é uma API RESTful gratuita que contém dados abrangentes sobre Pokémon. Ela cobre:

### 🎮 Gerações Disponíveis:
- **Geração I (Kanto)** - Pokémon #001-151 (Red, Blue, Yellow)
- **Geração II (Johto)** - Pokémon #152-251 (Gold, Silver, Crystal)
- **Geração III (Hoenn)** - Pokémon #252-386 (Ruby, Sapphire, Emerald)
- **Geração IV (Sinnoh)** - Pokémon #387-493 (Diamond, Pearl, Platinum)
- **Geração V (Unova)** - Pokémon #494-649 (Black, White)
- **Geração VI (Kalos)** - Pokémon #650-721 (X, Y)
- **Geração VII (Alola)** - Pokémon #722-809 (Sun, Moon)
- **Geração VIII (Galar)** - Pokémon #810-905 (Sword, Shield)
- **Geração IX (Paldea)** - Pokémon #906+ (Scarlet, Violet)

**Total: 1000+ Pokémon** com atualizações constantes!

### 🔗 Principais Endpoints:
```
GET https://pokeapi.co/api/v2/pokemon/{id-or-name}
GET https://pokeapi.co/api/v2/pokemon-species/{id}
GET https://pokeapi.co/api/v2/generation/{id}
GET https://pokeapi.co/api/v2/type/{name}
```

## 🎨 Header Component

O header que criei inclui:

### ✨ Funcionalidades:
- **🔍 Busca inteligente** - Por nome ou número do Pokémon
- **🎮 Filtro por geração** - Todas as 9 gerações
- **⚡ Filtro por tipo** - Todos os 18 tipos
- **🎯 Logo animada** - Pokébola interativa
- **📱 Design responsivo** - Mobile-first
- **🎭 Animações suaves** - Micro-interações

### 🛠️ Como usar:

```tsx
import Header from './components/header';

function App() {
  const handleSearch = (term: string) => {
    console.log('Buscando:', term);
  };

  const handleFilterByGeneration = (gen: number | null) => {
    console.log('Filtrando por geração:', gen);
  };

  const handleFilterByType = (type: string | null) => {
    console.log('Filtrando por tipo:', type);
  };

  return (
    <Header 
      onSearch={handleSearch}
      onFilterByGeneration={handleFilterByGeneration}
      onFilterByType={handleFilterByType}
    />
  );
}
```

### 🎨 Customização:

O CSS está em `Header.css` e inclui:
- Gradiente customizável
- Cores dos tipos de Pokémon
- Animações da Pokébola
- Responsividade completa

### 📊 Estados do componente:
- `searchTerm` - Termo de busca atual
- `selectedGeneration` - Geração selecionada
- `selectedType` - Tipo selecionado

### 🔧 Props disponíveis:
```tsx
interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
  onFilterByGeneration?: (generation: number | null) => void;
  onFilterByType?: (type: string | null) => void;
}
```

## 🚀 Próximos passos:

1. **Implementar a busca real** usando `pokemonApi.searchPokemonByName()`
2. **Criar componentes de cards** para exibir os Pokémon
3. **Adicionar paginação** para grandes listas
4. **Implementar cache** para melhorar performance
5. **Adicionar favoritos** com localStorage

## 📁 Estrutura criada:
```
src/
├── components/
│   ├── header.tsx        # Componente do header
│   └── Header.css        # Estilos do header
├── types/
│   └── pokemon.ts        # Definições de tipos TypeScript
├── utils/
│   └── api.ts           # Funções da API e utilitários
└── App.tsx              # Aplicação principal atualizada
```

Agora você tem um header completo e funcional para sua Pokédex! 🎉