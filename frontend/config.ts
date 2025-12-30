/**
 * Connect Intelligence — Centralised API Configuration
 * =====================================================
 * Single source of truth for the backend URL.
 * - In development  → http://127.0.0.1:8000  (local FastAPI)
 * - In production   → VITE_API_BASE env var   (Render deployment)
 *
 * Usage in any component:
 *   import { API_BASE } from '../config';
 *   fetch(`${API_BASE}/api/endpoint`)
 */

const RENDER_BACKEND_URL = "https://connectintelligence.onrender.com";

export const API_BASE: string =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD ? RENDER_BACKEND_URL : "http://127.0.0.1:8000");
