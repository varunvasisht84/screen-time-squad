import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, CircularProgress, Container, CssBaseline, Grid, ThemeProvider } from '@mui/material';
import makeTheme from './theme.js';
import { getData, redeemPrize, resetPoints, saveSession } from './api.js';
import { MIN_MINUTES, pointsFor } from './rules.js';
import Header from './components/Header.jsx';
import SquadBar from './components/SquadBar.jsx';
import TimerCard from './components/TimerCard.jsx';
import StatsRow from './components/StatsRow.jsx';
import RewardsCard from './components/RewardsCard.jsx';
import Celebration from './components/Celebration.jsx';

const DEFAULT_SPEED = 100; // fast for the demo: 30 min = 18 s, 1 hour = 36 s

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

  // ---- The case: when the phone slides in, the timer starts ----
  const [inCase, setInCase] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [lastSession, setLastSession] = useState(null);

  useEffect(() => {
    if (!inCase) return undefined;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const added = (now - last) * speed; // work this out now: React may run the updater later
      last = now;
      setElapsedMs((ms) => ms + added);
    }, 100);
    return () => clearInterval(id);
  }, [inCase, speed]);

  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const reachedMin = minutes >= MIN_MINUTES;
  const sessionPoints = pointsFor(minutes);
  const nextMilestone = (Math.floor(minutes / 30) + 1) * 30;
  const buzzes = Math.floor(minutes / 3); // pretend notifications the case blocked
  const badges = rewards?.badges ?? [];
  const unlocked = badges.filter((b) => minutes >= b.minutes);

  // ---- Party time when a sticker (30 min, 1 hr, ...) is earned ----
  const [celebrate, setCelebrate] = useState(null);
  const announced = useRef(0);
  useEffect(() => {
    if (unlocked.length > announced.current) {
      const b = unlocked[unlocked.length - 1];
      setCelebrate({
        id: `badge-${b.id}`,
        emoji: b.emoji,
        message: `${b.emoji} ${b.title}! ${pointsFor(b.minutes)} pts this session`,
      });
    }
    announced.current = unlocked.length;
  }, [unlocked.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const startSession = () => {
    setElapsedMs(0);
    setInCase(true);
  };

  // Phone taken out of the case.
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
    setInCase(false);
    setElapsedMs(0);
  };

  const toggleCase = () => (inCase ? endSession() : startSession());

  const onResetPoints = () => {
    setRewards((r) => ({ ...r, points: 0 }));
    resetPoints();
  };

  const onRedeem = (prize) => {
    if (rewards.points < rewards.goal) return;
    setRewards((r) => ({ ...r, points: r.points - r.goal }));
    redeemPrize(prize.id);
    setCelebrate({
      id: `prize-${prize.id}-${Date.now()}`,
      emoji: prize.emoji,
      message: `🎁 Reward unlocked: ${prize.emoji} ${prize.title}! Enjoy real life!`,
    });
  };

  // Space bar = the case's sensor (handy during the demo).
  const toggleRef = useRef(toggleCase);
  toggleRef.current = toggleCase;
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
                inCase={inCase} seconds={seconds} sessionPoints={sessionPoints}
                nextMilestone={nextMilestone} buzzes={buzzes}
                speed={speed} onSpeed={setSpeed} onToggle={toggleCase} lastSession={lastSession}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <RewardsCard
                points={rewards.points + (inCase ? sessionPoints : 0)}
                sessionPoints={inCase ? sessionPoints : 0}
                goal={rewards.goal} canRedeem={!inCase && rewards.points >= rewards.goal}
                inCase={inCase} prizes={rewards.prizes} onRedeem={onRedeem}
                badges={badges} unlockedIds={new Set(unlocked.map((b) => b.id))}
                onReset={onResetPoints}
              />
            </Grid>
            <Grid item xs={12}>
              <StatsRow stats={stats} liveMinutes={inCase && reachedMin ? minutes : 0} />
            </Grid>
          </Grid>
        )}
      </Container>
      {celebrate && (
        <Celebration key={celebrate.id} emoji={celebrate.emoji} message={celebrate.message}
          onDone={() => setCelebrate(null)} />
      )}
    </ThemeProvider>
  );
}
