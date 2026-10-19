import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f5b301' },
    secondary: { main: '#ff5a5f' },
    background: { default: '#0b0d12', paper: '#141821' },
    text: { primary: '#f2f4f8', secondary: '#9aa3b2' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, system-ui, sans-serif',
    h5: { fontWeight: 700 },
    h4: { fontWeight: 800 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { overflowX: 'hidden' },
        '*::-webkit-scrollbar': { height: 8, width: 8 },
        '*::-webkit-scrollbar-thumb': { background: '#2a3040', borderRadius: 8 },
      },
    },
  },
});

export default theme;
