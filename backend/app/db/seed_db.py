from db_connection import get_connection


def seed_database():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DROP TABLE IF EXISTS orders")
    cursor.execute(
        """
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY,
            customer_name TEXT,
            order_date TEXT,
            amount REAL
        )
        """
    )

    rows = [
        (i, "John" if i % 2 == 0 else "Jane", "2024-01-01", 500 + (i % 250))
        for i in range(100000)
    ]

    cursor.executemany(
        "INSERT INTO orders VALUES (?, ?, ?, ?)",
        rows,
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    seed_database()
    print("Seeded app/db/database.db with 100000 orders")
