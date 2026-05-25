import React, { useState } from "react";
import { CheckCircle2, Clipboard, Check, Sparkles, Wand2, AlertTriangle, ListChecks, Database, Table2 } from "lucide-react";

function getSeverity(item, title) {
  const text = item.toLowerCase();
  if (title.includes("Issues") && (text.includes("scan") || text.includes("missing where"))) return "Critical";
  if (title.includes("Issues")) return "Warning";
  return "Recommended";
}

function ListBlock({ title, items, emptyText, icon: Icon }) {
  return (
    <section className="result-block">
      <div className="block-heading">
        <div className="block-title">
          {Icon && <Icon size={16} />}
          <h2>{title}</h2>
        </div>
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
      <div className="block-title">
        <Sparkles size={16} />
        <h2>AI Explanation</h2>
      </div>
      <div className="chat-bubble">
        {result?.ai_explanation || "Run an analysis to generate AI optimization insight."}
      </div>
    </section>
  );
}

function OptimizedQuery({ result, onUseOptimizedQuery }) {
  const [copied, setCopied] = useState(false);

  async function copyQuery() {
    if (result?.optimized_query) {
      await navigator.clipboard.writeText(result.optimized_query);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section className="result-block">
      <div className="block-header">
        <div className="block-title">
          <Wand2 size={16} />
          <h2>Optimized SQL</h2>
        </div>
        <div className="button-group">
          <button className="icon-button" disabled={!result?.optimized_query} onClick={copyQuery} title={copied ? "Copied!" : "Copy"} type="button">
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
          </button>
          <button className="secondary-button" disabled={!result?.optimized_query} onClick={() => onUseOptimizedQuery(result.optimized_query)} type="button">
            Use Optimized SQL
          </button>
        </div>
      </div>
      {result?.optimized_query ? (
        <pre className="sql-output">{result.optimized_query}</pre>
      ) : (
        <div className="empty-state">Run an analysis to generate optimized SQL.</div>
      )}
      {copied && <p className="copy-feedback">✓ Copied to clipboard</p>}
    </section>
  );
}

function SummaryPanel({ result }) {
  const improved = result?.improvement_percent != null && result.improvement_percent > 0;
  return (
    <section className="result-block">
      <div className="block-title">
        <CheckCircle2 size={16} />
        <h2>Optimization Summary</h2>
      </div>
      {result ? (
        <ul className="summary-list">
          <li>Optimized SQL generated</li>
          <li>{result.index_recommendations?.length ? "Index recommendation generated" : "No index needed by current rules"}</li>
          <li>{improved ? `Runtime improved by ${result.improvement_percent}%` : "Benchmark comparison completed"}</li>
        </ul>
      ) : (
        <div className="empty-state">Run an analysis to generate the demo summary.</div>
      )}
    </section>
  );
}

function PreviewTable({ result }) {
  if (!result?.rows?.length) return <div className="empty-state">Run a query to preview rows.</div>;
  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>{result.columns.map((col) => <th key={col}>{col}</th>)}</tr>
          </thead>
          <tbody>
            {result.rows.slice(0, 10).map((row, i) => (
              <tr key={i}>{result.columns.map((col) => <td key={col}>{String(row[col])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.truncated && <p className="muted" style={{ marginTop: 10, textAlign: "center" }}>Showing first 10 of 100 rows.</p>}
    </>
  );
}

export default function ResultPanel({ result, onUseOptimizedQuery }) {
  return (
    <div className="panel-stack">
      <AiExplanation result={result} />
      <OptimizedQuery result={result} onUseOptimizedQuery={onUseOptimizedQuery} />
      <SummaryPanel result={result} />
      <ListBlock title="Issues" icon={AlertTriangle} items={result?.issues || []} emptyText={result ? "No bottlenecks detected." : "Run an analysis to see issues."} />
      <ListBlock title="Suggestions" icon={ListChecks} items={result?.suggestions || []} emptyText={result ? "No suggestions needed." : "Run an analysis to see suggestions."} />
      <ListBlock title="Index Recommendations" icon={Database} items={result?.index_recommendations || []} emptyText={result ? "No index recommendations." : "Run an analysis to see recommendations."} />
      <section className="result-block">
        <div className="block-heading">
          <div className="block-title"><Table2 size={16} /><h2>Query Results</h2></div>
          {result?.row_count != null && <span>{result.row_count} rows</span>}
        </div>
        <PreviewTable result={result} />
      </section>
    </div>
  );
}
