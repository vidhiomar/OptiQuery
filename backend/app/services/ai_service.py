import os
import re


def _plan_text(plan):
    return "\n".join(item["detail"] for item in plan)


def _fallback_explanation(query, plan, issues, index_recommendations):
    details = []

    if "Full table scan detected" in issues:
        details.append("SQLite is scanning the orders table instead of narrowing the lookup with an index.")

    if "Function on column detected" in issues:
        details.append("The filter applies a function to a column, which can prevent normal index usage.")

    if "Avoid using SELECT *" in issues:
        details.append("The query returns every column, increasing the amount of data SQLite must read and return.")

    if "Missing WHERE clause" in issues:
        details.append("There is no WHERE clause, so SQLite must inspect and return a broad result set.")

    if not details:
        details.append("The query plan does not show a major bottleneck covered by the current rules.")

    recommendations = [
        "Select only the columns needed by the frontend.",
        "Use direct comparisons on indexed columns where possible.",
    ]

    if index_recommendations:
        recommendations.append(f"Create the recommended index: {index_recommendations[0]}")

    return " ".join(details) + "\n\nRecommended actions:\n- " + "\n- ".join(recommendations)


def generate_ai_response(prompt):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None

    try:
        from groq import Groq

        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=700,
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return None


def explain_query(query, plan, issues, index_recommendations):
    prompt = f"""
You are a database optimization expert.

Analyze this SQLite query and explain:
1. Why it is slow
2. What bottlenecks exist
3. How to optimize it

Query:
{query}

Execution Plan:
{_plan_text(plan)}

Detected Issues:
{issues}

Index Recommendations:
{index_recommendations}
"""
    return generate_ai_response(prompt) or _fallback_explanation(query, plan, issues, index_recommendations)


def _fallback_rewrite(query):
    optimized = query.strip().rstrip(";")
    optimized = re.sub(
        r"SELECT\s+\*",
        "SELECT id, customer_name, order_date, amount",
        optimized,
        count=1,
        flags=re.IGNORECASE,
    )
    optimized = re.sub(
        r"LOWER\s*\(\s*customer_name\s*\)\s*=\s*'john'",
        "customer_name = 'John'",
        optimized,
        flags=re.IGNORECASE,
    )
    return optimized + ";"


def optimize_query(query):
    prompt = f"""
Optimize this SQLite SQL query.

Requirements:
- Improve performance
- Avoid SELECT *
- Use index-friendly filtering
- Keep the same intent
- Return only SQL with no markdown fence

Query:
{query}
"""
    response = generate_ai_response(prompt)
    if response:
        return response.replace("```sql", "").replace("```", "").strip()

    return _fallback_rewrite(query)
