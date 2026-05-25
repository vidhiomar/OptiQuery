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

export default function ResultPanel({ result }) {
  return (
    <div className="panel-stack">
      <ListBlock
        title="Issues"
        items={result?.issues || []}
        emptyText={result ? "No bottlenecks detected by Sprint 1 rules." : "Run an analysis to see issues."}
      />
      <ListBlock
        title="Suggestions"
        items={result?.suggestions || []}
        emptyText={result ? "No suggestions needed." : "Run an analysis to see suggestions."}
      />
      <section className="result-block">
        <h2>Query Results</h2>
        <PreviewTable result={result} />
      </section>
    </div>
  );
}
