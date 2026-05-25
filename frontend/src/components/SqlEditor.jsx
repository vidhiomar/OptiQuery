import React from "react";
import Editor from "@monaco-editor/react";

export default function SqlEditor({ query, onChange }) {
  return (
    <label className="sql-editor">
      <span>
        SQL Editor
        <span className="kbd-hint">
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to analyze
        </span>
      </span>
      <div className="monaco-shell">
        <Editor
          height="300px"
          defaultLanguage="sql"
          theme="vs-dark"
          value={query}
          onChange={(value) => onChange(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            renderLineHighlight: "gutter",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          }}
        />
      </div>
      <textarea aria-hidden="true" className="native-editor-fallback" readOnly tabIndex="-1" value={query} />
    </label>
  );
}
