import { Avatar, Box, Chip, Typography } from '@mui/material';

// The team behind the app, always shown in alphabetical order.
const squad = [
  { name: 'Arham', emoji: '🦁' },
  { name: 'Prisha', emoji: '🦄' },
  { name: 'Kainaa', emoji: '🐼' },
  { name: 'Shivaay', emoji: '🐯' },
  { name: 'Viaan', emoji: '🐵' },
].sort((a, b) => a.name.localeCompare(b.name));

export default function SquadBar() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Typography sx={{ fontWeight: 600, mr: 1 }}>🦸 Meet the Squad:</Typography>
      {squad.map((m) => (
        <Chip key={m.name} label={m.name} variant="outlined" color="primary"
          avatar={<Avatar sx={{ bgcolor: 'transparent', fontSize: 20 }}>{m.emoji}</Avatar>}
          sx={{ fontSize: 16, fontWeight: 600, height: 36 }} />
      ))}
    </Box>
  );
}
