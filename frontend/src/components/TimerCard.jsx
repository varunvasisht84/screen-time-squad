import { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, CircularProgress, Stack, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import { keyframes } from '@emotion/react';

const wobble = keyframes`0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}`;

const warmUpJokes = [
  'Stay strong! The phone is just napping 😴',
  'No peeking! Rewards start at 10 min 🙈',
  'Your thumbs are stretching… 👍',
  'Almost there, don’t open the box! 📦',
];

const jokes = [
  'Go touch some grass 🌱',
  'The phone misses you. Ignore it. 😎',
  'Brain loading… 100% human mode 🧠',
  'Even phones need a holiday 🏖️',
  'Look up! The sky has 4K resolution ☁️',
  'Plot twist: real life has no ads 🎬',
];

// 754 -> "12:34", 3754 -> "1:02:34"
export const formatTime = (s) => {
  const parts = [Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0'));
  return s >= 3600 ? `${Math.floor(s / 3600)}:${parts.join(':')}` : parts.join(':');
};

export default function TimerCard({
  inBox, seconds, minSeconds, badges, next, speed, onSpeed, onToggle, lastSession,
}) {
  const reachedMin = seconds >= minSeconds;
  const list = reachedMin ? jokes : warmUpJokes;
  const [joke, setJoke] = useState(0);
  useEffect(() => {
    if (!inBox) return undefined;
    const id = setInterval(() => setJoke((j) => j + 1), 2500);
    return () => clearInterval(id);
  }, [inBox]);

  // Before the minimum: count DOWN to 10:00. After it: count UP, ring fills toward the next badge.
  let bigTime;
  let caption;
  let progress;
  if (!inBox) {
    bigTime = formatTime(minSeconds);
    caption = `minimum downtime`;
    progress = 0;
  } else if (!reachedMin) {
    bigTime = formatTime(minSeconds - seconds);
    caption = 'to go until rewards start';
    progress = (seconds / minSeconds) * 100;
  } else {
    bigTime = formatTime(seconds);
    caption = 'of downtime ✅';
    const prev = [...badges].reverse().find((b) => seconds >= b.minutes * 60);
    const from = prev ? prev.minutes * 60 : 0;
    progress = next ? ((seconds - from) / (next.minutes * 60 - from)) * 100 : 100;
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 4 } }}>
        <Typography variant="h6" sx={{
          fontWeight: 700,
          color: !inBox ? 'secondary.main' : reachedMin ? 'success.main' : 'warning.main',
        }}>
          {!inBox ? '📱 Phone is out!' : reachedMin ? '🎉 Minimum done! Downtime counts' : '🔒 Downtime started'}
        </Typography>

        <Box sx={{ position: 'relative', display: 'inline-flex', my: 3 }}>
          <CircularProgress variant="determinate" value={100} size={260} thickness={3}
            sx={{ color: 'action.hover', position: 'absolute' }} />
          <CircularProgress variant="determinate" value={progress} size={260} thickness={3}
            color={reachedMin ? 'success' : 'primary'}
            sx={{ '& circle': { strokeLinecap: 'round', transition: 'none' } }} />
          <Box sx={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Box sx={{ fontSize: 64, lineHeight: 1, animation: inBox ? `${wobble} 1.2s ease-in-out infinite` : 'none' }}>
              {inBox ? '📦' : '📱'}
            </Box>
            <Typography sx={{ fontSize: 52, fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
              {bigTime}
            </Typography>
            <Typography variant="body2" color="text.secondary">{caption}</Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ minHeight: 32 }}>
          {inBox ? list[joke % list.length] : 'Put the phone in the box to start downtime!'}
        </Typography>
        {inBox && next && (
          <Typography color="text.secondary">
            Next badge: {next.emoji} <b>{next.title}</b> at {next.minutes} min
          </Typography>
        )}
        {inBox && !next && <Typography color="text.secondary">All badges collected! You legend 🏆</Typography>}
        {!inBox && lastSession && (
          <Typography color={lastSession.counted ? 'success.main' : 'warning.main'} sx={{ fontWeight: 600 }}>
            {lastSession.counted
              ? `🏁 Great job! ${formatTime(lastSession.seconds)} of downtime · +${lastSession.points} pts 🎉`
              : `😅 Too soon! Only ${formatTime(lastSession.seconds)}. Stay at least ${minSeconds / 60} min to earn points.`}
          </Typography>
        )}

        <Button variant="contained" size="large" color={inBox ? 'secondary' : 'primary'} onClick={onToggle}
          sx={{ mt: 3, px: 5, py: 1.5, fontSize: 20 }}>
          {inBox ? '🙈 Take phone out' : '📦 Phone in the box'}
        </Button>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          Tip: press <b>Space</b> to pretend the box sensor saw the phone
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 3, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2">Demo speed:</Typography>
          <ToggleButtonGroup size="small" exclusive value={speed} onChange={(_, v) => v && onSpeed(v)}>
            <ToggleButton value={1}>🐢 Real</ToggleButton>
            <ToggleButton value={10}>🐇 10×</ToggleButton>
            <ToggleButton value={100}>🚀 100×</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </CardContent>
    </Card>
  );
}
