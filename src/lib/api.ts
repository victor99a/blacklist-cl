const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("blacklist_token");
}

export function setToken(token: string): void {
  localStorage.setItem("blacklist_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("blacklist_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string>) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api${path}`, { ...options, headers });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  login: (username: string, password: string) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),

  signup: (username: string, email: string, password: string) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify({ username, email, password }) }),

  me: () => request("/auth/me"),

  vehicles: {
    top: () => request("/vehicles"),
    detail: (slug: string) => request(`/vehicles/${slug}`),
    create: (data: any) =>
      request("/vehicles", { method: "POST", body: JSON.stringify(data) }),
  },

  vote: (vehicleId: string) =>
    request(`/vote/${vehicleId}`, { method: "POST" }),

  garaje: () => request("/garaje"),

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error("Error al subir imagen");
    return res.json();
  },
};
