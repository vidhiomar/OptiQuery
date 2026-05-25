const API_BASE = "http://localhost:8000";
const TIMEOUT_MS = 15000;

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out — backend may be slow or unreachable.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function analyzeQuery(query) {
  let response;
  try {
    response = await fetchWithTimeout(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
  } catch (err) {
    if (err.message.includes("timed out")) throw err;
    throw new Error("Cannot reach the backend — make sure the server is running on port 8000.");
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Unable to analyze query");
  return data;
}

export async function checkHealth() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}
