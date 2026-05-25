import sqlglot


def parse_sql(query):
    try:
        expressions = sqlglot.parse(query, read="sqlite")
    except Exception as exc:
        return {"valid": False, "error": f"Invalid SQL: {exc}", "statement_type": None}

    if not expressions:
        return {"valid": False, "error": "Query is empty", "statement_type": None}

    statement = expressions[0]
    return {
        "valid": True,
        "error": None,
        "statement_type": statement.key.upper(),
    }
