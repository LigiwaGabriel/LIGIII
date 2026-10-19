import { Box, Typography } from '@mui/material';
import MovieRow from '../components/MovieRow';
import { api } from '../api/tmdb';

export default function Home() {
  return (
    <Box>
      <Box
        sx={{
          mb: 4, p: { xs: 3, md: 5 }, borderRadius: 3,
          background: 'linear-gradient(120deg, #1d2336 0%, #2b1d3a 55%, #3a2a12 100%)',
        }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 36 } }}>
          Discover your next favourite watch
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
          Browse trending movies and TV shows, search any title and build your own watchlist.
        </Typography>
      </Box>

      <MovieRow title="Trending This Week" loader={(s) => api.trending(s)} />
      <MovieRow title="Popular Movies" loader={(s) => api.movies('popular', {}, s)} />
      <MovieRow title="Action Movies" loader={async (s) => (await api.discover('movie', { with_genres: 28, sort_by: 'popularity.desc' }, s)).items} />
      <MovieRow title="Popular TV Shows" loader={(s) => api.tv('popular', {}, s)} />
      <MovieRow title="Top Rated Movies" loader={(s) => api.movies('top_rated', {}, s)} />
    </Box>
  );
}
