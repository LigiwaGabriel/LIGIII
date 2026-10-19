import { useEffect, useState } from 'react';
import { Box, Chip, MenuItem, Pagination, TextField, Typography } from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import StateMessage from '../components/StateMessage';
import useFetch from '../hooks/useFetch';
import { api } from '../api/tmdb';

const SORTS = [
  { value: 'popularity.desc', label: 'Most popular' },
  { value: 'vote_average.desc', label: 'Highest rated' },
  { value: 'date.desc', label: 'Newest first' },
];

// Shared page for both "Movies" and "TV Shows": genre filter, sorting and pagination.
export default function Browse({ type }) {
  const [genre, setGenre] = useState(null);
  const [sort, setSort] = useState('popularity.desc');
  const [page, setPage] = useState(1);
  const heading = type === 'movie' ? 'Movies' : 'TV Shows';

  // Reset filters when switching between Movies and TV Shows.
  useEffect(() => {
    setGenre(null);
    setSort('popularity.desc');
    setPage(1);
  }, [type]);

  const genres = useFetch((s) => api.genres(type, s), [type]);

  const { data, loading, error, retry } = useFetch(
    (signal) => {
      const dateField = type === 'movie' ? 'primary_release_date' : 'first_air_date';
      const sortBy = sort === 'date.desc' ? `${dateField}.desc` : sort;
      const params = { page, sort_by: sortBy };
      if (genre) params.with_genres = genre;
      // Avoid sorting by rating or date with almost no votes / unreleased titles.
      if (sort === 'vote_average.desc') params['vote_count.gte'] = 300;
      if (sort === 'date.desc') {
        params[`${dateField}.lte`] = new Date().toISOString().slice(0, 10);
        params['vote_count.gte'] = 20;
      }
      return api.discover(type, params, signal);
    },
    [type, genre, sort, page]
  );

  const pick = (id) => {
    setGenre(id === genre ? null : id);
    setPage(1);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: 26, md: 34 } }}>{heading}</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
        <TextField
          select size="small" label="Sort by" value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          sx={{ minWidth: 170 }}
        >
          {SORTS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }} role="group" aria-label="Filter by genre">
        <Chip label="All" color={genre === null ? 'primary' : 'default'} onClick={() => pick(null)} />
        {(genres.data || []).map((g) => (
          <Chip key={g.id} label={g.name} color={genre === g.id ? 'primary' : 'default'} onClick={() => pick(g.id)} />
        ))}
      </Box>

      <StateMessage
        loading={loading} error={error} onRetry={retry}
        empty={!loading && !error && data?.items.length === 0}
        emptyText="No titles match this filter."
      />
      {!loading && data?.items.length > 0 && (
        <>
          <MovieGrid items={data.items} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={data.totalPages} page={page} color="primary"
              siblingCount={0} boundaryCount={1}
              onChange={(_, p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
