const API_URL = "http://localhost:8000/analyze";

export async function analyzeQuery(query) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unable to analyze query");
  }

  return data;
}
