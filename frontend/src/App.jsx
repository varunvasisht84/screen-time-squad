import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, CircularProgress, Container, CssBaseline, Grid, ThemeProvider } from '@mui/material';
import makeTheme from './theme.js';
import { getData, resetPoints, saveSession } from './api.js';
import Header from './components/Header.jsx';
import SquadBar from './components/SquadBar.jsx';
import TimerCard from './components/TimerCard.jsx';
import StatsRow from './components/StatsRow.jsx';
import RewardsCard from './components/RewardsCard.jsx';
import Celebration from './components/Celebration.jsx';

// Downtime only counts (and earns rewards) after this many minutes in the box.
export const MIN_MINUTES = 10;
const MIN_SECONDS = MIN_MINUTES * 60;
const DEFAULT_SPEED = 100; // fast for the school demo: 10 minutes pass in 6 seconds

function savedMode() {
  try {
    return localStorage.getItem('sts-theme') || 'dark';
  } catch {
    return 'dark';
  }
}

export default function App() {
  // ---- Theme (dark by default, remembered in this browser) ----
  const [mode, setMode] = useState(savedMode);
  const theme = useMemo(() => makeTheme(mode), [mode]);
  const toggleMode = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    try { localStorage.setItem('sts-theme', next); } catch { /* ignore */ }
  };

  // ---- Data from the backend (or demo data) ----
  const [stats, setStats] = useState(null);
  const [rewards, setRewards] = useState(null);
  useEffect(() => {
    getData('downtime').then(setStats);
    getData('rewards').then(setRewards);
  }, []);

  // ---- The box: when the phone is inside, downtime runs ----
  const [inBox, setInBox] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [lastSession, setLastSession] = useState(null);

  useEffect(() => {
    if (!inBox) return undefined;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      setElapsedMs((ms) => ms + (now - last) * speed);
      last = now;
    }, 100);
    return () => clearInterval(id);
  }, [inBox, speed]);

  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const reachedMin = seconds >= MIN_SECONDS;
  const badges = rewards?.badges ?? [];
  const unlocked = badges.filter((b) => seconds >= b.minutes * 60);
  const next = badges.find((b) => seconds < b.minutes * 60);
  // Nothing counts before the minimum. After that: 10 points a minute + badge bonuses.
  const sessionPoints = reachedMin
    ? minutes * 10 + unlocked.reduce((sum, b) => sum + b.bonus, 0)
    : 0;

  // ---- Party time when a new badge unlocks ----
  const [celebrate, setCelebrate] = useState(null);
  const announced = useRef(0);
  useEffect(() => {
    if (unlocked.length > announced.current) setCelebrate(unlocked[unlocked.length - 1]);
    announced.current = unlocked.length;
  }, [unlocked.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const startSession = () => {
    setElapsedMs(0);
    setInBox(true);
  };

  // Phone taken out of the box.
  const endSession = () => {
    setStats((s) => ({
      ...s,
      sessionsToday: s.sessionsToday + 1,
      ...(reachedMin && {
        todayMinutes: s.todayMinutes + minutes,
        bestSessionMinutes: Math.max(s.bestSessionMinutes, minutes),
      }),
    }));
    setRewards((r) => ({ ...r, points: r.points + sessionPoints }));
    setLastSession({ seconds, points: sessionPoints, counted: reachedMin });
    saveSession({ seconds, points: sessionPoints });
    setInBox(false);
    setElapsedMs(0);
  };

  const toggleBox = () => (inBox ? endSession() : startSession());

  const onResetPoints = () => {
    setRewards((r) => ({ ...r, points: 0 }));
    resetPoints();
  };

  // Space bar = the box's sensor (handy during the demo).
  const toggleRef = useRef(toggleBox);
  toggleRef.current = toggleBox;
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        toggleRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header mode={mode} onToggleMode={toggleMode} />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <SquadBar />
        {!stats || !rewards ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={7}>
              <TimerCard
                inBox={inBox} seconds={seconds} minSeconds={MIN_SECONDS}
                badges={badges} next={next} speed={speed} onSpeed={setSpeed}
                onToggle={toggleBox} lastSession={lastSession}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <RewardsCard
                points={rewards.points + (inBox ? sessionPoints : 0)}
                sessionPoints={inBox ? sessionPoints : 0}
                badges={badges} unlockedIds={new Set(unlocked.map((b) => b.id))}
                onReset={onResetPoints}
              />
            </Grid>
            <Grid item xs={12}>
              <StatsRow stats={stats} liveMinutes={inBox && reachedMin ? minutes : 0} />
            </Grid>
          </Grid>
        )}
      </Container>
      {celebrate && (
        <Celebration key={celebrate.id} badge={celebrate} onDone={() => setCelebrate(null)} />
      )}
    </ThemeProvider>
  );
}
