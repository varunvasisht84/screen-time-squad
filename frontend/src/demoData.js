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
    points: 240,
    badges: [
      { id: 1, emoji: '🐣', title: 'Baby Steps', minutes: 10, bonus: 5 },
      { id: 2, emoji: '🧃', title: 'Juice Break', minutes: 15, bonus: 10 },
      { id: 3, emoji: '📚', title: 'Bookworm', minutes: 20, bonus: 20 },
      { id: 4, emoji: '⚽', title: 'Ball Buddy', minutes: 30, bonus: 25 },
      { id: 5, emoji: '🎨', title: 'Doodle Master', minutes: 45, bonus: 30 },
      { id: 6, emoji: '🧘', title: 'Zen Ninja', minutes: 60, bonus: 50 },
      { id: 7, emoji: '🌳', title: 'Tree Hugger', minutes: 90, bonus: 75 },
      { id: 8, emoji: '🏆', title: 'Screen-Free Legend', minutes: 120, bonus: 100 },
    ],
  },
};

export default demo;
