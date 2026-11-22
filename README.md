# Capstone: Screen Time Squad 📵

*Other products punish you for using your phone. We reward you for living your life.*

**The Squad:** Arham · Kainaa · Prisha · Shivaay · Viaan

## The idea

Slide your phone into our case and the timer starts automatically, blocking
distractions so you can focus. The connected app rewards the time away:

| Time away  | Points |
|------------|--------|
| 30 minutes | 10     |
| 1 hour     | 25     |
| 1½ hours   | 35     |
| 2 hours    | 50     |

Hit **1,000 points** and redeem a real-world reward (🍦 ice cream, 🎬 movie night,
🛝 park adventure). Taking the phone out before 30 minutes earns nothing.

### Demo tips

- The **📱 Slide phone into case** button (or the **Space** bar) plays the case's sensor.
- **Demo speed** starts at **🚀 100×**: 30 minutes passes in 18 seconds, 1 hour in 36 seconds.
- Points start at **975**, so a 1-hour session (+25) reaches 1,000 and the reward picker appears.
- **🔄 Reset points** sets the points back to zero.

- **Frontend:** React + Material UI (Vite) in `frontend/`
- **Backend:** FastAPI (Python) in `backend/`
- **CI/CD:** GitHub Actions in `.github/workflows/ci-cd.yml`: checks the backend, builds the frontend, and deploys it to GitHub Pages

## The page

It's one page, with no tabs:

- **Timer:** focus mode with a blocked-buzzes counter; counts down to the first 30 minutes, then counts up
- **Rewards:** points, a 1,000-point goal bar with a reward picker, stickers at 30 min / 1 hr / 1½ hr / 2 hr with an emoji party each, and a reset button
- **Stats:** focus time today, day streak, best session, case sessions
- **Theme switcher:** dark (midnight blue) by default, light on request (top-right button)

> The live GitHub Pages site uses built-in demo data, because GitHub Pages can only host
> the frontend. Locally, the app reads the same data from the FastAPI backend.

## Run it on your computer

You need [Node.js](https://nodejs.org) (LTS) and [Python 3.12](https://www.python.org).

**Backend** (terminal 1):

```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

API docs: http://localhost:8000/docs

**Frontend** (terminal 2):

```powershell
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## Put it on GitHub

1. Create an empty repository on github.com (for example `screen-downtime`).
2. In this folder, run:

   ```powershell
   git init
   git add .
   git commit -m "First version"
   git branch -M main
   git remote add origin https://github.com/<your-username>/screen-downtime.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab. When the "CI/CD" run turns green, the app is live at
   `https://<your-username>.github.io/screen-downtime/`.

Every later `git push` to `main` rebuilds and redeploys the site automatically.
