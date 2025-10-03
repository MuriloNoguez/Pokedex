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

👉 [Acessar Pokédex na Vercel](#)

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

O arquivo `.env` controla configurações como URL da API, Exemplo:

```env
VITE_POKEMON_API_BASE_URL=https://pokeapi.co/api/v2
```

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento

---

Feito por Murilo Noguez