# MyPokédex
Uma Pokédex moderna em React + TypeScript, com Tailwind CSS e integração direta com a [PokeAPI](https://pokeapi.co).

## Destaques
- Lista todas as gerações e filtra por geração ou tipo
- Busca por nome ou número (`#025`)
- Detalhes completos: stats, habilidades, descrição, altura e peso
- Cadeia evolutiva clicável para navegar entre evoluções
- UI responsiva com cache de chamadas à API

## Stack
- React 19 (Vite) + TypeScript
- Tailwind CSS 4
- PokeAPI
- Playwright (script opcional para gravar demo em vídeo)

## Preview
- Deploy: https://mypokedex-seven.vercel.app/

## Como rodar
```bash
git clone https://github.com/MuriloNoguez/Pokedex.git
cd Pokedex
npm install
cp .env.example .env  # use os valores padrão ou ajuste se quiser
npm run dev
```

## Scripts úteis
- `npm run dev` — ambiente de desenvolvimento (Vite)
- `npm run build` — build de produção
- `npm run preview` — pré-visualiza o build
- `npm run lint` — lint em todo o projeto

## Variáveis de ambiente
Copie `.env.example` para `.env` e ajuste se preciso:
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
- `VITE_API_CACHE_DURATION`: cache em ms (300000 = 5 min)
- `VITE_DEFAULT_POKEMON_LIMIT` / `VITE_MAX_POKEMON_SEARCH_RESULTS`: limites de listagem/busca
- `VITE_DEBUG_API_CALLS`: `true` para logar hits de cache e chamadas

---
Feito por Murilo Noguez
