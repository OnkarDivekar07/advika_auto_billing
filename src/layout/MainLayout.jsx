import { NavLink, Outlet } from "react-router-dom";
import "./layout.css";

export default function MainLayout() {
  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Advika Auto </h2>

        <nav>
          <NavLink to="/" end>
            QR Scan करा
          </NavLink>

          <NavLink to="/daily-entries">
            दैनंदिन नोंदी
          </NavLink>

          <NavLink to="/add-stock">
            स्टॉक जोडा
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}