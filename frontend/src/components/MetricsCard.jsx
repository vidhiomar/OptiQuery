import React from "react";

export default function MetricsCard({ result }) {
  const items = [
    { label: "Health", value: result?.health_score != null ? `${result.health_score}` : "--", dot: "c-green" },
    { label: "Before", value: result ? `${result.before_time}s` : "--", dot: "c-amber" },
    { label: "After", value: result?.after_time != null ? `${result.after_time}s` : "--", dot: "c-teal" },
    { label: "Confidence", value: result?.confidence != null ? `${result.confidence}%` : "--", dot: "c-orange" },
  ];

  return (
    <section className="metrics-grid">
      {items.map((m) => (
        <div className="metric" key={m.label}>
          <div className={`metric-dot ${m.dot}`} />
          <span>{m.label}</span>
          <strong>{m.value}</strong>
        </div>
      ))}
    </section>
  );
}
