import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

const UNIT_MULTIPLIER = {
  pcs: 1,
  jodi: 2,
  dozen: 12,
};

export default function Billing() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState("cash");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get(`/products/${productId}`).then((res) => {
      setProduct(res.data);

      // ✅ backend defaultUnit support (safe & future-proof)
      if (res.data?.defaultUnit && UNIT_MULTIPLIER[res.data.defaultUnit]) {
        setUnit(res.data.defaultUnit);
      }
    });
  }, [productId]);

  if (!product) return <p className="loading">लोड होत आहे...</p>;

  const displayName = product.marathiName || product.name;

  // 🔥 Core calculations
  const unitMultiplier = UNIT_MULTIPLIER[unit];
  const pcsQty = Number(qty || 0) * unitMultiplier;

  // price entered = price per selected unit
  const perPcPrice =
    unitMultiplier > 0
      ? Number((Number(price || 0) / unitMultiplier).toFixed(2))
      : 0;

  const total = Number((pcsQty * perPcPrice).toFixed(2));

  const isValid =
    Number(qty) > 0 &&
    Number(price) > 0 &&
    pcsQty > 0 &&
    perPcPrice > 0;

  const submitBill = async () => {
    if (!isValid) {
      alert("कृपया योग्य प्रमाण आणि दर भरा");
      return;
    }

    try {
      setSubmitting(true);

      const payload = [
        {
          productId: product.id,
          item_name: product.name,
          quantity: pcsQty,   // ✅ always PCS
          price: perPcPrice,  // ✅ per PCS price
          total,
        },
        {
          total_amount: total,
          payment_method: payment,
        },
      ];

      await API.post("/transactions/billingTranction", payload);
      navigate("/success");
    } catch (err) {
      alert("बिल सबमिट करण्यात अडचण आली");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="card billing-card">
        <h2 className="product-name">{displayName}</h2>

        {/* Quantity + Unit */}
        <div className="field">
          <label>प्रमाण</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              min="1"
              placeholder="संख्या"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              style={{ flex: 2 }}
            />

            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="pcs">नग</option>
              <option value="jodi">जोडी</option>
              <option value="dozen">डझन</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="field">
          <label>
            दर (
            {unit === "pcs"
              ? "प्रति नग"
              : unit === "jodi"
              ? "प्रति जोडी"
              : "प्रति डझन"}
            )
          </label>
          <input
            type="number"
            min="1"
            placeholder="दर टाका"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Calculation hint */}
        {isValid && (
          <p style={{ fontSize: "12px", opacity: 0.75 }}>
            {qty}{" "}
            {unit === "pcs"
              ? "नग"
              : unit === "jodi"
              ? "जोडी"
              : "डझन"}{" "}
            = {pcsQty} नग × ₹{perPcPrice} प्रति नग
          </p>
        )}

        <h3 className="total">एकूण रक्कम: ₹{total}</h3>

        {/* Payment */}
        <div className="radio-group">
          <label>
            <input
              type="radio"
              checked={payment === "cash"}
              onChange={() => setPayment("cash")}
            />
            रोख (Cash)
          </label>

          <label>
            <input
              type="radio"
              checked={payment === "online"}
              onChange={() => setPayment("online")}
            />
            ऑनलाईन (Online)
          </label>
        </div>

        <button
          className="primary-btn full"
          onClick={submitBill}
          disabled={!isValid || submitting}
        >
          {submitting ? "सबमिट होत आहे..." : "बिल सबमिट करा"}
        </button>
      </div>
    </div>
  );
}