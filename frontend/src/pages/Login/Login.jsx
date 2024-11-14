import './Login.scss'; // Import the SCSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

const Login = () => {
    return (
        <>
            <Navbar />
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="row border rounded-5 p-3 bg-white shadow box-area">
                    <div className="col-12 min-width">
                        <div className="row align-items-center">
                            <div className="header-text mb-4">
                                <h2>Login Screen</h2>
                                <p>Let's put a smile on your face :)</p>
                            </div>

                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <div className="input-group mb-3 col">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg fs-6"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="input-group mb-1 col">
                                        <input
                                            type="password"
                                            className="form-control form-control-lg fs-6"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                        <small><a href="#">Forgot Password?</a></small>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <button type="submit" className="btn btn-lg btn-primary w-100 fs-6 button-group">
                                        Giriş Yap
                                    </button>
                                </div>

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
        </>
    );
};

export default Login;
