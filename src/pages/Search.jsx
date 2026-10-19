import { useEffect, useState } from 'react';
import { Box, Pagination, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import StateMessage from '../components/StateMessage';
import useFetch from '../hooks/useFetch';
import { api } from '../api/tmdb';

export default function Search() {
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim();
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query]);

  const { data, loading, error, retry } = useFetch(
    (signal) => (query ? api.search(query, page, signal) : Promise.resolve({ items: [], totalPages: 1 })),
    [query, page]
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontSize: { xs: 24, md: 32 } }}>
        {query ? <>Results for “{query}”</> : 'Search'}
      </Typography>
      {!query && <StateMessage empty emptyText="Type a title in the search box above." />}
      {query && (
        <StateMessage
          loading={loading} error={error} onRetry={retry}
          empty={!loading && !error && data?.items.length === 0}
          emptyText={`No matches found for “${query}”. Try a different title.`}
        />
      )}
      {query && !loading && !error && data?.items.length > 0 && (
        <>
          <MovieGrid items={data.items} />
          {data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination count={data.totalPages} page={page} color="primary" siblingCount={0} onChange={(_, p) => setPage(p)} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
