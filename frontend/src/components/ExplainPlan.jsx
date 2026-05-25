import React from "react";
import { ArrowDown } from "lucide-react";

export default function ExplainPlan({ plan }) {
  const flow = plan.length
    ? plan.map((step) => step.detail)
    : ["Analyze query", "Read SQLite plan", "Visualize execution"];

  return (
    <section className="result-block plan-visual">
      <div>
        <p className="section-label">Execution Plan</p>
        <h2>SQLite Plan Flow</h2>
      </div>
      <div className="flow-list">
        {flow.map((detail, i) => (
          <div className="flow-item" key={`${detail}-${i}`}>
            <div className="flow-node">
              <span>{i + 1}</span>
              <p>{detail}</p>
            </div>
            {i < flow.length - 1 && (
              <div className="flow-arrow"><ArrowDown size={14} /></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
