import axios from "axios";
import { useState ,useEffect} from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from "react-router-dom";


function Register() {
  const [username, setCustomername] = useState("");
  const [phoneNumber, setCustomerphoneNumber] = useState("");
  const [address, setCustomeraddress] = useState("");
  const [email, setCustomeremail] = useState("");
  const [password, setCustomerpassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Validate form fields
  useEffect(() => {
    const isValid =
      username.trim() &&
      phoneNumber.trim() &&
      address.trim() &&
      email.trim() &&
      password.trim() &&
      repeatPassword.trim() &&
      password === repeatPassword;
    setIsFormValid(isValid);
  }, [username, phoneNumber, address, email, password, repeatPassword]);

  async function save(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8090/req/signup", {
        username: username,
        email: email,
        password: password,
        phoneNumber:phoneNumber,
        address:address,

      });
      alert("Registration successfully");
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <section>
      <div className="container h-100" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-8 col-xl-8">
            <div className="card text-black" style={{ borderRadius: "15px", backgroundColor: 'whitesmoke' }}>
              <div className="card-body p-md-4">
                <div className="row justify-content-center">
                  <div className="col-md-12 col-lg-10 col-xl-10">
                    <p className="text-center h4 fw-bold mb-4"> Créer votre compte</p>
                    <form onSubmit={save} style={{ fontSize: "14px" }}>
                      <div className="row mb-3">
                        <div className="col-md-6 d-flex align-items-center">
                         
                            <i className="fas fa-user me-2"></i>
                         
                          <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username}
                            placeholder="Username"
                            onChange={(event) => setCustomername(event.target.value)}
                          />
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                        <i className="fas fa-envelope me-2"></i>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            placeholder="Votre email"
                            onChange={(event) => setCustomeremail(event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6 d-flex align-items-center">
                        <i className="fas fa-lock me-2"></i>

                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            placeholder="Mot de passe"
                            onChange={(event) => setCustomerpassword(event.target.value)}
                          />
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                        <i className="fas fa-map-marker-alt me-2"></i>

                          <input
                            type="text"
                            id="address"
                            className="form-control"
                            value={address}
                            placeholder="Adresse"
                            onChange={(event) => setCustomeraddress(event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6 d-flex align-items-center">
                        <i className="fas fa-key me-2"></i>
                          <input
                            type="password"
                            id="repeatPassword"
                            className="form-control"
                            placeholder="Répéter le mot de passe"
                            onChange={(event) => setRepeatPassword(event.target.value)}
                          />
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                        <i className="fas fa-phone me-2"></i>
                          <input
                            type="text"
                            id="phoneNumber"
                            className="form-control"
                            value={phoneNumber}
                            placeholder="Téléphone"
                            onChange={(event) => setCustomerphoneNumber(event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={!isFormValid}
                        >
                          Créer votre compte
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
