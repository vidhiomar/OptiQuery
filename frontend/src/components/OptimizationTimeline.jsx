import React from "react";

export default function OptimizationTimeline({ appliedIndexes, result }) {
  const hasResult = Boolean(result);
  const hasIssues = Boolean(result?.issues?.length);
  const hasRewrite = Boolean(result?.optimized_query);
  const hasIndex = Boolean(result?.index_recommendations?.length);
  const hasAppliedIndex = Boolean(appliedIndexes?.length);
  const improved = result?.improvement_percent != null;

  const steps = [
    { done: hasResult, label: "Original query analyzed" },
    { done: hasIssues, label: "Bottlenecks detected" },
    { done: hasRewrite, label: "AI rewrite generated" },
    { done: hasIndex, label: "Index recommendation created" },
    { done: hasAppliedIndex, label: "Index applied to SQLite" },
    { done: improved, label: "Benchmark comparison complete" },
  ];

  return (
    <section className="result-block timeline-card">
      <div className="block-heading">
        <h2>Optimization Timeline</h2>
        <span>{steps.filter((step) => step.done).length}/{steps.length}</span>
      </div>
      <div className="optimizer-timeline">
        {steps.map((step, index) => (
          <div className={step.done ? "timeline-step done" : "timeline-step"} key={step.label}>
            <span>{index + 1}</span>
            <p>{step.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
