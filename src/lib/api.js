const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4200";
let authToken = window.localStorage.getItem("poolsight_token") || "";

export function setAuthToken(token) {
  authToken = token || "";
  if (authToken) window.localStorage.setItem("poolsight_token", authToken);
  else window.localStorage.removeItem("poolsight_token");
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Falha na comunicacao com a API");
  }

  return response.json();
}

export const api = {
  setAuthToken,
  login(payload) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  register(payload) {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  me() {
    return request("/api/auth/me");
  },
  geocode(address) {
    return request("/api/geocode", {
      method: "POST",
      body: JSON.stringify({ address })
    });
  },
  pools() {
    return request("/api/pools");
  },
  estimate(payload) {
    return request("/api/estimate", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  saveProject(payload) {
    return request("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  projects() {
    return request("/api/projects");
  },
  adminOverview() {
    return request("/api/admin/overview");
  }
};
