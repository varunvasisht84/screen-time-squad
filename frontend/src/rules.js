// The Screen Time Squad points rules (same as the pitch script):
//   every 30 minutes away = 10 points, a full hour = 25 points.
//   1,000 points = a real-world reward.

export const MIN_MINUTES = 30; // first points come at 30 minutes
export const GOAL = 1000;

// 30 min -> 10, 1 hr -> 25, 1½ hr -> 35, 2 hr -> 50, ...
export const pointsFor = (minutes) =>
  Math.floor(minutes / 60) * 25 + (minutes % 60 >= 30 ? 10 : 0);

// 30 -> "30 min", 60 -> "1 hr", 90 -> "1½ hr", 120 -> "2 hr"
export const durationLabel = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}${minutes % 60 >= 30 ? '½' : ''} hr`;
};
