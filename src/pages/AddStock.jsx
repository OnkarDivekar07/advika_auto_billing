import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../api";

export default function AddStock() {
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState("");

  const scannerRef = useRef(null);
  const isRunningRef = useRef(false); // 🔥 important

  const startScan = () => {
    setScanning(true);
  };

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5Qrcode("stock-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (!isRunningRef.current) return;

          isRunningRef.current = false;
          await scanner.stop();

          setScanning(false);

          const productId = decodedText.trim();
          const res = await API.get(`/products/${productId}`);
          setProduct(res.data);
        }
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch(() => {
        setScanning(false);
      });

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [scanning]);

  const submitStock = async () => {
    if (!qty || qty <= 0) {
      alert("प्रमाण भरा");
      return;
    }

    await API.post("/products/add-stock", {
      productId: product.id,
      addQuantity: qty,
    });

    alert("स्टॉक यशस्वीरीत्या अपडेट झाला ✅");
    setProduct(null);
    setQty("");
  };

  return (
    <div className="page">
      <h2>स्टॉक जोडा</h2>

      {!product && (
        <div className="card">
          {!scanning && (
            <div className="center">
              <button className="primary-btn" onClick={startScan}>
                QR स्कॅन करा
              </button>
            </div>
          )}

          {scanning && (
            <div className="center">
              <div id="stock-reader" className="scanner-box" />
            </div>
          )}
        </div>
      )}

      {product && (
        <div className="card">
          <h3>{product.name}</h3>
          <p>सध्याचा स्टॉक: {product.quantity}</p>

          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <button className="primary-btn full" onClick={submitStock}>
            स्टॉक अपडेट करा
          </button>
        </div>
      )}
    </div>
  );
}