import { useLocation } from "react-router-dom";
import './ProductDetails.css';
import 'boxicons/css/boxicons.min.css';
import axios from "axios";
import React, { useState, useEffect } from "react";

const ProductDetails = () => {
  const { state } = useLocation();
  const product = state?.product || null; // Ensure product is either the object or null

  // Only call useState when product is available, use a fallback value
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setQuantity(product.quantity || 1);  // Update quantity if product is available
    }
  }, [product]);

  if (!product) {
    return <p>No product data available.</p>;
  }

  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post(
        "http://localhost:8090/api/carts/additem",
        {
          quantity,
          product: { id: productId }
        },
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      );
      window.location.reload();
      console.log("Product added to cart:", response.data);
      alert("Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      alert(err.response?.data?.message || "Failed to add product to cart");
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prevQuantity => prevQuantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card">
        <div className="row g-0">
          <div className="col-md-6 border-end">
            <div className="main_image">
              <img
                src={`data:image/jpeg;base64,${product.image}`} 
                id="main_product_image"
                width="350"
                alt="Main Product"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 right-side">
              <div className="d-flex justify-content-between align-items-center">
                <h3>{product.name}</h3>
                <span className="heart">
                  <i className="bx bx-heart"></i>
                </span>
              </div>
              <div className="mt-2 pr-3 content">
                <p>{product.description}</p>
              </div>
              <h3>{product.price} DT</h3>
              <div className="ratings d-flex flex-row align-items-center">
                  <div className="d-flex flex-row">
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                    <i className="bx bx-star"></i>
                  </div>
                  <span>441 avis</span>
              </div>
              
              <div className="d-flex align-items-center justify-content-between"style={{paddingRight: '20px'}}> 
  <div className="input-group product-qty" style={{ flexGrow: 0, width: 'auto' }}>
    <span className="input-group-btn">
      <button
        type="button"
        className="quantity-left-minus btn btn-danger btn-number"
        onClick={() => handleQuantityChange('decrease')}
        style={{ width: '40px' }}
      >
        -
      </button>
    </span>
    <input
      type="text"
      id="quantity"
      name="quantity"
      className="form-control input-number"
      value={quantity}
      readOnly
      style={{ width: '60px', textAlign: 'center' }}  // Keeps the input width tight
    />
    <span className="input-group-btn">
      <button
        type="button"
        className="quantity-right-plus btn btn-success btn-number"
        onClick={() => handleQuantityChange('increase')}
        style={{ width: '40px' }}
      >
        +
      </button>
    </span>
  </div>
  <a
    href="#"
    className="nav-link"
    onClick={(e) => {
      e.preventDefault();
      addToCart(product.id, quantity);
    }}
    style={{ width: 'auto', whiteSpace: 'nowrap' }}
  >
    Ajouter au Panier
  </a>
</div>

            </div>

          </div>
        </div>
      </div>
    </div>

  );
};

export default ProductDetails;
