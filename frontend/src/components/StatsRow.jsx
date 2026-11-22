import { Card, CardContent, Grid, Typography } from '@mui/material';

export default function StatsRow({ stats, liveMinutes }) {
  const tiles = [
    { emoji: '⏱️', label: 'Focus time today', value: `${stats.todayMinutes + liveMinutes} min` },
    { emoji: '🔥', label: 'Day streak', value: `${stats.streakDays} days` },
    { emoji: '🏅', label: 'Best session', value: `${Math.max(stats.bestSessionMinutes, liveMinutes)} min` },
    { emoji: '📱', label: 'Case sessions today', value: stats.sessionsToday },
  ];
  return (
    <Grid container spacing={2}>
      {tiles.map((t) => (
        <Grid item xs={6} md={3} key={t.label}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 32 }}>{t.emoji}</Typography>
              <Typography sx={{ fontSize: 26, fontWeight: 700 }}>{t.value}</Typography>
              <Typography variant="body2" color="text.secondary">{t.label}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
