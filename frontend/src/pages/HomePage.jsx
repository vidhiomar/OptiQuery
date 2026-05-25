import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, BrainCircuit, Gauge, Wand2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Query Explanation",
    text: "Groq translates slow queries into plain-language bottleneck analysis.",
  },
  {
    icon: Wand2,
    title: "Automatic SQL Rewrite",
    text: "Generates index-friendly SQL, removes SELECT * and column functions.",
  },
  {
    icon: BarChart3,
    title: "Runtime Benchmarks",
    text: "Before/after execution timing proves optimization impact with data.",
  },
  {
    icon: Gauge,
    title: "Health Scoring",
    text: "Scores query quality from 0–100 based on plan analysis and rules.",
  },
];

export default function HomePage() {
  return (
    <main className="page-stack">
      <section className="landing-hero">
        <div>
          <span className="hero-label">SQL Optimization Tool</span>
          <h1>Find slow queries. Fix them fast.</h1>
          <p className="hero-desc">
            Paste a query, get an execution plan analysis, AI explanation,
            optimized rewrite, index recommendations, and benchmark comparison.
          </p>
          <div className="hero-actions">
            <Link className="btn-primary" to="/analyze">
              Open Analyzer
              <ArrowRight size={15} />
            </Link>
            <Link className="btn-ghost" to="/demo">Demo Script</Link>
          </div>
        </div>

        <div className="hero-visual">
          <span className="hero-visual-label">Before → After</span>
          <pre>{`-- Slow: full scan + function
SELECT *
FROM orders
WHERE LOWER(customer_name) = 'john';

-- Fast: direct lookup
SELECT id, customer_name, amount
FROM orders
WHERE customer_name = 'John';`}</pre>
          <p className="hero-visual-caption">Real optimization from OptiQuery</p>
        </div>
      </section>

      <section className="features-section">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div className="feature-item" key={item.title}>
              <Icon size={18} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
