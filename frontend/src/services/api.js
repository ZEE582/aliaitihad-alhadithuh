// API Client Service using environment variable REACT_APP_API_URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:26043/api";

// Helper to get stored auth token
export const getAuthToken = () => {
  return localStorage.getItem("auth_token") || "";
};

// Core fetch wrapper with auth header & error handling
export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error.message);
    throw error;
  }
};

// Convenience HTTP methods
export const api = {
  get: (endpoint) => apiFetch(endpoint, { method: "GET" }),
  post: (endpoint, body) => apiFetch(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) => apiFetch(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => apiFetch(endpoint, { method: "DELETE" }),
  upload: async (endpoint, formData) => {
    const token = getAuthToken();
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Upload Error: ${response.statusText}`);
    }
    return data;
  }
};

export default api;

