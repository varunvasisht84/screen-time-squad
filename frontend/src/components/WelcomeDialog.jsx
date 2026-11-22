import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Shown every time the app opens; the viewer closes it to start the demo.
export default function WelcomeDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      aria-labelledby="welcome-title"
      PaperProps={{ sx: { borderRadius: 5, textAlign: 'center', p: 1 } }}>
      <IconButton onClick={onClose} aria-label="Close" sx={{ position: 'absolute', top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{ fontSize: 64, lineHeight: 1 }}>📵</Box>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mt: 2, fontSize: 14 }}>
          Demo of the
        </Typography>
        <Typography id="welcome-title" variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          <Box component="span" sx={{ color: 'primary.main' }}>Capstone:</Box> Screen Time App
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          by <b>Viaan Vasisht</b>
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button variant="contained" size="large" onClick={onClose} sx={{ px: 5, fontSize: 18 }}>
          🚀 Start the demo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
