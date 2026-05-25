import React, { useEffect, useCallback } from "react";
import { Play, Wand2, Keyboard } from "lucide-react";

import BenchmarkChart from "../components/BenchmarkChart.jsx";
import ExplainPlan from "../components/ExplainPlan.jsx";
import HealthScore from "../components/HealthScore.jsx";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import MetricsCard from "../components/MetricsCard.jsx";
import ResultPanel from "../components/ResultPanel.jsx";
import SqlEditor from "../components/SqlEditor.jsx";
import { demoQueries } from "../data/demoQueries.js";
import { useQueryAnalysis } from "../hooks/useQueryAnalysis.js";

export default function AnalyzerPage() {
  const {
    analyze,
    canOptimize,
    error,
    isCurrentQueryAnalyzed,
    isCurrentQueryOptimized,
    loading,
    optimizeCurrentResult,
    query,
    result,
    runDemo,
    setQuery,
    useOptimizedQuery,
  } = useQueryAnalysis();

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !loading) {
        e.preventDefault();
        analyze();
      }
    },
    [analyze, loading]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <main className="analyzer-page">
      <LoadingOverlay visible={loading} />
      <section className="analyzer-hero">
        <div>
          <p className="eyebrow">
            <Keyboard size={11} />
            Query Analyzer
          </p>
          <h1>Diagnose, rewrite, and benchmark SQL in one flow.</h1>
          <p>Load a slow query, analyze the plan, then apply the optimized rewrite.</p>
        </div>
        <button onClick={runDemo} className="demo-button" type="button">
          <Play size={16} />
          Run Demo Mode
        </button>
      </section>

      <section className="workspace">
        <div className="editor-pane">
          <header className="app-header">
            <div>
              <p className="eyebrow">Workbench</p>
              <h2>SQL Input</h2>
            </div>
            <div className="button-group">
              <button
                onClick={() => analyze()}
                disabled={loading || isCurrentQueryAnalyzed}
                className={isCurrentQueryAnalyzed ? "state-button" : "primary-button"}
              >
                <Play size={15} />
                {loading ? "Analyzing..." : isCurrentQueryAnalyzed ? "Already analyzed" : "Analyze"}
              </button>
              <button
                onClick={optimizeCurrentResult}
                disabled={loading || !canOptimize}
                className={isCurrentQueryOptimized ? "state-button" : "secondary-button"}
              >
                <Wand2 size={15} />
                {isCurrentQueryOptimized ? "Already optimized" : canOptimize ? "Optimize" : "Analyze first"}
              </button>
            </div>
          </header>

          <SqlEditor query={query} onChange={setQuery} />

          <div className="template-grid">
            {demoQueries.map((demo) => (
              <button key={demo.name} onClick={() => setQuery(demo.query)} type="button">
                <strong>{demo.name}</strong>
                <span>{demo.detail}</span>
              </button>
            ))}
          </div>

          {error && <div className="error-box">{error}</div>}
        </div>

        <div className="result-pane">
          <HealthScore score={result?.health_score} />
          <MetricsCard result={result} />
          <BenchmarkChart result={result} />
          <ResultPanel result={result} onUseOptimizedQuery={useOptimizedQuery} />
          <ExplainPlan plan={result?.plan || []} />
        </div>
      </section>
    </main>
  );
}
