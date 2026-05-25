import time

from app.db.db_connection import get_connection


def benchmark_query(query):
    conn = get_connection()
    cursor = conn.cursor()

    start = time.perf_counter()
    cursor.execute(query)
    cursor.fetchall()
    end = time.perf_counter()

    conn.close()

    return round(end - start, 6)


def compare_queries(original_query, optimized_query):
    before_time = benchmark_query(original_query)
    after_time = benchmark_query(optimized_query)
    improvement = 0

    if before_time > 0:
        improvement = round(((before_time - after_time) / before_time) * 100, 2)

    return {
        "before_time": before_time,
        "after_time": after_time,
        "improvement_percent": improvement,
    }
