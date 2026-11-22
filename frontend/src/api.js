import demo from './demoData.js';

// Where the FastAPI backend lives:
//  - local dev: "" (Vite proxies /api to localhost:8000)
//  - production: set VITE_API_URL at build time, otherwise demo data is used
//    (GitHub Pages can only host the frontend, so demo data keeps it working).
const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : null);

export async function getData(name) {
  if (API_URL === null) return demo[name];
  try {
    const res = await fetch(`${API_URL}/api/${name}`);
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch {
    return demo[name]; // backend not running: fall back to demo data
  }
}

async function post(path, body) {
  if (API_URL === null) return;
  try {
    await fetch(`${API_URL}/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    /* no backend: nothing to save */
  }
}

// Tell the backend a downtime session finished. Ignored if there is no backend.
export const saveSession = (session) => post('sessions', session);

// Set the squad points back to zero.
export const resetPoints = () => post('rewards/reset');
