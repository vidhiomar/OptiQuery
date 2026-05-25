import React from "react";

function getComplexity(result) {
  const query = result?.query?.toUpperCase() || "";
  const planText = (result?.plan || []).map((step) => step.detail).join(" ").toUpperCase();
  let score = 0;

  if (query.includes("JOIN")) score += 25;
  if (query.includes("ORDER BY")) score += 18;
  if (query.includes("GROUP BY")) score += 18;
  if (query.includes("SELECT *")) score += 16;
  if (query.includes("LOWER(") || query.includes("LIKE '%")) score += 18;
  if (planText.includes("SCAN")) score += 28;
  if (planText.includes("TEMP B-TREE")) score += 18;

  if (score >= 75) return { label: "Dangerous", score: 96, className: "danger" };
  if (score >= 48) return { label: "Expensive", score: 68, className: "expensive" };
  if (score >= 24) return { label: "Moderate", score: 42, className: "moderate" };
  return { label: "Easy", score: 18, className: "easy" };
}

export default function ComplexityMeter({ result }) {
  const complexity = getComplexity(result);

  return (
    <section className="result-block complexity-card">
      <div className="block-heading">
        <h2>Query Complexity</h2>
        <span className={`complexity-pill ${complexity.className}`}>{complexity.label}</span>
      </div>
      <div className="complexity-track">
        <div className={`complexity-fill ${complexity.className}`} style={{ width: `${complexity.score}%` }} />
      </div>
      <div className="complexity-labels">
        <span>Easy</span>
        <span>Moderate</span>
        <span>Expensive</span>
        <span>Dangerous</span>
      </div>
    </section>
  );
}
