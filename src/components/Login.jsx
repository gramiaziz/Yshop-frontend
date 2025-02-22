import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
    
    const[username,setCustomername]= useState("");
    const[password,setCustomerpassword]= useState("");
    const navigate = useNavigate();

    async function save(event) {
        event.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append("username", username);
            params.append("password", password);

            const response = await axios.post(
                "http://localhost:8090/req/login",
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                        
                    },
                    withCredentials: true
                }
            );

            alert("Login successfully");
            localStorage.setItem('user', username);
            console.log("Response:", response.data);
            
            navigate("/products-list");
            window.location.reload();
        } catch (err) {
            console.error("Error:", err);
            alert(err.response?.data?.message || "Login failed");
        }
    }



    
    return (
    
      <div style={{
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: 'whitesmoke',
        borderRadius: '8px',
        marginTop:'3%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize:'20px',
          marginBottom: '20px',
          color: '#808080',
        }}>
          Connectez-vous à votre compte
        </h2>
        <form>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold',fontSize:'13px', color: '#555' }}>
              Username:
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={username}
              onChange={(event) => setCustomername(event.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold',fontSize:'13px', color: '#555' }}>
              Mot de passe:
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={password}
              onChange={(event) => setCustomerpassword(event.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div className="btn"  style={{display:'flex',justifyContent:'center'}}>
          <button
            type="submit"
            onClick={save}
            style={{
              width: '30%',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: '#FFC43F',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#ffe43f')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#FFC43F')}
          >
            Login
          </button>
          </div>
        </form>
      </div>
      
    );
  }
  export default Login;
  