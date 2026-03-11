import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom"; // ✅ fixed import

export default function AddStock() {
  const { productId } = useParams();
  const navigate = useNavigate(); // already correct

  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [lowerThreshold, setLowerThreshold] = useState("");
  const [upperThreshold, setUpperThreshold] = useState("");
  const [loading, setLoading] = useState(false);

  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  const startScan = () => {
    setScanning(true);
  };

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
        alert("प्रॉडक्ट सापडला नाही ❌");
      }
    };

    fetchProduct();
  }, [productId]);

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

          try {
            isRunningRef.current = false;
            await scanner.stop();
            setScanning(false);

            const productId = decodedText.trim();
            const res = await API.get(`/products/${productId}`);

            setProduct(res.data);
          } catch (error) {
            console.error(error);
            alert("प्रॉडक्ट सापडला नाही ❌");
          }
        }
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => {
        console.error(err);
        setScanning(false);
        alert("कॅमेरा सुरू झाला नाही ❌");
      });

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [scanning]);

  const resetForm = () => {
    setProduct(null);
    setQty("");
    setPrice("");
    setLowerThreshold("");
    setUpperThreshold("");
  };

  const submitStock = async () => {
    if (!qty || Number(qty) <= 0) {
      alert("प्रमाण भरा");
      return;
    }

    const payload = {
      productId: product.id,
      addQuantity: Number(qty),
    };

    if (price !== "") payload.price = Number(price);
    if (lowerThreshold !== "") payload.lower_threshold = Number(lowerThreshold);
    if (upperThreshold !== "") payload.upper_threshold = Number(upperThreshold);

    try {
      setLoading(true);

      const res = await API.post("/products/add-stock", payload);

      if (res.status === 200 || res.status === 201) {
        alert("स्टॉक यशस्वीरीत्या अपडेट झाला ✅");
        navigate("/search-stock");
      } else {
        alert("स्टॉक अपडेट झाला नाही ❌");
      }
    } catch (error) {
      console.error(error);

      const msg =
        error.response?.data?.message ||
        "स्टॉक अपडेट करताना त्रुटी झाली ❌";

      alert(msg);
    } finally {
      setLoading(false);
    }
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
            placeholder="प्रमाण"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <input
            type="number"
            min="0"
            placeholder="नवीन किंमत (ऐच्छिक)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="number"
            min="0"
            placeholder="किमान स्टॉक (Min Threshold)"
            value={lowerThreshold}
            onChange={(e) => setLowerThreshold(e.target.value)}
          />

          <input
            type="number"
            min="0"
            placeholder="कमाल स्टॉक (Max Threshold)"
            value={upperThreshold}
            onChange={(e) => setUpperThreshold(e.target.value)}
          />

          <button
            className="primary-btn full"
            onClick={submitStock}
            disabled={loading}
          >
            {loading ? "अपडेट होत आहे..." : "स्टॉक अपडेट करा"}
          </button>
        </div>
      )}
    </div>
  );
}