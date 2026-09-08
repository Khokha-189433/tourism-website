import { createTheme } from '@mui/material/styles';

const createAppTheme = (direction = 'rtl') => createTheme({
  direction,
  palette: {
    primary: {
      main: '#0277bd', // أزرق بحري (ثقافة/سياحة)
      light: '#58a5f0',
      dark: '#004c8c',
    },
    secondary: {
      main: '#f9a825', // ذهبي (فخامة)
      light: '#ffd95a',
      dark: '#c17900',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Cairo", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default createAppTheme;