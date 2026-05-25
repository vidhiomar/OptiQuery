import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { DatabaseZap } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <NavLink className="brand-mark" to="/">
          <DatabaseZap size={18} />
          OptiQuery
        </NavLink>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/analyze">Analyzer</NavLink>
          <NavLink to="/demo">Demo</NavLink>
        </nav>
        <span className="nav-status">Online</span>
      </header>
      <Outlet />
      <footer className="app-footer">
        <span>OptiQuery</span>
        <span>FastAPI · React · SQLite</span>
      </footer>
    </div>
  );
}
