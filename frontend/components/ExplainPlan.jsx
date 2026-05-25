export default function ExplainPlan({ plan }) {
  return (
    <section className="result-block">
      <h2>Explain Plan</h2>
      {plan.length ? (
        <div className="plan-list">
          {plan.map((step) => (
            <div className="plan-step" key={`${step.id}-${step.parent}-${step.detail}`}>
              <span>#{step.id}</span>
              <p>{step.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">Run an analysis to see SQLite's query plan.</p>
      )}
    </section>
  );
}
