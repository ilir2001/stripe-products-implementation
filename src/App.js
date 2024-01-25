import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const ProductDisplay = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products"); // Replace with your endpoint
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="product-container">
        <div key="standart" className="product-card">
          <img
            src="https://i.imgur.com/EHyR2nP.png"
            alt="The cover of Stubborn Attachments"
          />
          <div className="description">
            <h3>Standart</h3>
            <h5>$100.00</h5>
          </div>
          <form action="/create-checkout-session/standard" method="POST">
            <button type="submit">
              Checkout
            </button>
          </form>
        </div>

        <div key="standart" className="product-card">
          <img
            src="https://i.imgur.com/EHyR2nP.png"
            alt="The cover of Stubborn Attachments"
          />
          <div className="description">
            <h3>Premium</h3>
            <h5>$200.00</h5>
          </div>
          <form action="/create-checkout-session/premium" method="POST">
            <button type="submit">
              Checkout
            </button>
          </form>
        </div>
    </section>
  );
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  );
}
