# OptiQuery

**Smarter Queries. Faster Databases.**

OptiQuery is an AI-powered SQL optimization dashboard. It accepts SQL queries, runs them against SQLite, analyzes `EXPLAIN QUERY PLAN`, detects bottlenecks, recommends indexes, rewrites inefficient SQL with Groq AI, benchmarks before/after runtime, and displays everything in a clean developer-focused UI.

## Features

- Monaco code editor with SQL syntax highlighting
- Animated health score ring (0–100) with color-coded severity
- AI-powered query explanations via Groq (with local fallback)
- Automatic SQL rewrite removing anti-patterns
- Before/after runtime benchmark charts
- Rule-based bottleneck detection with severity tags
- Index recommendations based on query patterns
- Interactive demo guide with step-by-step checklist
- Keyboard shortcut: `Ctrl+Enter` to analyze
- SQLite demo database with 100K orders, 5K customers, 500 products

## Architecture

```
Frontend (React + Vite)
    │
    ▼
POST /analyze (FastAPI)
    │
    ├── Parser Service (sqlglot)
    ├── Explain Service (EXPLAIN QUERY PLAN)
    ├── Rule Engine (pattern detection)
    ├── AI Service (Groq / fallback)
    ├── Benchmark Service (median of 3 runs)
    ├── Index Service (column analysis)
    └── Optimization Service (scoring)
    │
    ▼
SQLite Database
```

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | React 18, Vite, Monaco Editor, Recharts, Lucide Icons |
| Backend | FastAPI, Uvicorn, SQLite, sqlglot |
| AI | Groq (llama-3.1-8b-instant) |
| Database | SQLite (100K row demo dataset) |

## Project Structure

```
backend/
  app/
    api/
      routes.py            # POST /analyze endpoint
    db/
      database.db          # SQLite demo database
      db_connection.py      # Connection manager with WAL mode
      seed_db.py           # Generates demo data
    rules/
      query_rules.py       # Pattern-based issue detection
    services/
      ai_service.py        # Groq AI + fallback logic
      benchmark_service.py # Multi-run median benchmarking
      explain_service.py   # EXPLAIN QUERY PLAN parsing
      index_service.py     # Index recommendation engine
      optimization_service.py  # Health score + confidence
      parser_service.py    # SQL validation via sqlglot
    main.py                # FastAPI app + CORS
  requirements.txt

frontend/
  src/
    components/
      BenchmarkChart.jsx   # Bar + line charts
      ExplainPlan.jsx      # Visual query plan flow
      HealthScore.jsx      # Animated SVG score ring
      LoadingOverlay.jsx   # Analysis loading state
      MetricsCard.jsx      # Key metrics grid
      ResultPanel.jsx      # AI explanation, optimized SQL, issues
      SqlEditor.jsx        # Monaco editor wrapper
    data/
      demoQueries.js       # 5 pre-built demo queries
    hooks/
      useQueryAnalysis.js  # Core analysis state management
    layout/
      AppLayout.jsx        # Nav + footer shell
    pages/
      AnalyzerPage.jsx     # Main workbench
      DemoGuidePage.jsx    # Interactive demo checklist
      HomePage.jsx         # Landing page
    services/
      api.js               # API client with timeout handling
    App.jsx
    main.jsx
    styles.css             # Full design system
  index.html
  package.json
```

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app/db/seed_db.py
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Groq AI (Optional)

Without an API key, OptiQuery uses local fallback explanations and rewrites. The demo works fully offline.

To enable Groq on Windows PowerShell:

```powershell
$env:GROQ_API_KEY="your_key_here"
$env:GROQ_MODEL="llama-3.1-8b-instant"
```

Command Prompt:

```bat
set GROQ_API_KEY=your_key_here
set GROQ_MODEL=llama-3.1-8b-instant
```

### API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/analyze` | Analyze a SQL query |

**Request:**

```json
{
  "query": "SELECT * FROM orders WHERE LOWER(customer_name) = 'john';"
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `health_score` | int | Query quality score (0–100) |
| `ai_explanation` | string | Plain-language bottleneck analysis |
| `optimized_query` | string | Rewritten SQL |
| `issues` | string[] | Detected anti-patterns |
| `suggestions` | string[] | Optimization recommendations |
| `index_recommendations` | string[] | CREATE INDEX statements |
| `before_time` | float | Original query runtime (seconds) |
| `after_time` | float | Optimized query runtime (seconds) |
| `improvement_percent` | float | Performance improvement |
| `confidence` | int | Optimization confidence (0–95) |
| `plan` | object[] | SQLite EXPLAIN QUERY PLAN output |
| `columns` | string[] | Result column names |
| `rows` | object[] | Preview rows (max 100) |

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

If Vite has dependency issues, build and preview:

```bash
npm run build
npm run preview -- --port 5173
```

## Demo Queries

The app includes 5 built-in demo templates:

| Query | Anti-Pattern |
|-------|-------------|
| `SELECT * FROM orders WHERE LOWER(customer_name) = 'john'` | Function on column blocks indexes |
| `SELECT * FROM orders` | Full table scan, no filter |
| `SELECT * FROM orders ORDER BY amount` | Sort without index |
| `SELECT * FROM orders WHERE customer_name LIKE '%john%'` | Leading wildcard defeats indexes |
| `SELECT o.*, c.segment FROM orders o JOIN customers c ON o.customer_id = c.id` | Unfiltered join |

## Optimization Rules

| Rule | Severity | Deduction |
|------|----------|-----------|
| `SELECT *` detected | Warning | -20 |
| Full table scan | Critical | -40 |
| Missing `WHERE` clause | Warning | -20 |
| Function on column | Warning | -20 |
| Leading wildcard `LIKE '%...'` | Warning | -15 |
| `ORDER BY` without index (temp B-Tree) | Info | -10 |

## Demo Flow

1. Open the analyzer
2. Load the "Bad Function Usage" template
3. Click **Analyze** (or press `Ctrl+Enter`)
4. Walk through: health score → issues → AI explanation → optimized SQL
5. Click **Use this query** to apply the rewrite
6. Show benchmark charts and index recommendations
7. Close with measurable performance improvement

## Why OptiQuery?

Most SQL tools show raw `EXPLAIN` output. OptiQuery goes further:

- Translates bottlenecks into **plain English**
- **Rewrites** the SQL automatically
- **Recommends indexes** with ready-to-run DDL
- **Proves impact** with before/after benchmarks
- Scores query quality with a **health score**

## Future Work

- PostgreSQL and MySQL support
- CI/CD query check integration
- Query history persistence
- Cost-based optimization analysis
- Live database monitoring

## License

See [LICENSE](LICENSE).
