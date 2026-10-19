import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Details from './pages/Details';

function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Page not found</Typography>
      <Button variant="contained" component={RouterLink} to="/">Go home</Button>
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="movies" element={<Browse type="movie" />} />
        <Route path="tv" element={<Browse type="tv" />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="search" element={<Search />} />
        <Route path=":type/:id" element={<Details />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
