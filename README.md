# OptiQuery

OptiQuery is a Sprint 1 SQL optimizer prototype. It accepts SQL queries, runs them against SQLite, analyzes `EXPLAIN QUERY PLAN`, detects basic bottlenecks, and returns optimization suggestions to a React frontend.

## Sprint 1 Scope

Built:

- SQL input UI
- FastAPI analyze endpoint
- SQLite database connection
- Query execution with timing
- SQLite explain plan parsing
- Rule-based bottleneck detection
- Basic optimization suggestions
- Health score
- Frontend result display

Not included yet:

- Authentication
- AI query rewriting
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
      explain_service.py
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
  "query": "SELECT * FROM orders;"
}
```

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

## License

See [LICENSE](LICENSE).
