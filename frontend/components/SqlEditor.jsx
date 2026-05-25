export default function SqlEditor({ query, onChange }) {
  return (
    <label className="sql-editor">
      <span>SQL Query Input</span>
      <textarea
        value={query}
        onChange={(event) => onChange(event.target.value)}
        spellCheck="false"
      />
    </label>
  );
}
