import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="center">
      <h1>अद्विका ऑटो अ‍ॅक्सेसरीज</h1>
      <button className="primary-btn" onClick={() => navigate("/scan")}>
        QR कोड स्कॅन करा
      </button>
    </div>
  );
}