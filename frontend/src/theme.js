import { createTheme } from '@mui/material';

// "dark" is the default: a soft midnight-blue background with sunny yellow accents.
export default function makeTheme(mode) {
  const dark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? '#ffd54f' : '#7c4dff' },
      secondary: { main: '#ff6fb5' },
      background: dark
        ? { default: '#1c2238', paper: '#283052' }
        : { default: '#fff7e6', paper: '#ffffff' },
    },
    shape: { borderRadius: 20 },
    typography: {
      fontFamily: '"Fredoka", "Comic Sans MS", system-ui, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: { border: `2px solid ${dark ? '#3a4470' : '#ffe0b2'}`, backgroundImage: 'none' },
        },
      },
      MuiButton: { styleOverrides: { root: { borderRadius: 999 } } },
    },
  });
}
