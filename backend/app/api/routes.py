from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.explain_service import get_query_plan, run_query_with_timing
from app.services.optimization_service import calculate_health_score, suggest_optimizations
from app.services.parser_service import parse_sql
from app.rules.query_rules import analyze_rules

router = APIRouter()


class AnalyzeRequest(BaseModel):
    query: str


@router.post("/analyze")
def analyze_query(data: AnalyzeRequest):
    query = data.query.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Query is required")

    parsed = parse_sql(query)
    if not parsed["valid"]:
        raise HTTPException(status_code=400, detail=parsed["error"])

    if parsed["statement_type"] != "SELECT":
        raise HTTPException(status_code=400, detail="Sprint 1 supports SELECT queries only")

    try:
        plan = get_query_plan(query)
        execution = run_query_with_timing(query)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    issues = analyze_rules(query, plan)
    suggestions = suggest_optimizations(query, plan, issues)
    health_score = calculate_health_score(query, plan, issues)

    return {
        "query": query,
        "statement_type": parsed["statement_type"],
        "plan": plan,
        "issues": issues,
        "suggestions": suggestions,
        "execution_time": execution["execution_time"],
        "row_count": execution["row_count"],
        "columns": execution["columns"],
        "rows": execution["rows"],
        "truncated": execution["truncated"],
        "health_score": health_score,
    }
