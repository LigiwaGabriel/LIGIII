// Thin wrapper around the TMDB REST API (v3).
// The key comes from an environment variable and is never committed to Git.
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const IMG_BASE = 'https://image.tmdb.org/t/p';

export const posterUrl = (path, size = 'w342') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const backdropUrl = (path, size = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export async function tmdb(path, params = {}, signal) {
  if (!API_KEY) {
    throw new Error(
      'Missing API key. Create a .env file with VITE_TMDB_API_KEY (see .env.example).'
    );
  }
  const query = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });
  const res = await fetch(`${BASE_URL}${path}?${query}`, { signal });
  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? 'Invalid API key. Check VITE_TMDB_API_KEY.'
        : `Request failed (${res.status}). Please try again.`
    );
  }
  return res.json();
}

// Normalise movie and TV results into one shape so components stay simple.
export function normalise(item, fallbackType) {
  const type = item.media_type || fallbackType || (item.title ? 'movie' : 'tv');
  const date = item.release_date || item.first_air_date || '';
  return {
    id: item.id,
    type,
    title: item.title || item.name || 'Untitled',
    poster: item.poster_path || null,
    backdrop: item.backdrop_path || null,
    overview: item.overview || '',
    year: date ? date.slice(0, 4) : '',
    date,
    rating: typeof item.vote_average === 'number' ? item.vote_average : null,
    votes: item.vote_count || 0,
    genres: item.genres ? item.genres.map((g) => g.name) : [],
    genreIds: item.genre_ids || [],
  };
}

const list = (data, type) =>
  (data.results || [])
    .filter((r) => r.media_type !== 'person')
    .map((r) => normalise(r, type));

export const api = {
  async trending(signal) {
    return list(await tmdb('/trending/all/week', {}, signal));
  },
  async movies(endpoint, params, signal) {
    return list(await tmdb(`/movie/${endpoint}`, params, signal), 'movie');
  },
  async tv(endpoint, params, signal) {
    return list(await tmdb(`/tv/${endpoint}`, params, signal), 'tv');
  },
  async discover(type, params, signal) {
    const data = await tmdb(`/discover/${type}`, params, signal);
    return { items: list(data, type), totalPages: Math.min(data.total_pages || 1, 500) };
  },
  async genres(type, signal) {
    const data = await tmdb(`/genre/${type}/list`, {}, signal);
    return data.genres || [];
  },
  async search(query, page, signal) {
    const data = await tmdb('/search/multi', { query, page, include_adult: false }, signal);
    return { items: list(data), totalPages: Math.min(data.total_pages || 1, 500) };
  },
  async details(type, id, signal) {
    const data = await tmdb(`/${type}/${id}`, { append_to_response: 'videos' }, signal);
    const item = normalise(data, type);
    const trailer = (data.videos?.results || []).find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer'
    );
    return {
      ...item,
      tagline: data.tagline || '',
      runtime: data.runtime || (data.episode_run_time && data.episode_run_time[0]) || null,
      seasons: data.number_of_seasons || null,
      trailerKey: trailer ? trailer.key : null,
    };
  },
};
