// Same shape as the FastAPI responses. Used when no backend is reachable
// (for example on GitHub Pages).
const demo = {
  downtime: {
    todayMinutes: 42,
    streakDays: 4,
    bestSessionMinutes: 55,
    sessionsToday: 2,
  },
  rewards: {
    // Starts just below the goal, so one 1-hour session (+25) hits 1,000 on stage.
    points: 975,
    goal: 1000,
    badges: [
      { id: 1, emoji: '🐣', title: 'Focus Starter', minutes: 30 },
      { id: 2, emoji: '🦸', title: 'Hour Hero', minutes: 60 },
      { id: 3, emoji: '🧘', title: 'Zen Ninja', minutes: 90 },
      { id: 4, emoji: '🏆', title: 'Screen-Free Legend', minutes: 120 },
    ],
    prizes: [
      { id: 1, emoji: '🍦', title: 'Ice cream trip' },
      { id: 2, emoji: '🎬', title: 'Movie night' },
      { id: 3, emoji: '🛝', title: 'Park adventure' },
    ],
  },
};

export default demo;
