# OptiQuery

OptiQuery is a Sprint 2 SQL optimizer prototype. It accepts SQL queries, runs them against SQLite, analyzes `EXPLAIN QUERY PLAN`, detects bottlenecks, generates optimized SQL, recommends indexes, benchmarks before/after runtime, and returns AI-powered optimization insights to a React frontend.

## Sprint Scope

Built:

- SQL input UI
- FastAPI analyze endpoint
- SQLite database connection
- Query execution with timing
- SQLite explain plan parsing
- Rule-based bottleneck detection
- Basic optimization suggestions
- Health score
- AI query explanation
- Optimized SQL generation
- Index recommendations
- Before/after benchmark comparison
- Optimization confidence score
- Frontend result display

Not included yet:

- Authentication
- Multi-agent systems
- RAG pipelines
- Advanced agents
- Complex dashboards
- Live monitoring

## Project Structure

```text
backend/
  app/
    api/routes.py
    db/
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

AI calls are optional. Without an API key, OptiQuery uses a local fallback so the demo still works. To enable OpenAI-backed responses:

```bash
set OPENAI_API_KEY=your_api_key_here
set OPENAI_MODEL=gpt-4.1-mini
```

The API runs at:

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

The frontend runs at:

```text
http://127.0.0.1:5173
```

If Vite dev mode has local dependency optimization issues, build and preview instead:

```bash
npm run build
npm run preview -- --port 5173
```

## Demo Queries

```sql
SELECT *
FROM orders
WHERE LOWER(customer_name) = 'john';
```

```sql
SELECT *
FROM orders;
```

```sql
SELECT *
FROM orders
ORDER BY amount;
```

## Current Rules

- Detects `SELECT *`
- Detects full table scans from SQLite query plans
- Detects missing `WHERE` clauses
- Detects functions applied to columns, such as `LOWER(customer_name)`
- Recommends indexes for common filters and sorts
- Rewrites simple demo queries into more index-friendly SQL

## License

See [LICENSE](LICENSE).
