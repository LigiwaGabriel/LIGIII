import { Box, Button, Chip, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import StateMessage from '../components/StateMessage';
import useFetch from '../hooks/useFetch';
import { api, backdropUrl, posterUrl } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

export default function Details() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useWatchlist();
  const validType = type === 'movie' || type === 'tv';

  const { data: item, loading, error, retry } = useFetch(
    (signal) => (validType ? api.details(type, id, signal) : Promise.reject(new Error('Page not found.'))),
    [type, id]
  );

  const saved = item ? isSaved(item) : false;
  const poster = item && posterUrl(item.poster, 'w500');
  const backdrop = item && backdropUrl(item.backdrop);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <StateMessage loading={loading} error={error} onRetry={validType ? retry : undefined} />

      {item && (
        <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper' }}>
          {backdrop && (
            <Box
              aria-hidden
              sx={{
                position: 'absolute', inset: 0, opacity: 0.18,
                backgroundImage: `url(${backdrop})`, backgroundSize: 'cover', backgroundPosition: 'center',
              }}
            />
          )}
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 5 }, p: { xs: 2, md: 4 } }}>
            <Box sx={{ width: { xs: '60%', md: 300 }, maxWidth: 300, alignSelf: { xs: 'center', md: 'flex-start' }, flexShrink: 0 }}>
              {poster ? (
                <Box component="img" src={poster} alt={`${item.title} poster`} sx={{ width: '100%', borderRadius: 2, display: 'block', boxShadow: '0 10px 30px rgba(0,0,0,.6)' }} />
              ) : (
                <Box sx={{ aspectRatio: '2/3', bgcolor: '#1b2030', borderRadius: 2, display: 'grid', placeItems: 'center', color: 'text.secondary' }}>
                  <Box sx={{ textAlign: 'center' }}><ImageNotSupportedIcon /><Typography variant="caption" display="block">No poster</Typography></Box>
                </Box>
              )}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 36 } }}>
                {item.title} {item.year && <Typography component="span" variant="h5" color="text.secondary">({item.year})</Typography>}
              </Typography>
              {item.tagline && <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>{item.tagline}</Typography>}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, my: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon color="primary" />
                  <Typography fontWeight={700}>{item.rating ? item.rating.toFixed(1) : 'N/A'}</Typography>
                  {item.votes > 0 && <Typography variant="caption" color="text.secondary">({item.votes.toLocaleString()} votes)</Typography>}
                </Box>
                <Chip size="small" label={item.type === 'movie' ? 'Movie' : 'TV Show'} />
                {item.date && <Typography variant="body2" color="text.secondary">Released {item.date}</Typography>}
                {item.runtime && <Typography variant="body2" color="text.secondary">{item.runtime} min</Typography>}
                {item.seasons && <Typography variant="body2" color="text.secondary">{item.seasons} season{item.seasons > 1 ? 's' : ''}</Typography>}
              </Box>

              {item.genres.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {item.genres.map((g) => <Chip key={g} label={g} variant="outlined" color="primary" size="small" />)}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Genre not available</Typography>
              )}

              <Typography variant="h6" sx={{ mb: 1 }}>Overview</Typography>
              <Typography sx={{ lineHeight: 1.7, maxWidth: 720 }}>
                {item.overview || 'No overview is available for this title.'}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 4 }}>
                <Button
                  variant={saved ? 'outlined' : 'contained'}
                  startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={() => toggle(item)}
                >
                  {saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
                {item.trailerKey && (
                  <Button
                    variant="outlined" color="inherit" startIcon={<PlayCircleOutlineIcon />}
                    href={`https://www.youtube.com/watch?v=${item.trailerKey}`} target="_blank" rel="noopener noreferrer"
                  >
                    Watch Trailer
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
