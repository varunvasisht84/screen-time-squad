import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function StatsRow({ stats, liveMinutes, onReset }) {
  const tiles = [
    { key: 'todayMinutes', emoji: '⏱️', label: 'Focus time today', value: `${stats.todayMinutes + liveMinutes} min` },
    { key: 'streakDays', emoji: '🔥', label: 'Day streak', value: `${stats.streakDays} days` },
    { key: 'bestSessionMinutes', emoji: '🏅', label: 'Best session', value: `${Math.max(stats.bestSessionMinutes, liveMinutes)} min` },
    { key: 'sessionsToday', emoji: '📱', label: 'Case sessions today', value: stats.sessionsToday },
  ];
  return (
    <Grid container spacing={2}>
      {tiles.map((t) => (
        <Grid item xs={6} md={3} key={t.key}>
          <Card sx={{ position: 'relative' }}>
            <Tooltip title={`Reset ${t.label.toLowerCase()} to 0`}>
              <IconButton size="small" onClick={() => onReset(t.key)} aria-label={`Reset ${t.label}`}
                sx={{ position: 'absolute', top: 6, right: 6, color: 'text.secondary' }}>
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
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
