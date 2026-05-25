import React from "react";

function estimate(result) {
  const planText = (result?.plan || []).map((step) => step.detail).join(" ").toUpperCase();
  const issues = result?.issues || [];
  const hasScan = planText.includes("SCAN");
  const hasSort = planText.includes("TEMP B-TREE") || (result?.query || "").toUpperCase().includes("ORDER BY");
  const hasFunction = issues.some((issue) => issue.toLowerCase().includes("function"));
  const rowsScanned = hasScan ? "100K" : result ? `${result.row_count || 0}` : "--";
  const cost = Math.min(100, (hasScan ? 55 : 16) + (hasSort ? 20 : 0) + (hasFunction ? 18 : 0));

  return { cost, hasFunction, hasScan, hasSort, rowsScanned };
}

export default function CostVisualizer({ result }) {
  const data = estimate(result);
  const cells = Array.from({ length: 30 }, (_, index) => index);

  return (
    <section className="result-block cost-card">
      <div className="block-heading">
        <h2>Live Query Cost Visualizer</h2>
        <span>{data.cost}/100 cost</span>
      </div>
      <div className="cost-grid">
        <div>
          <p className="cost-value">{data.rowsScanned}</p>
          <p className="cost-label">Rows scanned</p>
        </div>
        <div>
          <p className="cost-value">{data.hasScan ? "Table scan" : "Index path"}</p>
          <p className="cost-label">Access pattern</p>
        </div>
        <div>
          <p className="cost-value">{data.hasSort ? "Sort risk" : "No sort risk"}</p>
          <p className="cost-label">Bottleneck</p>
        </div>
      </div>
      <div className="heatmap" aria-label="scan heatmap">
        {cells.map((cell) => (
          <span
            className={cell < Math.round((data.cost / 100) * cells.length) ? "hot" : ""}
            key={cell}
          />
        ))}
      </div>
      <div className="bottleneck-row">
        <span className={data.hasScan ? "active" : ""}>Full scan</span>
        <span className={data.hasFunction ? "active" : ""}>Function filter</span>
        <span className={data.hasSort ? "active" : ""}>Sort pressure</span>
      </div>
    </section>
  );
}
