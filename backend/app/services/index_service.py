import re


def suggest_indexes(query):
    query_lower = query.lower()
    suggestions = []

    if "customer_name" in query_lower:
        suggestions.append("CREATE INDEX idx_orders_customer_name ON orders(customer_name);")

    if re.search(r"\border\s+by\s+amount\b", query_lower):
        suggestions.append("CREATE INDEX idx_orders_amount ON orders(amount);")

    if "order_date" in query_lower:
        suggestions.append("CREATE INDEX idx_orders_order_date ON orders(order_date);")

    if "customer_id" in query_lower:
        suggestions.append("CREATE INDEX idx_orders_customer_id ON orders(customer_id);")

    if "product_id" in query_lower:
        suggestions.append("CREATE INDEX idx_orders_product_id ON orders(product_id);")

    return suggestions
