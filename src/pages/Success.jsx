import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/"), 2000);
  }, []);

  return (
    <div className="center">
      <div className="check">✔</div>
      <h2>DONE</h2>
    </div>
  );
}