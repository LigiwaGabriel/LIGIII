import { Box, Card, CardActionArea, IconButton, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { posterUrl } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({ item, fluid = false }) {
  const { isSaved, toggle } = useWatchlist();
  const saved = isSaved(item);
  const src = posterUrl(item.poster);

  return (
    <Card
      sx={{
        position: 'relative',
        width: fluid ? '100%' : { xs: 130, sm: 160, md: 180 },
        flexShrink: 0,
        bgcolor: 'background.paper',
        transition: 'transform .2s ease, box-shadow .2s ease',
        '&:hover, &:focus-within': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: '0 12px 28px rgba(0,0,0,.6)',
        },
        '&:hover .overlay, &:focus-within .overlay': { opacity: 1 },
      }}
    >
      <CardActionArea component={RouterLink} to={`/${item.type}/${item.id}`} aria-label={`View details for ${item.title}`}>
        <Box sx={{ aspectRatio: '2 / 3', bgcolor: '#1b2030', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {src ? (
            <Box
              component="img"
              src={src}
              alt={`${item.title} poster`}
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Box sx={{ textAlign: 'center', p: 1, color: 'text.secondary' }}>
              <ImageNotSupportedIcon />
              <Typography variant="caption" display="block">No poster</Typography>
            </Box>
          )}
        </Box>
        <Box
          className="overlay"
          sx={{
            position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .2s',
            background: 'linear-gradient(to top, rgba(0,0,0,.9) 5%, rgba(0,0,0,0) 60%)',
            display: 'flex', alignItems: 'flex-end', p: 1.2, pointerEvents: 'none',
          }}
        >
          <Typography variant="caption" sx={{ lineHeight: 1.3 }}>
            {item.overview ? `${item.overview.slice(0, 80)}…` : 'No description available.'}
          </Typography>
        </Box>
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" noWrap fontWeight={600} title={item.title}>
            {item.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <StarIcon sx={{ fontSize: 14, color: 'primary.main' }} />
            <Typography variant="caption">
              {item.rating ? item.rating.toFixed(1) : 'N/A'}
            </Typography>
            <Typography variant="caption" sx={{ ml: 'auto' }}>
              {item.year || '—'}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
      <IconButton
        size="small"
        onClick={() => toggle(item)}
        aria-label={saved ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`}
        sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(0,0,0,.6)', '&:hover': { bgcolor: 'rgba(0,0,0,.85)' } }}
      >
        {saved ? <BookmarkIcon color="primary" fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
      </IconButton>
    </Card>
  );
}
