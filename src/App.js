import { BrowserRouter, Routes, Route } from "react-router-dom";

/* MAIN LAYOUT */
import MainLayout from "./layout/MainLayout";

/* MAIN PAGES */
import Home from "./pages/Home";
import DailyEntries from "./pages/DailyEntries";
import AddStock from "./pages/AddStock";

/* FLOW PAGES (NO LAYOUT) */
import ScanQR from "./pages/ScanQR";
import Billing from "./pages/Billing";
import Success from "./pages/Success";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔵 MAIN PAGES WITH SIDEBAR */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/daily-entries" element={<DailyEntries />} />
          <Route path="/add-stock" element={<AddStock />} />
        </Route>

        {/* 🟢 FLOW / NESTED PAGES (NO SIDEBAR) */}
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/billing/:productId" element={<Billing />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}