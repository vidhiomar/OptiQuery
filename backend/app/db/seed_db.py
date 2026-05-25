from db_connection import get_connection


def seed_database():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DROP TABLE IF EXISTS orders")
    cursor.execute("DROP TABLE IF EXISTS customers")
    cursor.execute("DROP TABLE IF EXISTS products")
    cursor.execute(
        """
        CREATE TABLE customers (
            id INTEGER PRIMARY KEY,
            customer_name TEXT,
            segment TEXT,
            region TEXT
        )
        """
    )
    cursor.execute(
        """
        CREATE TABLE products (
            id INTEGER PRIMARY KEY,
            product_name TEXT,
            category TEXT,
            price REAL
        )
        """
    )
    cursor.execute(
        """
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY,
            customer_id INTEGER,
            product_id INTEGER,
            customer_name TEXT,
            order_date TEXT,
            amount REAL,
            status TEXT
        )
        """
    )

    customer_names = ["John", "Jane", "Ava", "Maya", "Noah", "Liam", "Sophia", "Ethan"]
    regions = ["North", "South", "East", "West"]
    segments = ["Enterprise", "SMB", "Startup"]
    categories = ["Analytics", "Storage", "Security", "Compute"]
    statuses = ["paid", "pending", "refunded", "shipped"]

    customers = [
        (i, customer_names[i % len(customer_names)], segments[i % len(segments)], regions[i % len(regions)])
        for i in range(1, 5001)
    ]
    products = [
        (i, f"Product {i}", categories[i % len(categories)], 25 + (i % 300))
        for i in range(1, 501)
    ]
    orders = [
        (
            i,
            (i % 5000) + 1,
            (i % 500) + 1,
            customer_names[i % len(customer_names)],
            f"2024-{((i % 12) + 1):02d}-{((i % 28) + 1):02d}",
            75 + (i % 2500) * 1.25,
            statuses[i % len(statuses)],
        )
        for i in range(100000)
    ]

    cursor.executemany("INSERT INTO customers VALUES (?, ?, ?, ?)", customers)
    cursor.executemany("INSERT INTO products VALUES (?, ?, ?, ?)", products)
    cursor.executemany("INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?)", orders)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    seed_database()
    print("Seeded app/db/database.db with 5000 customers, 500 products, and 100000 orders")
