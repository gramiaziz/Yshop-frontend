import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom'; 
import { FaShoppingCart } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const AppBar = () => {
  const [username, setCustomername] =  useState("");
  const [cart, setcart] =  useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  //fnct logout
  async function logout(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8090/req/logout");
      alert("Logout successfully");
      console.log("Response:", response.data);
      
      // Clear session and user info
      setIsLoggedIn(false);
      setCustomername("");
      localStorage.removeItem('user');
      document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear session cookies
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.message || "Logout failed");
    }
  }
  //passer une commande
  const handlePlaceOrder = async (cartId) => {
    try {
      const response = await axios.post(
        `http://localhost:8090/api/carts/place-order/${cartId}`,
        {},
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          withCredentials: true, // For cookie-based sessions
        }
      );
      console.log("Order placed successfully:", response.data);
      alert("Order placed successfully!");
      // Optionally reload or update the navbar/cart
      fetchCart(); // Call the function that fetches updated cart details
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    }
  };
  useEffect(() => {
    const checkLoginStatusAndFetchCart = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCustomername(storedUser);
        setIsLoggedIn(true);
        // Fetch cart if logged in
        await fetchCart();
      } else {
        setIsLoggedIn(false);
        setCustomername(""); // Clear username if not logged in
      }
    };
  
    checkLoginStatusAndFetchCart();
  }, []); // Empty dependency array to run only once on component mount
  
//get cart
  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/api/carts/usercart`, {
        headers: {
          "Accept": "application/json",
        },
        withCredentials: true,
        
      });
      const cartdata = response.data;
      setcart(cartdata);
      console.log("Fetched productname:", cartdata);

      setCartItemCount(cartdata.cartItems.length);
      console.log("Number of cart items:", cartItemCount);
    } catch (err) {
      setError("Error fetching cart: " + err.message);
      console.error("Error fetching cart:", err);
    }
  };

  // Remove item handler
  const handleRemove = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8090/api/carts/delete/${id}`,{ 
      headers: {
        "Accept": "application/json",
      },
      withCredentials: true,});
      console.log("Item removed:", response.data);
      // Update the cart state after removal
      fetchCart()
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  //place order
  
  return (
    <header>
      <div
        class="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabindex="-1"
        id="offcanvasCart"
        aria-labelledby="My Cart"
      >
        <div class="offcanvas-header justify-content-center">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Votre Panier</span>
              <span className="badge bg-primary rounded-pill">
                {cart?.cartItems?.length || 0}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cart?.cartItems?.map((item, index) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 className="my-0" style={{ fontSize: "10px" }}>
                      {item.productName}
                    </h6>
                    <small className="text-body-secondary">
                      Quantité: {item.quantity}
                    </small>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="btn btn-link p-0"
                      style={{
                        backgroundColor: "transparent",
                        color: "red",
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <span className="text-body-secondary">
                    {item.subTotal} DT
                  </span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (DT)</span>
                <strong>{cart?.totalAmount || 0} DT</strong>
              </li>
            </ul>
            <div className="d-flex justify-content-center align-items-center">
            <button
              className="btn btn-lg"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handlePlaceOrder(cart?.id); 
              }}
              style={{
                backgroundColor: "#FFC43F",
                color: "white", // Change text color to white
                width: "auto", // Adjust width as needed
                fontSize: "16px", // Reduce font size
                padding: "8px 16px", // Adjust padding to reduce size
              }}
            >
              Confirmer votre commande
            </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row py-3 align-items-center">
          {/* Logo container */}
          <div className="col-sm-4 col-lg-3 text-center text-sm-start">
            <div className="main-logo">
              <Link to="/">
                <img src="/images/logo.png" alt="logo" className="img-fluid" />
              </Link>
            </div>
          </div>

          {/* Search bar container (Centering) */}
          <div className="col-12 col-md-5 d-flex justify-content-center">
            <div className="search-bar bg-light p-2 my-4 rounded-4 w-100">
              <div className="row w-100">
                <div className="col-md-4 d-none d-md-block">
                  <select className="form-select border-0 bg-transparent">
                    <option>All Categories</option>
                    <option>Groceries</option>
                    <option>Drinks</option>
                    <option>Chocolates</option>
                  </select>
                </div>
                <div className="col-8 col-md-6">
                  <form
                    id="search-form"
                    className="text-center"
                    action="index.html"
                    method="post"
                  >
                    <input
                      type="text"
                      className="form-control border-0 bg-transparent"
                      placeholder="Search for more than 20,000 products"
                    />
                  </form>
                </div>
                <div className="col-4 col-md-2 d-flex align-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Login and Signup buttons */}
          <div className="col d-flex justify-content-end">
            <div className="d-flex align-items-center">
              {isLoggedIn ? (
                <>
                  <div
                    className="btn"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <button
                      type="submit"
                      onClick={logout}
                      style={{
                        padding: "10px",
                        borderRadius: "4px",
                        backgroundColor: "#FFC43F",
                        color: "#fff",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#ffe43f")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#FFC43F")
                      }
                    >
                      Logout
                    </button>
                  </div>
                  <div class="cart text-end d-none d-lg-block dropdown">
                    <button
                      class="border-0 bg-transparent d-flex flex-column gap-2 lh-1"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasCart"
                      aria-controls="offcanvasCart"
                      onClick={(e) => {
                        e.preventDefault();
                        fetchCart();
                      }}
                    >
                      <span className="fs-6 text-muted dropdown-toggle">
                        <i
                          className="fa-solid fa-cart-shopping"
                          style={{ color: "#FFC43F", fontSize: "20px" }}
                        ></i>
                        {cartItemCount > 0 && (
                          <span
                            className="cart-item-count"
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              backgroundColor: "#FF0000",
                              color: "#FFF",
                              borderRadius: "50%",
                              padding: "2px 6px",
                              fontSize: "12px",
                            }}
                          >
                            {cartItemCount}
                          </span>
                        )}
                      </span>{" "}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary me-2">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-secondary">
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid">
        <div class="row py-2">
          <div class="d-flex justify-content-center justify-content-sm-between align-items-center">
            <nav class="main-menu d-flex navbar navbar-expand-lg">
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
              >
                <span class="navbar-toggler-icon"></span>
              </button>

              <div
                class="offcanvas offcanvas-end"
                tabindex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
              >
                <div class="offcanvas-header justify-content-center">
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>

                <div class="offcanvas-body">
                  <select class="filter-categories border-0 mb-0 me-5">
                    <option>Acheter par marque</option>
                    <option>Impact</option>
                    <option>Evogene</option>
                    <option>RedRex</option>
                  </select>

                  <ul class="navbar-nav justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                    <li class="nav-item active">
                      <a href="#women" class="nav-link">
                        Nos Packs
                      </a>
                    </li>
                    <li class="nav-item dropdown">
                      <a href="#men" class="nav-link">
                        Proteins
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#kids" class="nav-link">
                        Creatines
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#accessories" class="nav-link">
                        Omega 3
                      </a>
                    </li>
                    <li class="nav-item dropdown">
                      <a
                        class="nav-link dropdown-toggle"
                        role="button"
                        id="pages"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Amino
                      </a>
                      <ul class="dropdown-menu" aria-labelledby="pages">
                        <li>
                          <a href="index.html" class="dropdown-item">
                            Intra-workout
                          </a>
                        </li>
                        <li>
                          <a href="index.html" class="dropdown-item">
                            Post-workout
                          </a>
                        </li>
                        <li>
                          <a href="index.html" class="dropdown-item">
                            Pré
                          </a>
                        </li>
                        <li>
                          <a href="index.html" class="dropdown-item">
                            Séche
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item">
                      <a href="#brand" class="nav-link">
                        Pre-workout
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        href="#sale"
                        class="nav-link"
                        style={{ color: "#FFC43F" }}
                      >
                        Promotion
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppBar;
