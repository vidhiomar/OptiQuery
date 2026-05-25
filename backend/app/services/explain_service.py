import time

from app.db.db_connection import get_connection

MAX_PREVIEW_ROWS = 100


def get_query_plan(query):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(f"EXPLAIN QUERY PLAN {query}")
    rows = cursor.fetchall()

    conn.close()

    return [
        {
            "id": row[0],
            "parent": row[1],
            "not_used": row[2],
            "detail": row[3],
        }
        for row in rows
    ]


def run_query_with_timing(query):
    conn = get_connection()
    cursor = conn.cursor()

    start = time.perf_counter()
    cursor.execute(query)
    preview_rows = cursor.fetchmany(MAX_PREVIEW_ROWS + 1)
    end = time.perf_counter()

    columns = [description[0] for description in cursor.description or []]
    visible_rows = preview_rows[:MAX_PREVIEW_ROWS]

    conn.close()

    return {
        "execution_time": round(end - start, 6),
        "row_count": len(visible_rows),
        "columns": columns,
        "rows": [dict(row) for row in visible_rows],
        "truncated": len(preview_rows) > MAX_PREVIEW_ROWS,
    }
