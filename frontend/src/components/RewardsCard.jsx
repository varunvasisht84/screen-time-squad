import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material';

export default function RewardsCard({ points, sessionPoints, badges, unlockedIds, onReset }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>🎁 Rewards</Typography>
          <Button size="small" variant="outlined" color="secondary" onClick={onReset}>
            🔄 Reset points
          </Button>
        </Box>

        <Box sx={{
          my: 2, p: 2, borderRadius: 4, textAlign: 'center',
          background: 'linear-gradient(135deg, #ff6fb5, #ffb74d)', color: '#1a1a1a',
        }}>
          <Typography sx={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1 }}>⭐ {points}</Typography>
          <Typography sx={{ fontWeight: 600 }}>Squad points</Typography>
          {sessionPoints > 0 && (
            <Chip label={`+${sessionPoints} this session`} size="small"
              sx={{ mt: 1, bgcolor: '#1a1a1a', color: '#fff' }} />
          )}
        </Box>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Badges this session (10 pts every minute + badge bonus)
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {badges.map((b) => {
            const got = unlockedIds.has(b.id);
            return (
              <Box key={b.id} title={`${b.title}: ${b.minutes} min, +${b.bonus} pts`} sx={{
                textAlign: 'center', p: 1, borderRadius: 3,
                bgcolor: got ? 'action.selected' : 'transparent',
                border: '2px dashed', borderColor: got ? 'primary.main' : 'divider',
                transition: 'all .3s',
              }}>
                <Box sx={{
                  fontSize: 32, filter: got ? 'none' : 'grayscale(1)', opacity: got ? 1 : 0.35,
                  transform: got ? 'scale(1.1)' : 'none', transition: 'all .3s',
                }}>
                  {got ? b.emoji : '🔒'}
                </Box>
                <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.2, fontWeight: 600 }}>
                  {b.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">{b.minutes} min</Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
