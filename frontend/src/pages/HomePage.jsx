import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, BrainCircuit, Gauge, Wand2, ArrowRight, Zap } from "lucide-react";

const highlights = [
  {
    icon: BrainCircuit,
    title: "Groq AI Insights",
    text: "Explain slow queries in plain language so teams understand the bottleneck immediately.",
    color: "indigo",
  },
  {
    icon: Wand2,
    title: "SQL Rewrites",
    text: "Generate index-friendly SQL and remove common anti-patterns like SELECT * and column functions.",
    color: "violet",
  },
  {
    icon: BarChart3,
    title: "Benchmarks",
    text: "Show before/after runtime so the optimization story is measurable, not just theoretical.",
    color: "amber",
  },
  {
    icon: Gauge,
    title: "Health Score",
    text: "Turn query quality into a judge-friendly score with issues, confidence, and recommendations.",
    color: "emerald",
  },
];

export default function HomePage() {
  return (
    <main className="page-stack">
      <section className="landing-hero">
        <div>
          <p className="eyebrow">
            <Zap size={11} />
            Smarter Queries. Faster Databases.
          </p>
          <h1>
            Optimize SQL{" "}
            <span className="gradient-text">Instantly</span>
            {" "}with AI
          </h1>
          <p>
            Detect bottlenecks, rewrite inefficient queries, recommend indexes,
            and prove performance improvement — all in one clean workflow.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/analyze">
              Analyze a Query
              <ArrowRight size={16} />
            </Link>
            <Link className="secondary-link" to="/demo">View Demo Flow</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>100K+</strong>
              <span>Orders in demo DB</span>
            </div>
            <div className="hero-stat">
              <strong>&lt;2s</strong>
              <span>Analysis time</span>
            </div>
            <div className="hero-stat">
              <strong>6</strong>
              <span>Optimization rules</span>
            </div>
          </div>
        </div>
        <div className="hero-proof">
          <span>Demo impact</span>
          <strong>AI + Explain Plan + Benchmarks</strong>
          <p>
            Built for a fast live walkthrough: slow query → bottleneck
            explanation → rewrite → index recommendation → measurable improvement.
          </p>
        </div>
      </section>

      <section className="feature-grid">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <article className="feature-card" key={item.title}>
              <div className={`feature-icon ${item.color}`}>
                <Icon size={20} />
              </div>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
