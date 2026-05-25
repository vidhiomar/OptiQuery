import { useCallback, useState } from "react";

import { analyzeQuery, applyIndex as applyIndexRequest } from "../services/api.js";
import { demoQueries } from "../data/demoQueries.js";

export function useQueryAnalysis() {
  const [query, setQuery] = useState(demoQueries[0].query);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzedQuery, setAnalyzedQuery] = useState("");
  const [appliedIndexes, setAppliedIndexes] = useState([]);

  function normalize(value) {
    return value.trim().replace(/\s+/g, " ").replace(/;$/, "").toLowerCase();
  }

  const normalizedQuery = normalize(query);
  const normalizedAnalyzedQuery = normalize(analyzedQuery);
  const normalizedOptimizedQuery = normalize(result?.optimized_query || "");
  const isCurrentQueryAnalyzed = Boolean(normalizedQuery && normalizedQuery === normalizedAnalyzedQuery);
  const isCurrentQueryOptimized = Boolean(normalizedQuery && normalizedQuery === normalizedOptimizedQuery);
  const canOptimize = Boolean(result?.optimized_query && isCurrentQueryAnalyzed && !isCurrentQueryOptimized);

  const analyze = useCallback(
    async (nextQuery = query, options = {}) => {
      const norm = normalize(nextQuery);
      if (!options.force && norm && norm === normalizedAnalyzedQuery && result) return result;

      setLoading(true);
      setError("");

      try {
        const data = await analyzeQuery(nextQuery);
        setResult(data);
        setAnalyzedQuery(nextQuery);
        return data;
      } catch (err) {
        setResult(null);
        setError(err.message);
        setAnalyzedQuery("");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [query, normalizedAnalyzedQuery, result]
  );

  const runDemo = useCallback(async () => {
    const demo = demoQueries[0].query;
    setQuery(demo);
    return analyze(demo);
  }, [analyze]);

  function useOptimizedQuery(optimizedQuery) {
    setQuery(optimizedQuery);
  }

  function optimizeCurrentResult() {
    if (canOptimize) setQuery(result.optimized_query);
  }

  async function applyIndex(indexSql) {
    setLoading(true);
    setError("");

    try {
      const response = await applyIndexRequest(indexSql);
      setAppliedIndexes((current) => Array.from(new Set([...current, indexSql])));
      await analyze(query, { force: true });
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    analyze,
    appliedIndexes,
    applyIndex,
    canOptimize,
    error,
    isCurrentQueryAnalyzed,
    isCurrentQueryOptimized,
    loading,
    optimizeCurrentResult,
    query,
    result,
    runDemo,
    setQuery,
    useOptimizedQuery,
  };
}
