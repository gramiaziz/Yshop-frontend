import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from "react-router-dom";
import fetchCart from './Appbar';


const ProductList = () => {
  const navigate = useNavigate(); 
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8090/products/getall", {
          headers: {
            "Accept": "application/json",
          },
          withCredentials: true,
        });
        // Initialize the quantity field for each product
        const productsWithQuantity = response.data.map(product => ({
          ...product,
          quantity: 1 // Set initial quantity to 1 for each product
        }));
        setProducts(productsWithQuantity);
      } catch (err) {
        setError("Error fetching products: " + err.message);
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const fetchProductById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8090/products/${id}`, {
        headers: {
          "Accept": "application/json",
        },
        withCredentials: true,
        
      });
      const productData = response.data;
      setProduct(response.data);
      console.log("Fetched product data:", response.data); // Add this to check the fetched data
      navigate("/product-detail", { state: { product: productData } });
    } catch (err) {
      setError("Error fetching product: " + err.message);
      console.error("Error fetching product:", err);
    }
  };
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
  
  // Handle quantity change for increment and decrement for a specific product
  const handleQuantityChange = (productId, type) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          let newQuantity = product.quantity;
          if (type === 'increase') {
            newQuantity += 1;
          } else if (type === 'decrease' && newQuantity > 1) {
            newQuantity -= 1;
          }
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  return (
    <section className="py-1 overflow-hidden">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="section-header d-flex flex-wrap justify-content-between my-5">
              <h2 className="section-title">Nos Produits</h2>
              <div className="d-flex align-items-center">
                <a href="#" className="btn-link text-decoration-none">View All Categories →</a>
                <div className="swiper-buttons">
                  <button className="swiper-prev btn btn-primary" onClick={() => swiperRef.current.swiper.slidePrev()}>❮</button>
                  <button className="swiper-next btn btn-primary" onClick={() => swiperRef.current.swiper.slideNext()}>❯</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Swiper
              ref={swiperRef}
              spaceBetween={20}
              slidesPerView={3}
              loop={true}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="product-item">
                 
                    
                    <figure>
                      <a title={product.name}
                      onClick={(e) => {
                        e.preventDefault(); 
                        fetchProductById(product.id);
                      }}
                      >
                    <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
                      </a>
                    </figure>
                    <h3>{product.name}</h3>
                    <span className="qty">{product.quantity} Unit(s)</span>
                    <span className="rating">
                      <svg width="24" height="24" className="text-primary"><use href="#star-solid"></use></svg> {product.rating}
                    </span>
                    <span className="price">{product.price}DT</span>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="input-group product-qty">
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-left-minus btn btn-danger btn-number"
                            onClick={() => handleQuantityChange(product.id, 'decrease')}
                          >
                            -
                          </button>
                        </span>
                        <input
                          type="text"
                          id="quantity"
                          name="quantity"
                          className="form-control input-number"
                          value={product.quantity}
                          readOnly
                        />
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-right-plus btn btn-success btn-number"
                            onClick={() => handleQuantityChange(product.id, 'increase')}
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
                          addToCart(product.id, product.quantity);
                        }}
                      >
                        Ajouter au Panier
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
