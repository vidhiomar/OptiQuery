from app.rules.query_rules import FUNCTION_ON_COLUMN_PATTERN


def suggest_optimizations(query, plan, issues):
    query_upper = query.upper()
    plan_text = " ".join(item["detail"] for item in plan).upper()
    suggestions = []

    if "SELECT *" in query_upper:
        suggestions.append("Select only the columns needed by the UI or report.")

    if "Full table scan detected" in issues:
        suggestions.append("Add an index on columns used in WHERE, JOIN, or ORDER BY clauses.")

    if "Missing WHERE clause" in issues:
        suggestions.append("Add a WHERE clause to limit rows before SQLite reads the full table.")

    if FUNCTION_ON_COLUMN_PATTERN.search(query):
        suggestions.append("Avoid wrapping indexed columns in functions; normalize stored data or compare against precomputed values.")

    if "USE TEMP B-TREE" in plan_text:
        suggestions.append("Add an index that matches the ORDER BY or GROUP BY columns.")

    return suggestions


def calculate_health_score(query, plan, issues):
    score = 100
    deductions = {
        "Avoid using SELECT *": 20,
        "Full table scan detected": 40,
        "Missing WHERE clause": 20,
        "Function on column detected": 20,
    }

    for issue, penalty in deductions.items():
        if issue in issues:
            score -= penalty

    plan_text = " ".join(item["detail"] for item in plan).upper()
    if "USE TEMP B-TREE" in plan_text:
        score -= 10

    return max(score, 0)


def calculate_confidence(query, plan, issues):
    score = 95
    plan_text = " ".join(item["detail"] for item in plan).upper()

    if "Avoid using SELECT *" in issues:
        score -= 10

    if "SCAN" in plan_text:
        score -= 20

    if "Function on column detected" in issues:
        score -= 10

    if "Missing WHERE clause" in issues:
        score -= 8

    if "USE TEMP B-TREE" in plan_text:
        score -= 7

    return max(score, 0)
