import React from "react";

export default function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="spinner" />
        <strong>Analyzing query</strong>
        <span>Parsing → Plan → AI → Benchmark...</span>
        <div className="loading-steps">
          <div className="loading-step" />
          <div className="loading-step" />
          <div className="loading-step" />
          <div className="loading-step" />
        </div>
      </div>
    </div>
  );
}
