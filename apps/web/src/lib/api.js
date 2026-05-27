const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4200";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
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
  }
};
