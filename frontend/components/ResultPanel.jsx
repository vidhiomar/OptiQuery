function ListBlock({ title, items, emptyText }) {
  return (
    <section className="result-block">
      <h2>{title}</h2>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="muted">{emptyText}</p>
      )}
    </section>
  );
}

function AiExplanation({ result }) {
  return (
    <section className="result-block">
      <h2>Why Is This Query Slow?</h2>
      <p className="insight-text">
        {result?.ai_explanation || "Run an analysis to generate AI optimization insight."}
      </p>
    </section>
  );
}

function OptimizedQuery({ result, onUseOptimizedQuery }) {
  return (
    <section className="result-block">
      <div className="block-header">
        <h2>Optimized SQL</h2>
        <button
          className="secondary-button"
          disabled={!result?.optimized_query}
          onClick={() => onUseOptimizedQuery(result.optimized_query)}
          type="button"
        >
          Use Optimized SQL
        </button>
      </div>
      {result?.optimized_query ? (
        <pre className="sql-output">{result.optimized_query}</pre>
      ) : (
        <p className="muted">Run an analysis to generate optimized SQL.</p>
      )}
    </section>
  );
}

function BenchmarkPanel({ result }) {
  return (
    <section className="result-block">
      <h2>Benchmark Comparison</h2>
      {result ? (
        <div className="benchmark-grid">
          <div>
            <span>Before</span>
            <strong>{result.before_time}s</strong>
          </div>
          <div>
            <span>After</span>
            <strong>{result.after_time == null ? "--" : `${result.after_time}s`}</strong>
          </div>
          <div>
            <span>Improvement</span>
            <strong>
              {result.improvement_percent == null ? "--" : `${result.improvement_percent}%`}
            </strong>
          </div>
        </div>
      ) : (
        <p className="muted">Run an analysis to compare original and optimized runtime.</p>
      )}
    </section>
  );
}

function PreviewTable({ result }) {
  if (!result?.rows?.length) {
    return <p className="muted">Run a query to preview rows.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {result.columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.slice(0, 10).map((row, index) => (
            <tr key={index}>
              {result.columns.map((column) => (
                <td key={column}>{String(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {result.truncated && <p className="muted">Showing first 10 rows from a 100 row API preview.</p>}
    </div>
  );
}

export default function ResultPanel({ result, onUseOptimizedQuery }) {
  return (
    <div className="panel-stack">
      <AiExplanation result={result} />
      <OptimizedQuery result={result} onUseOptimizedQuery={onUseOptimizedQuery} />
      <BenchmarkPanel result={result} />
      <ListBlock
        title="Issues"
        items={result?.issues || []}
        emptyText={result ? "No bottlenecks detected by current rules." : "Run an analysis to see issues."}
      />
      <ListBlock
        title="Optimization Suggestions"
        items={result?.suggestions || []}
        emptyText={result ? "No suggestions needed." : "Run an analysis to see suggestions."}
      />
      <ListBlock
        title="Index Recommendations"
        items={result?.index_recommendations || []}
        emptyText={result ? "No index recommendations for this query." : "Run an analysis to see index recommendations."}
      />
      <section className="result-block">
        <h2>Query Results</h2>
        <PreviewTable result={result} />
      </section>
    </div>
  );
}
