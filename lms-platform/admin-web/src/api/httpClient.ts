import { ACCESS_TOKEN_KEY, USER_KEY } from "../session/storageKeys";

const defaultBase = "";

function authHeaders(): HeadersInit {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

export async function httpJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${defaultBase}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let body = {} as T;
  if (text) {
    try {
      body = JSON.parse(text) as T;
    } catch {
      body = {} as T;
    }
  }
  if (res.status === 401) {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("lms:unauthorized"));
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return body;
}
