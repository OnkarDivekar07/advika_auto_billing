import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./searchProducts.css";

export default function SearchProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/getproduct");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
  const name = (p.name || p.marathiName || "")
    .toLowerCase()
    .replace(/\s+/g, " ");

  const words = search
    .toLowerCase()
    .trim()
    .split(/\s+/);

  return words.every((word) => name.includes(word));
});

  if (loading) return <p className="no-result">Loading...</p>;

  return (
    <div className="page">
      <div className="card">

        <h2>Search Product</h2>

        {/* Search bar */}
        <input
          className="search-input"
          type="text"
          placeholder="Type product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Product list */}
        <div className="product-list">

          {filteredProducts.length === 0 && (
            <div className="no-result">
              No product found
            </div>
          )}

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-row"
              onClick={() => navigate(`/billing/${product.id}`)}
            >
              {product.name || product.marathiName} {/* ✅ English first */}
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}