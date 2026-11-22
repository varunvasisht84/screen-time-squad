"""Screen Time Squad API - a tiny FastAPI backend with in-memory data.

Made by: Arham, Kainaa, Prisha, Shivaay, Viaan

Points rules: every 30 minutes away = 10 points, a full hour = 25 points.
1,000 points = a real-world reward.

Run locally:  uvicorn main:app --reload   (then open http://localhost:8000/docs)
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Screen Time Squad API", version="0.3.0")

# Allow the React app (any origin) to call this API.
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

MIN_MINUTES = 30  # first points come at 30 minutes
GOAL = 1000

SQUAD = sorted(["Arham", "Prisha", "Kainaa", "Shivaay", "Viaan"])

DOWNTIME = {
    "todayMinutes": 42,
    "streakDays": 4,
    "bestSessionMinutes": 55,
    "sessionsToday": 2,
}

REWARDS = {
    # Starts just below the goal, so one 1-hour session (+25) hits 1,000 in the demo.
    "points": 975,
    "goal": GOAL,
    "badges": [
        {"id": 1, "emoji": "🐣", "title": "Focus Starter", "minutes": 30},
        {"id": 2, "emoji": "🦸", "title": "Hour Hero", "minutes": 60},
        {"id": 3, "emoji": "🧘", "title": "Zen Ninja", "minutes": 90},
        {"id": 4, "emoji": "🏆", "title": "Screen-Free Legend", "minutes": 120},
    ],
    "prizes": [
        {"id": 1, "emoji": "🍦", "title": "Ice cream trip"},
        {"id": 2, "emoji": "🎬", "title": "Movie night"},
        {"id": 3, "emoji": "🛝", "title": "Park adventure"},
    ],
}


def points_for(minutes: int) -> int:
    """30 min -> 10, 1 hr -> 25, 1.5 hr -> 35, 2 hr -> 50, ..."""
    return (minutes // 60) * 25 + (10 if minutes % 60 >= 30 else 0)


class Session(BaseModel):
    seconds: int
    points: int = 0  # ignored: the server works out the points itself


class Redeem(BaseModel):
    prizeId: int


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/squad")
def squad():
    return SQUAD


@app.get("/api/downtime")
def downtime():
    return DOWNTIME


@app.get("/api/rewards")
def rewards():
    return REWARDS


@app.post("/api/rewards/reset")
def reset_points():
    """The 'Reset points' button: points back to zero."""
    REWARDS["points"] = 0
    return {"points": 0}


@app.post("/api/rewards/redeem")
def redeem(body: Redeem):
    """Spend 1,000 points on a real-world reward."""
    prize = next((p for p in REWARDS["prizes"] if p["id"] == body.prizeId), None)
    if prize is None:
        raise HTTPException(404, "No such reward")
    if REWARDS["points"] < GOAL:
        raise HTTPException(400, "Not enough points yet")
    REWARDS["points"] -= GOAL
    return {"prize": prize, "points": REWARDS["points"]}


@app.post("/api/sessions")
def add_session(session: Session):
    """Called when the phone comes out of the case. Data resets when the server restarts."""
    minutes = session.seconds // 60
    DOWNTIME["sessionsToday"] += 1
    if minutes >= MIN_MINUTES:
        DOWNTIME["todayMinutes"] += minutes
        DOWNTIME["bestSessionMinutes"] = max(DOWNTIME["bestSessionMinutes"], minutes)
        REWARDS["points"] += points_for(minutes)
    return {"downtime": DOWNTIME, "points": REWARDS["points"]}
