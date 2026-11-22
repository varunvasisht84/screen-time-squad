import { useMemo } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import { keyframes } from '@emotion/react';

const fall = keyframes`
  from { transform: translateY(-10vh) rotate(0deg); }
  to   { transform: translateY(110vh) rotate(360deg); }
`;

// Emoji rain + a pop-up message (sticker earned, reward redeemed).
export default function Celebration({ emoji, message, onDone }) {
  const pieces = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 1.5,
      emoji: ['🎉', '⭐', '🌟', '🥳', '🎈', emoji][i % 6],
    })),
    [emoji]
  );

  return (
    <>
      <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 2000 }}>
        {pieces.map((p, i) => (
          <Box key={i} sx={{
            position: 'absolute', top: 0, left: `${p.left}%`, fontSize: 32,
            transform: 'translateY(-10vh)',
            animation: `${fall} ${p.duration}s linear ${p.delay}s forwards`,
          }}>
            {p.emoji}
          </Box>
        ))}
      </Box>
      <Snackbar open autoHideDuration={3500} onClose={onDone}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" icon={false} sx={{ fontSize: 20, fontWeight: 600 }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
