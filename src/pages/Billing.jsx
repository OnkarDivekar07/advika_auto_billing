import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function Billing() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState("cash");

  useEffect(() => {
    API.get(`/products/${productId}`).then((res) => {
      setProduct(res.data);
    });
  }, [productId]);

  if (!product) return <p className="loading">लोड होत आहे...</p>;

  const displayName = product.marathiName || product.name;

  const total = Number(qty || 0) * Number(price || 0);

  const submitBill = async () => {
    if (!qty || !price) {
      alert("प्रमाण आणि दर भरा");
      return;
    }

    const payload = [
      {
        productId: product.id,
        item_name: product.name,
        quantity: Number(qty),
        price: Number(price),
        total,
      },
      {
        total_amount: total,
        payment_method: payment,
      },
    ];

    await API.post("/transactions/billingTranction", payload);
    navigate("/success");
  };

  return (
    <div className="page">
      <div className="card billing-card">
        <h2 className="product-name">{displayName}</h2>

        <div className="field">
          <label>नग (Quantity)</label>
          <input
            type="number"
            min="1"
            placeholder="प्रमाण टाका"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>

        <div className="field">
          <label>दर (Price)</label>
          <input
            type="number"
            placeholder="दर टाका"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <h3 className="total">एकूण रक्कम: ₹{total}</h3>

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

        <button className="primary-btn full" onClick={submitBill}>
          बिल सबमिट करा
        </button>
      </div>
    </div>
  );
}