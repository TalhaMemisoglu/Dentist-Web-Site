import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import api from "../../api";
import './Register.scss';  // Import your SCSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import Navbar from '../../components/Navbar/Navbar';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            // Send the registration data with username, password, email, and phone
            await api.post("/api/register/", { 
                username, 
                password,
                email,
                phone 
            });
            navigate("/login"); // Redirect to login after successful registration
        } catch (error) {
            // Check if the error response contains a message or validation errors
            if (error.response && error.response.data) {
                // If it's a validation error, we can display the specific field errors
                if (error.response.data.detail) {
                    alert(error.response.data.detail);  // General error message (like "Username already exists")
                } else {
                    // Loop through and display field-specific errors (if any)
                    const errors = error.response.data;
                    let errorMessage = '';
                    for (const field in errors) {
                        errorMessage += `${field}: ${errors[field].join(', ')}\n`;
                    }
                    alert(errorMessage); // Show all validation errors for the user
                }
            } else {
                // If there's no specific error message from the backend, show a general error
                alert("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
          <Navbar />
          <div className="register-container">
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
              <div className="row border rounded-5 p-3 bg-white shadow box-area">
                <div className="col-12 min-width">
                  <div className="row align-items-center">
                    <div className="header-text mb-4">
                      <h2>Register Screen</h2>
                      <p>Let's put a smile on your face :)</p>
                    </div>
      
                    <form onSubmit={handleSubmit} className="form-container">
                      <div className="form-group">
                        <div className="input-group mb-3 row">
                          <div className="col">
                            <input
                              type="text"
                              className="form-control form-control-lg fs-6"
                              placeholder="User name"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
      
                      <div className="form-group mb-3">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">+90</span>
                          </div>
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="Phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
      
                      <div className="form-group">
                        <div className="input-group mb-3">
                          <input
                            type="email"
                            className="form-control form-control-lg fs-6"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="input-group mb-1">
                          <input
                            type="password"
                            className="form-control form-control-lg fs-6"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
      
                      <div className="form-group">
                        <div className="input-group mb-3 d-flex justify-content-between">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="formCheck"
                            />
                            <label
                              htmlFor="formCheck"
                              className="form-check-label text-secondary"
                            >
                              <small>
                                I agree to all <a href="#">Terms, Privacy Policy</a> and
                                <a href="#">Fees</a>
                              </small>
                            </label>
                          </div>
                        </div>
                      </div>
      
                      <div className="input-group mb-3">
                        <button
                          className="btn btn-lg btn-primary w-100 fs-6 button-group"
                          disabled={loading}
                        >
                          {loading ? "Registering..." : "Register"}
                        </button>
                      </div>
      
                      <div className="row">
                        <small>
                          Already have an account? <Link to="/login">Login</Link>
                        </small>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
    );
};

export default Register;
