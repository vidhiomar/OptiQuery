import time

from app.db.db_connection import get_connection

BENCHMARK_RUNS = 3


def benchmark_query(query):
    times = []
    for _ in range(BENCHMARK_RUNS):
        with get_connection() as conn:
            cursor = conn.cursor()
            start = time.perf_counter()
            cursor.execute(query)
            cursor.fetchall()
            end = time.perf_counter()
        times.append(end - start)

    times.sort()
    return round(times[len(times) // 2], 6)  # median


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
