import { Box, Button, CircularProgress, Typography } from '@mui/material';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

// One component for the three non-happy states: loading, error and empty.
export default function StateMessage({ loading, error, empty, emptyText = 'Nothing to show here yet.', onRetry }) {
  if (loading) {
    return (
      <Box role="status" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" aria-label="Loading" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box role="alert" sx={{ textAlign: 'center', py: 8 }}>
        <ErrorOutlinedIcon color="error" sx={{ fontSize: 48 }} />
        <Typography sx={{ mt: 1, mb: 2 }}>{error}</Typography>
        {onRetry && (
          <Button variant="outlined" onClick={onRetry}>
            Try again
          </Button>
        )}
      </Box>
    );
  }
  if (empty) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <MovieFilterIcon sx={{ fontSize: 48 }} />
        <Typography sx={{ mt: 1 }}>{emptyText}</Typography>
      </Box>
    );
  }
  return null;
}
