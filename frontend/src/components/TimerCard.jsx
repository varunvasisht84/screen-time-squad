import { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, CircularProgress, Stack, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { MIN_MINUTES, durationLabel, pointsFor } from '../rules.js';

const wobble = keyframes`0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}`;

const warmUpJokes = [
  'Stay strong! The phone is just napping 😴',
  'No peeking! First 10 points at 30 min 🙈',
  'Your thumbs are stretching… 👍',
  'Bzzz? Nope. Blocked. 🔕',
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

const MIN_SECONDS = MIN_MINUTES * 60;

export default function TimerCard({
  inCase, seconds, sessionPoints, nextMilestone, buzzes, speed, onSpeed, onToggle, lastSession,
}) {
  const reachedMin = seconds >= MIN_SECONDS;
  const list = reachedMin ? jokes : warmUpJokes;
  const [joke, setJoke] = useState(0);
  useEffect(() => {
    if (!inCase) return undefined;
    const id = setInterval(() => setJoke((j) => j + 1), 2500);
    return () => clearInterval(id);
  }, [inCase]);

  // Before 30 min: count DOWN to the first points. After: count UP, ring fills to the next half hour.
  let bigTime;
  let caption;
  let progress;
  if (!inCase) {
    bigTime = formatTime(MIN_SECONDS);
    caption = 'to your first 10 pts';
    progress = 0;
  } else if (!reachedMin) {
    bigTime = formatTime(MIN_SECONDS - seconds);
    caption = 'until +10 pts';
    progress = (seconds / MIN_SECONDS) * 100;
  } else {
    bigTime = formatTime(seconds);
    caption = 'of focus time ✅';
    progress = ((seconds % 1800) / 1800) * 100;
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 4 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: inCase ? 'success.main' : 'secondary.main' }}>
          {inCase ? '🔕 Focus mode ON · distractions blocked' : '📱 Phone is out!'}
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
            {/* The phone, snug in its case while the timer runs */}
            <Box sx={{
              fontSize: 44, lineHeight: 1, px: 1, py: 0.5, borderRadius: 3,
              border: '4px solid', borderColor: inCase ? 'success.main' : 'transparent',
              animation: inCase ? `${wobble} 1.2s ease-in-out infinite` : 'none',
            }}>
              📱
            </Box>
            <Typography sx={{ fontSize: 52, fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
              {bigTime}
            </Typography>
            <Typography variant="body2" color="text.secondary">{caption}</Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ minHeight: 32 }}>
          {inCase ? list[joke % list.length] : 'Slide the phone into the case to start focusing!'}
        </Typography>
        {inCase && (
          <Typography color="text.secondary">
            🔕 {buzzes} buzzes blocked · This session: <b>{sessionPoints} pts</b> · Next:{' '}
            {durationLabel(nextMilestone)} = {pointsFor(nextMilestone)} pts
          </Typography>
        )}
        {!inCase && lastSession && (
          <Typography color={lastSession.counted ? 'success.main' : 'warning.main'} sx={{ fontWeight: 600 }}>
            {lastSession.counted
              ? `🏁 You took back ${formatTime(lastSession.seconds)} of your time · +${lastSession.points} pts 🎉`
              : `😅 Too soon! Only ${formatTime(lastSession.seconds)}. Stay ${MIN_MINUTES} min to earn 10 pts.`}
          </Typography>
        )}

        <Button variant="contained" size="large" color={inCase ? 'secondary' : 'primary'} onClick={onToggle}
          sx={{ mt: 3, px: 5, py: 1.5, fontSize: 20 }}>
          {inCase ? '🙈 Take phone out of case' : '📱 Slide phone into case'}
        </Button>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          The case’s sensor starts the timer automatically. In this demo, the button (or <b>Space</b>) plays the sensor.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 3, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2">Demo speed:</Typography>
          <ToggleButtonGroup size="small" exclusive value={speed} onChange={(_, v) => v && onSpeed(v)}>
            <ToggleButton value={1}>🐢 Real</ToggleButton>
            <ToggleButton value={10}>🐇 10×</ToggleButton>
            <ToggleButton value={100}>🚀 100×</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Typography sx={{ mt: 3, fontWeight: 600, color: 'primary.main' }}>
          Put the phone away, earn your points, and take back your time. ⏳
        </Typography>
      </CardContent>
    </Card>
  );
}
