// Lightweight API helpers. Owner-only app for MVP — no auth token plumbing yet.
const BASE = "/api";

export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const fetcher = (url) => api(url);

export function fmtMoney(n, currency = "EUR") {
  if (n === null || n === undefined) return "-";
  return new Intl.NumberFormat("en-EU", { style: "currency", currency }).format(Number(n));
}

export function fmtDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString();
}
