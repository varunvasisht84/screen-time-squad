# Capstone: Screen Time Squad 📵

A school capstone demo app that helps kids cut down on screen time.

**The Squad:** Arham · Kainaa · Prisha · Shivaay · Viaan

## The idea

The phone goes into a box (the hardware). As soon as it is inside, the phone is in
**downtime**: the timer starts, and the kids earn points and badges while they stay
off-screen. Take the phone out and the session is saved.

In the browser demo, the **📦 Phone in the box** button (or the **Space** bar) stands in
for the box's sensor. Downtime has a **10-minute minimum**: the timer counts down to it,
and taking the phone out earlier earns nothing. After that the timer counts up and more
badges unlock the longer the phone stays in (10 min up to 2 hours). The **Demo speed**
switch (🐢 Real / 🐇 10× / 🚀 100×) starts at **100×**, so the 10-minute minimum passes in
6 seconds and the 2-hour badge in about 72 seconds during a presentation.
**🔄 Reset points** sets the squad points back to zero before a fresh demo.

- **Frontend:** React + Material UI (Vite) in `frontend/`
- **Backend:** FastAPI (Python) in `backend/`
- **CI/CD:** GitHub Actions in `.github/workflows/ci-cd.yml`: checks the backend, builds the frontend, and deploys it to GitHub Pages

## The page

It's one page, with no tabs:

- **Timer:** counts down the 10-minute minimum, then counts up, with a progress ring and funny messages
- **Rewards:** squad points (10 per minute + badge bonuses, only after the minimum), 8 badges from 10 min to 2 hours with an emoji party each, and a reset button
- **Stats:** downtime today, day streak, best session, box visits
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
