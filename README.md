# OptiQuery

**Smarter Queries. Faster Databases.**

OptiQuery is an AI-assisted SQL optimization dashboard that turns slow SQL into an explainable, measurable performance story. It analyzes SQLite execution plans, detects bottlenecks, explains them with Groq, rewrites inefficient SQL, recommends indexes, applies indexes with one click, and visualizes performance improvement in a polished React dashboard.

> Positioning: OptiQuery combines deterministic database optimization rules with LLM-powered query reasoning to provide reliable, explainable optimization.

---

## Why It Stands Out

Most SQL tools stop at raw `EXPLAIN` output. OptiQuery turns that into a product experience:

- **Live Query Cost Visualizer**: rows scanned, estimated cost, scan heatmap, and bottleneck indicators.
- **Optimization Timeline**: original query -> detected issues -> AI rewrite -> index recommendation -> applied index -> final benchmark.
- **One-click Apply Index**: apply recommended `CREATE INDEX` statements directly to SQLite and rerun analysis.
- **Query Complexity Meter**: classifies queries as `Easy`, `Moderate`, `Expensive`, or `Dangerous`.
- **Groq AI Insights**: explains why the query is slow and generates optimized SQL.
- **Benchmark Dashboard**: shows before/after runtime with Recharts.
- **Monaco SQL Editor**: syntax-highlighted SQL editing with a polished developer workflow.
- **Demo Templates**: beginner, enterprise, ORM, and analytics query mistakes for fast judging demos.

---

## Product Demo Flow

1. Open the Analyzer.
2. Load a bad query template.
3. Click **Analyze**.
4. Show health score, query complexity, cost heatmap, and detected bottlenecks.
5. Show the Groq-powered explanation and optimized SQL.
6. Click **Apply index** on a recommended index.
7. Watch the optimization timeline advance.
8. Show before/after runtime and final impact.

Best closing line:

> "OptiQuery does not just tell you a query is slow. It explains why, fixes it, and proves the improvement."

---

## Architecture

```text
React Dashboard
  |
  | POST /analyze
  v
FastAPI Backend
  |
  |-- SQL Parser
  |-- Explain Service
  |-- Rule Engine
  |-- Groq AI Service
  |-- Benchmark Service
  |-- Index Recommendation Engine
  |-- Apply Index API
  v
SQLite Demo Database
```

### Optimization Pipeline

```text
SQL Input
  -> Parse query
  -> Run EXPLAIN QUERY PLAN
  -> Detect bottlenecks
  -> Generate AI explanation
  -> Rewrite SQL
  -> Recommend indexes
  -> Benchmark original vs optimized
  -> Render dashboard insights
```

---

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, React Router, Monaco Editor, Recharts, Lucide Icons |
| Backend | FastAPI, Uvicorn, SQLite, sqlglot |
| AI | Groq API with local fallback |
| Database | SQLite demo dataset |
| Visualization | Health score, benchmark charts, cost heatmap, execution timeline |

---

## Project Structure

```text
backend/
  app/
    api/
      routes.py
    db/
      database.db
      db_connection.py
      seed_db.py
    rules/
      query_rules.py
    services/
      ai_service.py
      benchmark_service.py
      explain_service.py
      index_service.py
      optimization_service.py
      parser_service.py
    main.py
  requirements.txt

frontend/
  src/
    components/
      BenchmarkChart.jsx
      ComplexityMeter.jsx
      CostVisualizer.jsx
      ExplainPlan.jsx
      HealthScore.jsx
      LoadingOverlay.jsx
      MetricsCard.jsx
      OptimizationTimeline.jsx
      ResultPanel.jsx
      SqlEditor.jsx
    data/
      demoQueries.js
    hooks/
      useQueryAnalysis.js
    layout/
      AppLayout.jsx
    pages/
      AnalyzerPage.jsx
      DemoGuidePage.jsx
      HomePage.jsx
    services/
      api.js
    App.jsx
    main.jsx
    styles.css
```

---

## Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python app/db/seed_db.py
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

If Vite picks another port, the backend CORS config supports local dev ports.

---

## Groq Setup

Groq is optional. Without a key, OptiQuery uses local fallback explanations and rewrites so the demo still works.

PowerShell:

```powershell
$env:GROQ_API_KEY="your_groq_api_key_here"
$env:GROQ_MODEL="llama-3.1-8b-instant"
```

Command Prompt:

```bat
set GROQ_API_KEY=your_groq_api_key_here
set GROQ_MODEL=llama-3.1-8b-instant
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Backend health check |
| `POST` | `/analyze` | Analyze a SQL query |
| `POST` | `/apply-index` | Apply a recommended SQLite index |

### Analyze Request

```json
{
  "query": "SELECT * FROM orders WHERE LOWER(customer_name) = 'john';"
}
```

### Analyze Response

```json
{
  "health_score": 20,
  "confidence": 55,
  "ai_explanation": "SQLite is scanning the orders table...",
  "optimized_query": "SELECT id, customer_name, order_date, amount FROM orders WHERE customer_name = 'John';",
  "issues": ["Avoid using SELECT *", "Full table scan detected"],
  "suggestions": ["Select only required columns"],
  "index_recommendations": ["CREATE INDEX idx_orders_customer_name ON orders(customer_name);"],
  "before_time": 0.09,
  "after_time": 0.03,
  "improvement_percent": 66.7,
  "plan": []
}
```

### Apply Index Request

```json
{
  "index_sql": "CREATE INDEX idx_orders_customer_name ON orders(customer_name);"
}
```

---

## Demo Query Templates

| Category | Query | What It Shows |
|---|---|---|
| Beginner mistake | `SELECT * FROM orders;` | Full table scan and missing filter |
| Beginner mistake | `LOWER(customer_name) = 'john'` | Function blocks index-friendly filtering |
| Analytics query | `ORDER BY amount` | Sort pressure and index opportunity |
| Enterprise mistake | `LIKE '%john%'` | Leading wildcard defeats indexes |
| ORM mistake | Unfiltered join | Broad joined result set |

---

## Optimization Signals

OptiQuery detects and visualizes:

- `SELECT *`
- Full table scans
- Missing `WHERE` clauses
- Functions applied to columns
- Leading wildcard searches
- Sort bottlenecks
- Join complexity
- Index opportunities

These signals feed:

- health score
- confidence score
- complexity meter
- query cost visualizer
- AI explanation
- SQL rewrite
- index recommendations
- before/after benchmark

---

## Demo Dataset

| Table | Rows | Purpose |
|---|---:|---|
| `orders` | 100,000 | Main table for scan, sort, and filter demos |
| `customers` | 5,000 | Join and customer segmentation demos |
| `products` | 500 | Product lookup and future analytics demos |

---

## Judge FAQ

### Why SQLite?

SQLite keeps the demo lightweight, reliable, and easy to run during a hackathon. The architecture is modular enough to extend to PostgreSQL or MySQL later.

### Where is the AI used?

Groq is used for natural-language query reasoning and SQL rewrite generation. Deterministic database rules handle safety-critical detection so the system remains reliable and explainable.

### What makes OptiQuery different?

Most tools show raw query plans. OptiQuery explains the plan, rewrites the SQL, recommends indexes, applies indexes, and proves the improvement visually.

### Why is this useful?

Slow SQL is hard to debug and often requires database expertise. OptiQuery gives developers an immediate optimization workflow inside a friendly dashboard.

---

## Future Direction

OptiQuery can grow into enterprise developer tooling:

- VS Code extension
- GitHub PR SQL reviewer
- CI/CD optimization checks
- ORM query analyzer
- PostgreSQL and MySQL support
- Query history and team collaboration
- Live production monitoring
- Explain-plan visual diffs

---

## Pitch Summary

**Problem:** Slow SQL hurts application performance, but debugging execution plans requires deep expertise.

**Solution:** OptiQuery uses deterministic optimization rules plus Groq-powered reasoning to explain, rewrite, benchmark, and improve SQL queries.

**Impact:** Developers get faster queries, clearer bottleneck explanations, and measurable performance improvement in one workflow.

---

## License

See [LICENSE](LICENSE).
