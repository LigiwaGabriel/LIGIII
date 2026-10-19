import { useEffect, useState } from 'react';
import {
  AppBar, Badge, Box, Drawer, IconButton, InputAdornment, List, ListItemButton, ListItemIcon,
  ListItemText, TextField, Toolbar, Typography, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useWatchlist } from '../context/WatchlistContext';

const DRAWER_WIDTH = 220;

const NAV = [
  { label: 'Home', to: '/', icon: <HomeIcon /> },
  { label: 'Movies', to: '/movies', icon: <MovieIcon /> },
  { label: 'TV Shows', to: '/tv', icon: <TvIcon /> },
  { label: 'My Watchlist', to: '/watchlist', icon: <BookmarkIcon /> },
];

export default function Layout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { items } = useWatchlist();
  const [text, setText] = useState(params.get('q') || '');

  // Close the mobile drawer after navigating, and keep the box in sync with the URL.
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (location.pathname === '/search') setText(params.get('q') || '');
  }, [location.pathname, params]);

  const submit = (e) => {
    e.preventDefault();
    const q = text.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const drawer = (
    <Box sx={{ pt: 1 }}>
      {!isDesktop && (
        <Typography variant="h6" color="primary" fontWeight={800} sx={{ px: 2, py: 1.5 }}>
          LIGIIIII
        </Typography>
      )}
      <List component="nav" aria-label="Main navigation">
        {NAV.map((n) => (
          <ListItemButton
            key={n.to}
            component={NavLink}
            to={n.to}
            end={n.to === '/'}
            sx={{
              mx: 1, borderRadius: 2, mb: 0.5,
              '&.active': { bgcolor: 'rgba(245,179,1,.14)', color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {n.to === '/watchlist' ? (
                <Badge badgeContent={items.length} color="secondary" max={99}>{n.icon}</Badge>
              ) : n.icon}
            </ListItemIcon>
            <ListItemText primary={n.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" color="default" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: '1px solid #232a3a' }}>
        <Toolbar sx={{ gap: 1 }}>
          {!isDesktop && (
            <IconButton edge="start" onClick={() => setOpen(true)} aria-label="Open navigation menu">
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6" component={NavLink} to="/"
            sx={{ color: 'primary.main', fontWeight: 800, textDecoration: 'none', letterSpacing: 0.5, mr: { md: 4 } }}
          >
            🎬 LIGIIIII
          </Typography>
          <Box component="form" onSubmit={submit} role="search" sx={{ flexGrow: 1, maxWidth: 520, ml: 'auto', mr: { md: 'auto' } }}>
            <TextField
              fullWidth size="small" value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Search movies & TV shows"
              inputProps={{ 'aria-label': 'Search movies and TV shows' }}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>),
                sx: { borderRadius: 8, bgcolor: '#0b0d12' },
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop || open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isDesktop ? DRAWER_WIDTH : 0, flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: 'background.paper', borderRight: '1px solid #232a3a' },
        }}
      >
        {isDesktop && <Toolbar />}
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Outlet />
        <Box component="footer" sx={{ mt: 6, pt: 2, borderTop: '1px solid #232a3a', color: 'text.secondary', fontSize: 12 }}>
          This product uses the TMDB API but is not endorsed or certified by TMDB. Movie data and images courtesy of TMDB.
        </Box>
      </Box>
    </Box>
  );
}
