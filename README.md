# Pokedex

> Uma Pokédex moderna feita com React, TypeScript, Tailwind CSS e integração com a [PokeAPI](https://pokeapi.co). Projeto de portfólio.

## Tecnologias

- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **PokeAPI**

## Funcionalidades

- Listagem de Pokémons 
- Busca por nome ou número
- Filtros por geração e tipo
- Visualização de detalhes completos (stats, habilidades, descrição, altura, peso)
- Exibição da cadeia evolutiva
- Interface responsiva e rápida

## Demonstração

O deploy esta disponível em:

👉 [Acessar Pokédex](https://mypokedex-seven.vercel.app/)

## Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/MuriloNoguez/Pokedex.git
   ```
2. **Instale as dependências:**
   ```bash
   cd pokedex
   npm install
   ```
3. **Configure o arquivo `.env`:**
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Ajuste as variáveis se necessário (por padrão já funciona com a PokeAPI pública).
4. **Rode o projeto:**
   ```bash
   npm run dev
   ```

## Estrutura do .env

Use o `.env` para ajustar comportamento sem mexer no código. Valores recomendados:

```env
VITE_POKEMON_API_BASE_URL=https://pokeapi.co/api/v2
VITE_API_CACHE_DURATION=300000
VITE_DEFAULT_POKEMON_LIMIT=20
VITE_MAX_POKEMON_SEARCH_RESULTS=50
VITE_DEBUG_API_CALLS=false
VITE_APP_NAME=MyPokedex
VITE_APP_VERSION=1.0.0
VITE_ENABLE_FAVORITES=false
VITE_ENABLE_ADVANCED_SEARCH=false
VITE_ENABLE_ANALYTICS=false
```

- `VITE_API_CACHE_DURATION`: cache (ms) das respostas da PokeAPI (300000 = 5 min)
- `VITE_DEFAULT_POKEMON_LIMIT`: limite padrão para listagens
- `VITE_MAX_POKEMON_SEARCH_RESULTS`: máximo de itens retornados em buscas
- `VITE_DEBUG_API_CALLS`: `true` para logar hits de cache e requisições
- `VITE_ENABLE_*`: toggles opcionais para futuras features (mantém desligado por padrão)

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento

---

Feito por Murilo Noguez
