import { useState } from "react";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import './Login.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';
import RequestPasswordReset from "../PasswordReset/RequestPasswordReset";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation(); // Retrieve state passed during navigation

    // Extract the redirect path passed via state (or use default "/")
    const redirectTo = location.state?.redirectTo || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/api/login/", { email, password });

            if (res.status === 200 && res.data) {
                const { access, refresh } = res.data;

                // Save JWT tokens in localStorage
                localStorage.setItem(ACCESS_TOKEN, access);
                localStorage.setItem(REFRESH_TOKEN, refresh);

                // Redirect dynamically based on the state or default to "/"
                navigate(redirectTo);
            } else {
                throw new Error("Invalid login response");
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.detail || "Invalid credentials.";
                setError(errorMessage);
                alert(`Login failed: ${errorMessage}`);
            } else if (error.request) {
                setError("No response from server. Please try again.");
                alert("Login failed: No response from server.");
            } else {
                setError("Something went wrong. Please try again.");
                alert("Login failed: Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="row border rounded-5 p-3 bg-white shadow box-area">
                    <div className="col-12 min-width">
                        <div className="row align-items-center">
                            <div className="header-text mb-4">
                                <h2>Login</h2>
                                <p>Let's put a smile on your face :)</p>
                            </div>

                            <form onSubmit={handleSubmit} className="form-container">
                                <div className="form-group">
                                    <div className="input-group mb-3 col">
                                        <input
                                            type="email"
                                            className="form-control form-control-lg fs-6"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="input-group mb-1 col">
                                        <input
                                            type="password"
                                            className="form-control form-control-lg fs-6"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="input-group mb-5 d-flex justify-content-between">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="formCheck" />
                                        <label htmlFor="formCheck" className="form-check-label text-secondary">
                                            <small>Remember Me</small>
                                        </label>
                                    </div>
                                    <div className="forgot">
                                        <small><Link to="/request-password-reset">Forgot Password?</Link></small>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-lg btn-primary w-100 fs-6 button-group"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Login"}
                                    </button>
                                </div>

                                {error && <div className="error-message text-danger">{error}</div>} {/* Display error message */}

                                <div className="row">
                                    <small>
                                        Don't have an account? <Link to="/register">Register</Link>
                                    </small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
