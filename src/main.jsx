import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App.jsx';
import theme from './theme';
import { WatchlistProvider } from './context/WatchlistContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
