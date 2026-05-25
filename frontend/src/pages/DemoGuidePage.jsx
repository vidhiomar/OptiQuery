import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const steps = [
  "Open the analyzer workbench",
  "Load the function usage template",
  "Click Analyze",
  "Show health score and critical issues",
  "Walk through the AI explanation",
  "Apply the optimized query",
  "Show benchmark charts and index recommendations",
  "Close with measurable improvement",
];

export default function DemoGuidePage() {
  const [completed, setCompleted] = useState(new Set());

  function toggleStep(index) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  return (
    <main className="page-stack narrow-page">
      <section className="guide-hero">
        <p className="label">Demo Script</p>
        <h1>Judging Walkthrough</h1>
        <p>
          Click each step to track progress during the live demo.
        </p>
        <Link className="btn-primary" to="/analyze">
          Start Demo <ArrowRight size={15} />
        </Link>
      </section>

      <section className="timeline-panel">
        {steps.map((step, i) => (
          <div
            className="timeline-row"
            key={step}
            onClick={() => toggleStep(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleStep(i); }}
          >
            <span className={`step-num ${completed.has(i) ? "step-done" : ""}`}>
              {completed.has(i) ? <Check size={14} /> : i + 1}
            </span>
            <p className={completed.has(i) ? "step-text-done" : ""}>
              {step}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
