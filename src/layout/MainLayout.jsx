import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./layout.css";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app">
      {/* ☰ Mobile Hamburger */}
      <button className="hamburger" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Advika Auto</h2>
          <button className="close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <nav onClick={() => setOpen(false)}>
          <NavLink to="/" end>QR Scan करा</NavLink>
          <NavLink to="/daily-entries">दैनंदिन नोंदी</NavLink>
          <NavLink to="/add-stock">स्टॉक जोडा</NavLink>
        </nav>
      </aside>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Page Content */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}