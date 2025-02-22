import Register from "./components/Register";
import Login  from "./components/Login";
import React from "react";
import ProductsList from "./components/ProductList";
import AppBar from "./components/Appbar"
import ProductDetail from "./components/ProductDetails";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


function App() {
  return (
    <Router>
      <AppBar/>
      <Routes>
       <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProductsList />} />
        <Route path="/products-list" element={<ProductsList />} /> {/* ProductsList Route */}
        <Route path="/product-detail" element={<ProductDetail />} />

      </Routes>
    </Router>
  );
}

export default App;

