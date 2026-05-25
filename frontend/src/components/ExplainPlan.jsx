import React from "react";
import { ArrowDown, Search, GitBranch, SortAsc } from "lucide-react";

function getIcon(detail) {
  const lower = detail.toLowerCase();
  if (lower.includes("scan")) return Search;
  if (lower.includes("index") || lower.includes("search")) return GitBranch;
  if (lower.includes("sort") || lower.includes("b-tree")) return SortAsc;
  return Search;
}

export default function ExplainPlan({ plan }) {
  const flow = plan.length
    ? plan.map((step) => step.detail)
    : ["Analyze query", "Read SQLite plan", "Visualize execution"];

  return (
    <section className="result-block plan-visual">
      <div>
        <p className="eyebrow">Execution Plan</p>
        <h2>SQLite Plan Flow</h2>
      </div>
      <div className="flow-list">
        {flow.map((detail, index) => {
          const Icon = getIcon(detail);
          return (
            <div className="flow-item" key={`${detail}-${index}`}>
              <div className="flow-node">
                <span><Icon size={14} /></span>
                <p>{detail}</p>
              </div>
              {index < flow.length - 1 && (
                <div className="flow-arrow"><ArrowDown size={16} /></div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
