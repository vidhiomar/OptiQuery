import re

FUNCTION_ON_COLUMN_PATTERN = re.compile(
    r"\b(LOWER|UPPER|DATE|SUBSTR|TRIM|ROUND|CAST)\s*\(\s*[A-Z_][A-Z0-9_\.]*",
    re.IGNORECASE,
)


def analyze_rules(query, plan):
    query_upper = query.upper()
    plan_text = " ".join(item["detail"] for item in plan).upper()

    issues = []

    if "SELECT *" in query_upper:
        issues.append("Avoid using SELECT *")

    if "SCAN" in plan_text:
        issues.append("Full table scan detected")

    if "WHERE" not in query_upper:
        issues.append("Missing WHERE clause")

    if FUNCTION_ON_COLUMN_PATTERN.search(query):
        issues.append("Function on column detected")

    return issues
