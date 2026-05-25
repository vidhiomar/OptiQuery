import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { DatabaseZap, Sparkles } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <NavLink className="brand-mark" to="/">
          <DatabaseZap size={20} />
          <span>OptiQuery</span>
        </NavLink>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/analyze">Analyzer</NavLink>
          <NavLink to="/demo">Demo Guide</NavLink>
        </nav>
        <div className="nav-actions">
          <span className="nav-badge">
            <Sparkles size={10} />
            AI Powered
          </span>
        </div>
      </header>
      <Outlet />
      <footer className="app-footer">
        <span>© 2025 OptiQuery — Smarter Queries, Faster Databases</span>
        <span>Built with FastAPI + React + Groq AI</span>
      </footer>
    </div>
  );
}
