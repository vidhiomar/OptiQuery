# OptiQuery

**Smarter Queries. Faster Databases.**

OptiQuery is an AI-powered SQL optimization dashboard for hackathon demos. It accepts SQL queries, runs them against SQLite, analyzes `EXPLAIN QUERY PLAN`, detects bottlenecks, recommends indexes, rewrites inefficient SQL with Groq, benchmarks before/after runtime, and presents everything in a polished developer-friendly UI.

## Features

- SQL input with Monaco editor and syntax highlighting
- FastAPI `/analyze` backend
- SQLite demo database with realistic `orders`, `customers`, and `products` seed data
- Query execution timing
- SQLite explain-plan parsing
- Rule-based bottleneck detection
- Groq-powered query explanation and rewrite
- Local fallback insights when no Groq API key is configured
- Index recommendations
- Before/after benchmark comparison
- Health score and optimization confidence
- Dark dashboard UI with charts, severity tags, demo mode, and copy buttons

## Architecture

```text
Frontend Dashboard
   |
   v
Analyze API
   |
   v
Optimization Engine
   |-- Explain Service
   |-- Rule Engine
   |-- Groq AI Service
   |-- Benchmark Service
   |-- Index Recommendation Engine
   |
   v
SQLite
```

## Tech Stack

- **Frontend:** React, Vite, Monaco Editor, Recharts, lucide-react
- **Backend:** FastAPI, Uvicorn, SQLite, sqlglot
- **AI Provider:** Groq
- **Database:** SQLite demo dataset

## Project Structure

```text
backend/
  app/
    api/routes.py
    db/
      database.db
      db_connection.py
      seed_db.py
    rules/query_rules.py
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
  components/
    BenchmarkChart.jsx
    ExplainPlan.jsx
    HealthScore.jsx
    LoadingOverlay.jsx
    MetricsCard.jsx
    ResultPanel.jsx
    SqlEditor.jsx
  services/api.js
  src/
  package.json
```

## Backend Setup

```bash
cd backend
python -m pip install -r requirements.txt
python app/db/seed_db.py
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Groq AI calls are optional. Without an API key, OptiQuery uses local fallback explanations and rewrites so the demo still works.

To enable Groq-backed responses on Windows PowerShell:

```powershell
$env:GROQ_API_KEY="your_groq_api_key_here"
$env:GROQ_MODEL="llama-3.1-8b-instant"
```

Or with Command Prompt:

```bat
set GROQ_API_KEY=your_groq_api_key_here
set GROQ_MODEL=llama-3.1-8b-instant
```

Backend URL:

```text
http://127.0.0.1:8000
```

Health check:

```text
GET /health
```

Analyze endpoint:

```text
POST /analyze
```

Request body:

```json
{
  "query": "SELECT * FROM orders WHERE LOWER(customer_name) = 'john';"
}
```

Response includes:

- `ai_explanation`
- `optimized_query`
- `index_recommendations`
- `before_time`
- `after_time`
- `improvement_percent`
- `confidence`
- `health_score`
- `plan`
- `issues`
- `suggestions`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev -- --port 5173
```

Frontend URL:

```text
http://127.0.0.1:5173
```

If Vite dev mode has local dependency optimization issues, build and preview instead:

```bash
npm run build
npm run preview -- --port 5173
```

## Demo Queries

Full table scan:

```sql
SELECT *
FROM orders;
```

Function blocks index-friendly filtering:

```sql
SELECT *
FROM orders
WHERE LOWER(customer_name) = 'john';
```

Sorting bottleneck:

```sql
SELECT *
FROM orders
ORDER BY amount;
```

## Final Demo Flow

1. Introduce the pain point: slow SQL is hard to diagnose and optimize quickly.
2. Open OptiQuery.
3. Click `Run Demo Mode` or load a query template.
4. Click `Analyze`.
5. Show the health score, bottlenecks, AI explanation, and visual explain plan.
6. Show the Groq-generated optimized query.
7. Show index recommendations.
8. Show before/after runtime charts and confidence score.
9. Close with: **faster query performance with AI optimization.**

## Judge-Friendly Summary

OptiQuery is different from basic explain-plan tools because it does not only show what SQLite is doing. It translates bottlenecks into plain English, rewrites inefficient SQL, recommends indexes, and proves impact with benchmark charts.

## Judge FAQs

**Why SQLite?**

SQLite keeps the demo lightweight and reliable for hackathon judging while preserving a modular backend that can later support PostgreSQL or MySQL.

**How is Groq used?**

Groq generates natural-language query explanations and optimized SQL rewrites. The app also has deterministic fallback logic so the demo remains stable without an API key.

**What makes this technically useful?**

OptiQuery combines execution-plan analysis, rule-based detection, AI explanation, SQL rewriting, index recommendations, and measurable benchmark comparison in one workflow.

**What is next?**

Future versions can add PostgreSQL, MySQL, CI/CD query checks, live monitoring, and deeper cost-based optimization.

## Current Optimization Rules

- Detects `SELECT *`
- Detects full table scans from SQLite query plans
- Detects missing `WHERE` clauses
- Detects functions applied to columns, such as `LOWER(customer_name)`
- Recommends indexes for common filters and sorts
- Rewrites simple demo queries into more index-friendly SQL

## License

See [LICENSE](LICENSE).
