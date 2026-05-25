import React, { useState } from "react";
import { Clipboard, Check, Wand2, CheckCircle2, AlertTriangle, Database, Table2 } from "lucide-react";

function getSeverity(item, title) {
  const t = item.toLowerCase();
  if (title === "Issues" && (t.includes("scan") || t.includes("missing where"))) return "Critical";
  if (title === "Issues") return "Warning";
  return "Recommended";
}

function ListBlock({ title, items, emptyText }) {
  return (
    <section className="result-block">
      <div className="block-heading">
        <h2>{title}</h2>
        {items.length > 0 && <span>{items.length}</span>}
      </div>
      {items.length ? (
        <ul className="tag-list">
          {items.map((item) => (
            <li key={item}>
              <span className={`severity-tag severity-${getSeverity(item, title).toLowerCase()}`}>
                {getSeverity(item, title)}
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">{emptyText}</div>
      )}
    </section>
  );
}

function AiExplanation({ result }) {
  return (
    <section className="result-block">
      <div className="block-heading">
        <h2>AI Explanation</h2>
      </div>
      <div className="ai-response">
        {result?.ai_explanation || "Run an analysis to see AI insights."}
      </div>
    </section>
  );
}

function OptimizedQuery({ result, onUseOptimizedQuery }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!result?.optimized_query) return;
    await navigator.clipboard.writeText(result.optimized_query);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="result-block">
      <div className="block-header">
        <h2>Optimized SQL</h2>
        <div className="button-group">
          <button className="icon-button" disabled={!result?.optimized_query} onClick={copy} title="Copy" type="button">
            {copied ? <Check size={14} /> : <Clipboard size={14} />}
          </button>
          <button className="secondary-button" disabled={!result?.optimized_query}
            onClick={() => onUseOptimizedQuery(result.optimized_query)} type="button">
            Use this query
          </button>
        </div>
      </div>
      {result?.optimized_query ? (
        <pre className="sql-output">{result.optimized_query}</pre>
      ) : (
        <div className="empty-state">Run an analysis to generate optimized SQL.</div>
      )}
      {copied && <p className="copy-feedback">Copied</p>}
    </section>
  );
}

function Summary({ result }) {
  const improved = result?.improvement_percent > 0;
  return (
    <section className="result-block">
      <div className="block-heading"><h2>Summary</h2></div>
      {result ? (
        <ul className="summary-list">
          <li>Optimized SQL generated</li>
          <li>{result.index_recommendations?.length ? "Index recommended" : "No index needed"}</li>
          <li>{improved ? `${result.improvement_percent}% faster` : "Benchmark completed"}</li>
        </ul>
      ) : (
        <div className="empty-state">Run an analysis to see summary.</div>
      )}
    </section>
  );
}

function PreviewTable({ result }) {
  if (!result?.rows?.length) return <div className="empty-state">No rows to display.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{result.columns.map(c => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {result.rows.slice(0, 10).map((row, i) => (
            <tr key={i}>{result.columns.map(c => <td key={c}>{String(row[c])}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResultPanel({ result, onUseOptimizedQuery }) {
  return (
    <div className="panel-stack">
      <AiExplanation result={result} />
      <OptimizedQuery result={result} onUseOptimizedQuery={onUseOptimizedQuery} />
      <Summary result={result} />
      <ListBlock title="Issues" items={result?.issues || []}
        emptyText={result ? "No issues found." : "Run an analysis."} />
      <ListBlock title="Suggestions" items={result?.suggestions || []}
        emptyText={result ? "No suggestions." : "Run an analysis."} />
      <ListBlock title="Index Recommendations" items={result?.index_recommendations || []}
        emptyText={result ? "No indexes needed." : "Run an analysis."} />
      <section className="result-block">
        <div className="block-heading">
          <h2>Query Results</h2>
          {result?.row_count != null && <span>{result.row_count} rows</span>}
        </div>
        <PreviewTable result={result} />
      </section>
    </div>
  );
}
