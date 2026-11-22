import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export const APP_NAME = 'Screen Time Squad';

export default function Header({ mode, onToggleMode }) {
  return (
    <AppBar position="sticky" elevation={0} sx={{
      bgcolor: 'background.paper', color: 'text.primary',
      borderBottom: '4px solid',
      borderImage: 'linear-gradient(90deg,#ff6fb5,#ffd54f,#4dd0e1,#7c4dff) 1',
    }}>
      <Toolbar sx={{ gap: 1.5 }}>
        <Box sx={{ fontSize: 36 }}>📵</Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            <Box component="span" sx={{ color: 'primary.main' }}>Capstone:</Box> {APP_NAME}
          </Typography>
          <Typography variant="body2" color="text.secondary">We reward you for living your life. 🌈</Typography>
        </Box>
        <Tooltip title={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          <IconButton onClick={onToggleMode} color="primary" size="large"
            aria-label="Switch theme" sx={{ border: '2px solid', borderColor: 'divider' }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
