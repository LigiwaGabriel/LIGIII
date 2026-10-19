# LIGIIIII – Movie & TV Discovery App

A responsive, MovieBox-inspired discovery website built with React. Users can browse trending and popular titles, search, filter by genre, read details and keep a personal watchlist that survives page refreshes.

> Course: Web and Mobile Application Development – Practical Assignment (Movie Discovery Web Application)

## Screenshots

Add at least two screenshots to a `screenshots/` folder and link them here:

- `screenshots/home.png` – homepage
- `screenshots/details.png` – movie / TV details view

## Features

- **Homepage** with a top bar, search field, sidebar navigation and five poster rows (Trending, Popular Movies, Action Movies, Popular TV Shows, Top Rated Movies)
- **Live data** from the TMDB API (nothing is hardcoded)
- **Search** by title (movies and TV shows) with loading, empty and error states
- **Details page** with poster, overview, release date, rating, genres, runtime/seasons and trailer link
- **Movies** and **TV Shows** pages with a working **genre filter**, **sorting** (popularity, rating, newest) and **pagination**
- **My Watchlist** – add / remove titles, stored in `localStorage`
- **Responsive**: sidebar on desktop, slide-out menu on tablet/mobile, poster grid from 2 to 6 columns
- Handles missing posters, missing descriptions, missing ratings and API failures (with a retry button)

## Technologies

- React 19 (JavaScript / JSX) created with Vite
- Material UI (`@mui/material`, `@mui/icons-material`) with a custom dark theme
- React Router (`react-router-dom`)
- `fetch` with `AbortController` for API calls
- `useState`, `useEffect`, `useContext` and a custom `useFetch` hook

## API used

[The Movie Database (TMDB) API v3](https://developer.themoviedb.org/docs). Endpoints used: `trending`, `movie/popular`, `movie/top_rated`, `tv/popular`, `discover/movie`, `discover/tv`, `genre/{type}/list`, `search/multi`, `movie/{id}` and `tv/{id}`.

## Run locally

Requirements: Node.js 18+ and a free TMDB API key (create an account at themoviedb.org, then Settings → API).

```bash
git clone <your-repository-url>
cd LIGIIIII
npm install
cp .env.example .env      # then paste your key into .env
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

`.env` contents:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

`.env` is listed in `.gitignore` and must never be committed. Only `.env.example` (placeholder values) is in the repository.

### Note on the API key

Vite embeds `VITE_` variables in the built JavaScript, so a TMDB key used directly from the browser can be viewed by visitors. TMDB v3 keys are free and read-only, which is why this is the usual approach for frontend-only apps, but the key is kept out of Git and set as an environment variable on the host. If you want it fully hidden, put a small serverless proxy (e.g. a Vercel function) between the app and TMDB.

## Build and deploy

```bash
npm run build     # outputs to dist/
npm run preview   # test the production build locally
```

**Vercel:** import the repository, add the environment variable `VITE_TMDB_API_KEY`, deploy. `vercel.json` rewrites all paths to `index.html` so React Router URLs work on refresh.

**Netlify:** build command `npm run build`, publish directory `dist`, add `VITE_TMDB_API_KEY` under Site settings → Environment variables. `public/_redirects` handles the router fallback.

## Project structure

```
src/
  api/tmdb.js                 API helper and data normalisation
  hooks/useFetch.js           loading / error / data hook
  context/WatchlistContext.jsx  watchlist state + localStorage
  components/
    Layout.jsx                AppBar, search, Drawer navigation
    MovieCard.jsx             poster card with hover + watchlist button
    MovieRow.jsx              scrolling row used on the homepage
    MovieGrid.jsx             responsive poster grid
    StateMessage.jsx          loading / error / empty states
  pages/
    Home.jsx  Browse.jsx (Movies & TV)  Search.jsx  Watchlist.jsx  Details.jsx
  theme.js                    Material UI dark theme
```

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Movie and TV data and all poster/backdrop images are provided by [TMDB](https://www.themoviedb.org). Icons by Material UI. Design inspired by MovieBox; the name and branding (LIGIIIII) are original.
