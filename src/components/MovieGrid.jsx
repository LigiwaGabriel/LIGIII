import { Box } from '@mui/material';
import MovieCard from './MovieCard';

// Responsive poster grid: 2 columns on phones up to 6 on large desktops.
export default function MovieGrid({ items }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 1.5, sm: 2.5 },
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          md: 'repeat(4, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
          xl: 'repeat(6, minmax(0, 1fr))',
        },
      }}
    >
      {items.map((item) => (
        <MovieCard key={`${item.type}-${item.id}`} item={item} fluid />
      ))}
    </Box>
  );
}
