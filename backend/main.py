"""Screen Time Squad API - a tiny FastAPI backend with in-memory data.

Made by: Arham, Kainaa, Prisha, Shivaay, Viaan

Run locally:  uvicorn main:app --reload   (then open http://localhost:8000/docs)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Screen Time Squad API", version="0.2.0")

# Allow the React app (any origin) to call this API.
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

MIN_MINUTES = 10  # downtime only counts after this long in the box

SQUAD = sorted(["Arham", "Prisha", "Kainaa", "Shivaay", "Viaan"])

DOWNTIME = {
    "todayMinutes": 42,
    "streakDays": 4,
    "bestSessionMinutes": 55,
    "sessionsToday": 2,
}

REWARDS = {
    "points": 240,
    "badges": [
        {"id": 1, "emoji": "🐣", "title": "Baby Steps", "minutes": 10, "bonus": 5},
        {"id": 2, "emoji": "🧃", "title": "Juice Break", "minutes": 15, "bonus": 10},
        {"id": 3, "emoji": "📚", "title": "Bookworm", "minutes": 20, "bonus": 20},
        {"id": 4, "emoji": "⚽", "title": "Ball Buddy", "minutes": 30, "bonus": 25},
        {"id": 5, "emoji": "🎨", "title": "Doodle Master", "minutes": 45, "bonus": 30},
        {"id": 6, "emoji": "🧘", "title": "Zen Ninja", "minutes": 60, "bonus": 50},
        {"id": 7, "emoji": "🌳", "title": "Tree Hugger", "minutes": 90, "bonus": 75},
        {"id": 8, "emoji": "🏆", "title": "Screen-Free Legend", "minutes": 120, "bonus": 100},
    ],
}


class Session(BaseModel):
    seconds: int
    points: int


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
    """The 'Reset points' button: squad points back to zero."""
    REWARDS["points"] = 0
    return {"points": 0}


@app.post("/api/sessions")
def add_session(session: Session):
    """Called when the phone comes out of the box. Data resets when the server restarts.

    Downtime only counts after the minimum (10 minutes).
    """
    minutes = session.seconds // 60
    DOWNTIME["sessionsToday"] += 1
    if minutes >= MIN_MINUTES:
        DOWNTIME["todayMinutes"] += minutes
        DOWNTIME["bestSessionMinutes"] = max(DOWNTIME["bestSessionMinutes"], minutes)
        REWARDS["points"] += session.points
    return {"downtime": DOWNTIME, "points": REWARDS["points"]}
