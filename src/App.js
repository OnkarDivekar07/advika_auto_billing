import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
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
import SearchProducts from "./pages/SearchProducts";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* 🔵 MAIN PAGES WITH SIDEBAR */}
        <Route element={
  <ProtectedRoute>
    <MainLayout />
  </ProtectedRoute>
}>
          <Route path="/" element={<Home />} />
          <Route path="/daily-entries" element={<DailyEntries />} />
          <Route path="/add-stock" element={<AddStock />} />
          <Route path="/search" element={<SearchProducts/>}/>
        </Route>

        {/* 🟢 FLOW / NESTED PAGES (NO SIDEBAR) */}
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/billing/:productId" element={<Billing />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}