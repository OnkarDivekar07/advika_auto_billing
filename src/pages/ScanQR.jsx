import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ScanQR() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return; // 🔥 prevents double start
    startedRef.current = true;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 280 },
        async (decodedText) => {
          try {
            await scanner.stop();
          } catch {}

          navigate(`/billing/${decodedText}`);
        }
      )
      .catch(console.error);

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [navigate]); // ✅ FIX

  return (
    <div
      id="reader"
      style={{ width: "320px", margin: "auto", marginTop: "40px" }}
    />
  );
}