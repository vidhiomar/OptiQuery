export default function MetricsCard({ result }) {
  const score = result?.health_score ?? "--";
  const timing = result ? `${result.execution_time}s` : "--";
  const rows = result ? `${result.row_count}${result.truncated ? "+" : ""}` : "--";

  return (
    <section className="metrics-grid">
      <div className="metric">
        <span>Health Score</span>
        <strong>{score}</strong>
      </div>
      <div className="metric">
        <span>Execution Time</span>
        <strong>{timing}</strong>
      </div>
      <div className="metric">
        <span>Preview Rows</span>
        <strong>{rows}</strong>
      </div>
    </section>
  );
}
