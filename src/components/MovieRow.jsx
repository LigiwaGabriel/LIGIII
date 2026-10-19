import { Box, Typography } from '@mui/material';
import MovieCard from './MovieCard';
import StateMessage from './StateMessage';
import useFetch from '../hooks/useFetch';

// A horizontally scrolling section (e.g. "Trending Now") that loads its own data.
export default function MovieRow({ title, loader }) {
  const { data, loading, error, retry } = useFetch(loader, []);
  return (
    <Box component="section" sx={{ mb: 4 }} aria-label={title}>
      <Typography variant="h5" sx={{ mb: 1.5 }}>{title}</Typography>
      <StateMessage loading={loading} error={error} onRetry={retry} empty={!loading && !error && !data?.length} />
      {data?.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1.5, pt: 1, px: 0.5, scrollSnapType: 'x proximity' }}>
          {data.map((item) => (
            <Box key={`${item.type}-${item.id}`} sx={{ scrollSnapAlign: 'start' }}>
              <MovieCard item={item} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
