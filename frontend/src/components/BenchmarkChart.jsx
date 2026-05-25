import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  primary: "#6366f1",
  success: "#10b981",
  grid: "#e5e7eb",
  axis: "#9ca3af",
  surface: "#ffffff",
  ink: "#111827",
  border: "#e5e7eb",
};

function formatSeconds(value) {
  return `${value}s`;
}

const tooltipStyle = {
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: "8px",
  color: COLORS.ink,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  fontSize: "0.85rem",
};

export default function BenchmarkChart({ result }) {
  const before = result?.before_time ?? 0;
  const after = result?.after_time ?? 0;

  const chartData = [
    { name: "Before", runtime: before },
    { name: "After", runtime: after },
  ];

  const trendData = [
    { step: "Original", runtime: before },
    { step: "Rewrite", runtime: after || before },
  ];

  return (
    <section className="result-block chart-panel">
      <div className="block-header">
        <div>
          <p className="eyebrow">Benchmark</p>
          <h2>Before vs After Performance</h2>
        </div>
        {result?.improvement_percent != null && (
          <span className="improvement-badge">
            {result.improvement_percent > 0
              ? `${result.improvement_percent}% Faster`
              : "Benchmark Compared"}
          </span>
        )}
      </div>

      {result ? (
        <div className="chart-grid">
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData} barCategoryGap="35%">
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={COLORS.axis} fontSize={12} tickFormatter={formatSeconds} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}s`, "Runtime"]} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
                <Bar dataKey="runtime" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={trendData}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="step" stroke={COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={COLORS.axis} fontSize={12} tickFormatter={formatSeconds} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}s`, "Runtime"]} />
                <Line type="monotone" dataKey="runtime" stroke={COLORS.success} strokeWidth={3} dot={{ r: 6, fill: COLORS.success, stroke: COLORS.surface, strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="muted">Analyze a query to render benchmark charts.</p>
      )}
    </section>
  );
}
