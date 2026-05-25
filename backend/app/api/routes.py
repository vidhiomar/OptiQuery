from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db.db_connection import get_connection
from app.services.ai_service import explain_query, optimize_query
from app.services.benchmark_service import compare_queries
from app.services.explain_service import get_query_plan, run_query_with_timing
from app.services.index_service import suggest_indexes
from app.services.optimization_service import (
    calculate_confidence,
    calculate_health_score,
    suggest_optimizations,
)
from app.services.parser_service import parse_sql
from app.rules.query_rules import analyze_rules

router = APIRouter()


class AnalyzeRequest(BaseModel):
    query: str


class ApplyIndexRequest(BaseModel):
    index_sql: str


@router.post("/analyze")
def analyze_query(data: AnalyzeRequest):
    query = data.query.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Query is required")

    parsed = parse_sql(query)
    if not parsed["valid"]:
        raise HTTPException(status_code=400, detail=parsed["error"])

    if parsed["statement_type"] != "SELECT":
        raise HTTPException(status_code=400, detail="OptiQuery supports SELECT queries only")

    try:
        plan = get_query_plan(query)
        execution = run_query_with_timing(query)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    issues = analyze_rules(query, plan)
    suggestions = suggest_optimizations(query, plan, issues)
    index_recommendations = suggest_indexes(query)
    optimized_query = optimize_query(query)
    health_score = calculate_health_score(query, plan, issues)
    confidence = calculate_confidence(query, plan, issues)
    ai_explanation = explain_query(query, plan, issues, index_recommendations)

    try:
        benchmark = compare_queries(query, optimized_query)
    except Exception:
        benchmark = {
            "before_time": execution["execution_time"],
            "after_time": None,
            "improvement_percent": None,
        }

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
        "ai_explanation": ai_explanation,
        "optimized_query": optimized_query,
        "index_recommendations": index_recommendations,
        "before_time": benchmark["before_time"],
        "after_time": benchmark["after_time"],
        "improvement_percent": benchmark["improvement_percent"],
        "confidence": confidence,
    }


@router.post("/apply-index")
def apply_index(data: ApplyIndexRequest):
    index_sql = data.index_sql.strip().rstrip(";")
    normalized = f" {index_sql.upper()} "

    if not normalized.strip().startswith("CREATE INDEX"):
        raise HTTPException(status_code=400, detail="Only CREATE INDEX statements are supported")

    if any(token in normalized for token in [" DROP ", " DELETE ", " UPDATE ", " INSERT ", " ALTER "]):
        raise HTTPException(status_code=400, detail="Unsafe index statement")

    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(index_sql)
            conn.commit()
    except Exception as exc:
        if "already exists" in str(exc).lower():
            return {"applied": False, "message": "Index already exists"}
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {"applied": True, "message": "Index applied"}
