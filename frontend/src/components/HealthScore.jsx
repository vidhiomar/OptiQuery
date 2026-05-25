import React, { useEffect, useRef, useState } from "react";

export default function HealthScore({ score }) {
  const value = Number.isFinite(score) ? score : 0;
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    if (!score && score !== 0) {
      setDisplayed(0);
      return;
    }

    const end = value;
    const duration = 800;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(end * eased));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      }
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [value, score]);

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  let ringColor = "#ef4444";
  if (displayed >= 80) ringColor = "#10b981";
  else if (displayed >= 50) ringColor = "#f59e0b";

  let label = "Critical Bottlenecks";
  if (value >= 80) label = "Production Ready";
  else if (value >= 50) label = "Needs Tuning";

  return (
    <section className="health-card">
      <div className="score-ring-wrap">
        <svg className="score-ring-svg" viewBox="0 0 120 120">
          <circle className="score-ring-bg" cx="60" cy="60" r={radius} />
          <circle
            className="score-ring-fill"
            cx="60"
            cy="60"
            r={radius}
            stroke={ringColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="score-ring-label">
          <strong>{displayed}</strong>
          <span>/100</span>
        </div>
      </div>
      <div className="health-info">
        <p className="eyebrow">Query Health Score</p>
        <h2>{label}</h2>
        <p className="muted">
          A fast read on query shape, plan quality, and known optimization risks.
        </p>
      </div>
    </section>
  );
}
