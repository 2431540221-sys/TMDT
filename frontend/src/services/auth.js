// Quản lý token + user trong localStorage và gọi API auth (dùng fetch như Lab08)
const API = "http://localhost:5000/api/auth";
const EVENT = "auth-changed";

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event(EVENT));
}

export function updateStoredUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event(EVENT));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event(EVENT));
}

export function onAuthChange(fn) {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}

// Hàm gọi API chung, tự gắn token, ném lỗi với message từ server
export async function api(path, method = "GET", body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) clearSession(); // token hết hạn
    throw new Error(data.message || res.statusText);
  }
  return data;
}
