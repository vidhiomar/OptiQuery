import React from "react";

export default function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="spinner" />
        <strong>Analyzing...</strong>
        <span>Running plan, AI, and benchmark</span>
      </div>
    </div>
  );
}
