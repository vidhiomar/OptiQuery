export default function MetricsCard({ result }) {
  const score = result?.health_score ?? "--";
  const before = result ? `${result.before_time}s` : "--";
  const after = result?.after_time != null ? `${result.after_time}s` : "--";
  const confidence = result?.confidence != null ? `${result.confidence}%` : "--";

  return (
    <section className="metrics-grid">
      <div className="metric">
        <span>Health Score</span>
        <strong>{score}/100</strong>
      </div>
      <div className="metric">
        <span>Before Runtime</span>
        <strong>{before}</strong>
      </div>
      <div className="metric">
        <span>After Runtime</span>
        <strong>{after}</strong>
      </div>
      <div className="metric">
        <span>Confidence</span>
        <strong>{confidence}</strong>
      </div>
    </section>
  );
}
