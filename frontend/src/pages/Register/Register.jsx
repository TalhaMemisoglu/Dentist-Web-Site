import React from 'react';
import { useState } from "react";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import './Register.scss'; // Import the SCSS file for styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import Navbar from '../../components/Navbar/Navbar';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            await api.post("/api/user/register/", { username, password });
            navigate("/login"); // Redirect to login after successful registration
        } catch (error) {
            alert(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar></Navbar>
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
                                        <input type="text" className="form-control form-control-lg fs-6" placeholder="First name" />
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control form-control-lg fs-6" placeholder="Last name" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group mb-3">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">+90</span>
                                    </div>
                                    <input type="tel" className="form-control" placeholder="Phone number" />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control form-control-lg fs-6" placeholder="Email address" />
                                </div>

                                <div className="input-group mb-1">
                                    <input type="password" className="form-control form-control-lg fs-6" placeholder="Password" />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="input-group mb-3 d-flex justify-content-between">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="formCheck" />
                                        <label htmlFor="formCheck" className="form-check-label text-secondary">
                                            <small>I agree to all <a href="#">Terms, Privacy Policy</a> and <a href="#">Fees</a></small>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="input-group mb-3">
                                <button className="btn btn-lg btn-primary w-100 fs-6 button-group">Register</button>
                            </div>

                            <div className="row">
                                <small>Already have an account? <Link to="/login">Login</Link></small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Register;
