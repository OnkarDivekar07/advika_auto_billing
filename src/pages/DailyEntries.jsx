import { useEffect, useState } from "react";
import API from "../api";
import "./dailyEntries.css";

export default function DailyEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyEntries();
  }, []);

  const fetchDailyEntries = async () => {
    try {
      const res = await API.get("/transactions/daily-entries-view");
      setEntries(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dailyTotal = entries.reduce(
    (sum, e) => sum + Number(e.total || 0),
    0
  );

  return (
    <div className="page">
      <h2 className="page-title">📘 दैनंदिन नोंदी</h2>

      {loading && <p className="status-text">लोड होत आहे...</p>}

      {!loading && entries.length === 0 && (
        <p className="status-text">आज कोणतीही नोंद नाही</p>
      )}

      {!loading && entries.length > 0 && (
        <div className="table-wrapper">
          <table className="entries-table">
            <thead>
              <tr>
                <th>#</th>
                <th>वस्तू</th>
                <th>प्रमाण</th>
                <th>एकूण (₹)</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td className="amount">₹ {item.total}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="3" className="total-label">
                  आजची एकूण विक्री
                </td>
                <td className="total-amount">₹ {dailyTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}