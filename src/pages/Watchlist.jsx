import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import StateMessage from '../components/StateMessage';
import { useWatchlist } from '../context/WatchlistContext';

export default function Watchlist() {
  const { items } = useWatchlist();
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontSize: { xs: 26, md: 34 } }}>
        My Watchlist {items.length > 0 && <Typography component="span" color="text.secondary">({items.length})</Typography>}
      </Typography>
      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center' }}>
          <StateMessage empty emptyText="Your watchlist is empty. Tap the bookmark icon on any poster to save it." />
          <Button variant="contained" component={RouterLink} to="/">Browse titles</Button>
        </Box>
      ) : (
        <MovieGrid items={items} />
      )}
    </Box>
  );
}
