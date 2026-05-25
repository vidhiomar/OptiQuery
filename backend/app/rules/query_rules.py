import re

FUNCTION_ON_COLUMN_PATTERN = re.compile(
    r"\b(LOWER|UPPER|DATE|SUBSTR|TRIM|ROUND|CAST)\s*\(\s*[A-Z_][A-Z0-9_\.]*",
    re.IGNORECASE,
)

LEADING_WILDCARD_PATTERN = re.compile(
    r"LIKE\s+['\"]%", re.IGNORECASE
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

    if LEADING_WILDCARD_PATTERN.search(query):
        issues.append("Leading wildcard in LIKE defeats indexes")

    if "ORDER BY" in query_upper and "USE TEMP B-TREE" in plan_text:
        issues.append("ORDER BY requires temp B-Tree (missing index)")

    return issues
