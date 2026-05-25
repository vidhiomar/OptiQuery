import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Presentation } from "lucide-react";

const steps = [
  "Open the analyzer workbench.",
  "Load the bad function usage template.",
  "Click Analyze to run the full pipeline.",
  "Show health score, critical issues, and explain plan flow.",
  "Show Groq AI explanation and the optimized SQL.",
  "Apply the optimized query to the editor.",
  "Highlight benchmark charts and index recommendations.",
  "Close with measurable faster query performance.",
];

export default function DemoGuidePage() {
  const [completed, setCompleted] = useState(new Set());

  function toggleStep(index) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <main className="page-stack narrow-page">
      <section className="guide-hero">
        <p className="eyebrow">
          <Presentation size={11} />
          Presentation Flow
        </p>
        <h1>Final Demo Script</h1>
        <p>
          Use this checklist during judging to keep the walkthrough sharp and
          reliable. Click each step to mark it complete.
        </p>
        <Link className="primary-link" to="/analyze">
          Start Live Demo
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="timeline-panel">
        {steps.map((step, index) => (
          <div
            className="timeline-row"
            key={step}
            onClick={() => toggleStep(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleStep(index);
            }}
            style={{ cursor: "pointer" }}
          >
            <span
              style={
                completed.has(index)
                  ? {
                      background: "var(--success)",
                      color: "#fff",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                    }
                  : undefined
              }
            >
              {completed.has(index) ? (
                <CheckCircle2 size={16} />
              ) : (
                index + 1
              )}
            </span>
            <p
              style={
                completed.has(index)
                  ? { textDecoration: "line-through", opacity: 0.5 }
                  : undefined
              }
            >
              {step}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
