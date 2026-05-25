import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import ExplainPlan from "../components/ExplainPlan.jsx";
import MetricsCard from "../components/MetricsCard.jsx";
import ResultPanel from "../components/ResultPanel.jsx";
import SqlEditor from "../components/SqlEditor.jsx";
import { analyzeQuery } from "../services/api.js";
import "./styles.css";

const demoQueries = [
  {
    name: "Function filter",
    query: "SELECT *\nFROM orders\nWHERE LOWER(customer_name) = 'john';",
  },
  {
    name: "No filter",
    query: "SELECT *\nFROM orders;",
  },
  {
    name: "Sort scan",
    query: "SELECT *\nFROM orders\nORDER BY amount;",
  },
];

function App() {
  const [query, setQuery] = useState(demoQueries[0].query);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    setError("");

    try {
      const data = await analyzeQuery(query);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="editor-pane">
          <header className="app-header">
            <div>
              <p className="eyebrow">Sprint 1</p>
              <h1>OptiQuery SQL Optimizer</h1>
            </div>
            <button onClick={handleAnalyze} disabled={loading} className="primary-button">
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </header>

          <SqlEditor query={query} onChange={setQuery} />

          <div className="demo-row">
            {demoQueries.map((demo) => (
              <button key={demo.name} onClick={() => setQuery(demo.query)} type="button">
                {demo.name}
              </button>
            ))}
          </div>

          {error && <div className="error-box">{error}</div>}
        </div>

        <div className="result-pane">
          <MetricsCard result={result} />
          <ResultPanel result={result} />
          <ExplainPlan plan={result?.plan || []} />
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
