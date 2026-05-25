import React, { useEffect, useRef, useState } from "react";

export default function HealthScore({ score }) {
  const value = Number.isFinite(score) ? score : 0;
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    if (!score && score !== 0) { setDisplayed(0); return; }
    const end = value;
    const duration = 700;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      setDisplayed(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [value, score]);

  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayed / 100) * circ;

  let color = "#dc2626";
  if (displayed >= 80) color = "#059669";
  else if (displayed >= 50) color = "#d97706";

  let label = "Critical";
  if (value >= 80) label = "Healthy";
  else if (value >= 50) label = "Needs Work";

  return (
    <section className="health-card">
      <div className="score-ring-wrap">
        <svg className="score-ring-svg" viewBox="0 0 100 100">
          <circle className="score-ring-bg" cx="50" cy="50" r={r} />
          <circle className="score-ring-fill" cx="50" cy="50" r={r}
            stroke={color} strokeDasharray={circ} strokeDashoffset={offset} />
        </svg>
        <div className="score-ring-label">
          <strong>{displayed}</strong>
          <span>/100</span>
        </div>
      </div>
      <div className="health-info">
        <p className="section-label">Health Score</p>
        <h2>{label}</h2>
        <p className="sub">Query shape, plan quality, and optimization risks.</p>
      </div>
    </section>
  );
}
