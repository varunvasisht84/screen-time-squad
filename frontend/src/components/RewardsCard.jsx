import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from '@mui/material';

export default function RewardsCard({
  points, sessionPoints, goal, canRedeem, inCase, prizes, onRedeem, badges, unlockedIds, onReset,
}) {
  const reached = points >= goal;
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
          <Typography sx={{ fontWeight: 600 }}>Points</Typography>
          {sessionPoints > 0 && (
            <Chip label={`+${sessionPoints} this session`} size="small"
              sx={{ mt: 1, bgcolor: '#1a1a1a', color: '#fff' }} />
          )}
        </Box>

        {/* The 1,000-point goal */}
        <Typography sx={{ fontWeight: 600 }}>
          🎯 {Math.min(points, goal).toLocaleString()} / {goal.toLocaleString()} to a real-world reward
        </Typography>
        <LinearProgress variant="determinate" value={Math.min(100, (points / goal) * 100)}
          color={reached ? 'success' : 'primary'} sx={{ height: 12, borderRadius: 6, my: 1 }} />

        {canRedeem && (
          <Box sx={{ p: 1.5, borderRadius: 3, border: '2px dashed', borderColor: 'success.main', mb: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>🎉 1,000 points! Pick your reward:</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {prizes.map((p) => (
                <Button key={p.id} variant="contained" color="success" onClick={() => onRedeem(p)}
                  sx={{ ml: '0 !important' }}>
                  {p.emoji} {p.title}
                </Button>
              ))}
            </Stack>
          </Box>
        )}
        {reached && inCase && (
          <Typography color="success.main" sx={{ fontWeight: 600, mb: 2 }}>
            🎉 1,000 reached! Take the phone out to claim your reward.
          </Typography>
        )}

        {/* How points are earned */}
        <Stack direction="row" spacing={1} sx={{ my: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Chip label="⏰ 30 min away = 10 pts" sx={{ ml: '0 !important' }} />
          <Chip label="🦸 1 hour away = 25 pts" sx={{ ml: '0 !important' }} />
        </Stack>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Stickers this session
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {badges.map((b) => {
            const got = unlockedIds.has(b.id);
            return (
              <Box key={b.id} title={`${b.title}: ${b.minutes} min`} sx={{
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
                <Typography variant="caption" color="text.secondary">
                  {b.minutes >= 60 ? `${b.minutes / 60} hr` : `${b.minutes} min`}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
