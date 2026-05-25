import React from "react";
import { Activity, Clock, TrendingUp, Gauge } from "lucide-react";

export default function MetricsCard({ result }) {
  const score = result?.health_score ?? "--";
  const before = result ? `${result.before_time}s` : "--";
  const after = result?.after_time != null ? `${result.after_time}s` : "--";
  const confidence = result?.confidence != null ? `${result.confidence}%` : "--";

  const metrics = [
    { icon: Gauge, label: "Health Score", value: typeof score === "number" ? `${score}/100` : score, color: "indigo" },
    { icon: Clock, label: "Before Runtime", value: before, color: "amber" },
    { icon: Activity, label: "After Runtime", value: after, color: "emerald" },
    { icon: TrendingUp, label: "Confidence", value: confidence, color: "violet" },
  ];

  return (
    <section className="metrics-grid">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div className="metric" key={m.label}>
            <div className={`metric-icon ${m.color}`}>
              <Icon size={16} />
            </div>
            <span>{m.label}</span>
            <strong>{m.value}</strong>
          </div>
        );
      })}
    </section>
  );
}
