import { useState } from "react";

export default function AdminGate({ children }) {
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ; // change later

  if (allowed) return children;

  return (
    <div className="page center">
      <div className="card">
        <h3>🔒 Admin Access</h3>

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="primary-btn full"
          onClick={() => {
            if (password === ADMIN_PASSWORD) {
              setAllowed(true);
            } else {
              alert("Wrong password");
            }
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}