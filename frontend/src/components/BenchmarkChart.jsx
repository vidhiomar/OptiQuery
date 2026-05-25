import React from "react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const C = {
  green: "#059669",
  orange: "#ea580c",
  grid: "#e7e5e4",
  axis: "#a8a29e",
  bg: "#fafaf9",
  surface: "#ffffff",
  ink: "#1c1917",
  border: "#e7e5e4",
};

const tip = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: "6px",
  color: C.ink,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  fontSize: "0.82rem",
};

export default function BenchmarkChart({ result }) {
  const before = result?.before_time ?? 0;
  const after = result?.after_time ?? 0;

  const barData = [
    { name: "Before", runtime: before },
    { name: "After", runtime: after },
  ];
  const lineData = [
    { step: "Original", runtime: before },
    { step: "Optimized", runtime: after || before },
  ];

  return (
    <section className="result-block chart-panel">
      <div className="block-header">
        <div>
          <p className="section-label">Benchmark</p>
          <h2>Before vs After</h2>
        </div>
        {result?.improvement_percent != null && (
          <span className="improvement-badge">
            {result.improvement_percent > 0 ? `${result.improvement_percent}% faster` : "compared"}
          </span>
        )}
      </div>
      {result ? (
        <div className="chart-grid">
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={barData} barCategoryGap="40%">
                <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke={C.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={C.axis} fontSize={11} tickFormatter={v => `${v}s`} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} formatter={v => [`${v}s`, "Runtime"]} cursor={{ fill: "rgba(5,150,105,0.04)" }} />
                <Bar dataKey="runtime" fill={C.green} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={lineData}>
                <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="step" stroke={C.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={C.axis} fontSize={11} tickFormatter={v => `${v}s`} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} formatter={v => [`${v}s`, "Runtime"]} />
                <Line type="monotone" dataKey="runtime" stroke={C.orange} strokeWidth={2.5}
                  dot={{ r: 5, fill: C.orange, stroke: C.surface, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="muted">Analyze a query to see benchmarks.</p>
      )}
    </section>
  );
}
