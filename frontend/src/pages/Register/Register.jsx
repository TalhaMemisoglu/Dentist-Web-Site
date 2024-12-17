import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from "../../api";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer'
import "./Register.scss"

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/api/register/", {
                first_name: firstName,
                last_name: lastName,
                password,
                email,
                phone,
            });

            alert("Kayıt olma başarılı! Lütfen emailinizi kontrol ediniz.");
            navigate("/login"); // Redirect to login page
        } catch (error) {
            if (error.response && error.response.data) {
                const errors = error.response.data;

                let errorMessage = errors.detail || "Registration failed.";
                for (const field in errors) {
                    if (field !== "detail") {
                        errorMessage += `\n${field}: ${errors[field].join(', ')}`;
                    }
                }
                alert(errorMessage);
            } else {
                alert("Kayıt başarısız oldu: Bir şeyler ters gitti.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div
                    className="row border rounded-5 p-4 bg-white shadow-lg w-100"
                    style={{ maxWidth: "600px", marginTop: "70px" }}
                >
                    <div className="col-12">
                        <div className="text-start mb-4">
                            <h2>Kaydol</h2>
                            <p className="text-muted">Hadi yüzünüze gülümseme koyalım :)</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {/* First Name and Last Name */}
                            <div className="row mb-3">
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-6"
                                        placeholder="Adınız"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fs-6"
                                        placeholder="Soyadınız"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">+90</span>
                                    <input
                                        type="tel"
                                        className="form-control form-control-lg fs-6"
                                        placeholder="Telefon Numaranız"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control form-control-lg fs-6"
                                    placeholder="Email Adresiniz"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control form-control-lg fs-6"
                                    placeholder="Şifreniz"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Terms and Conditions */}
                            <div className="form-check mb-3">
                                <input
                                    type="checkbox"
                                    id="termsCheck"
                                    className="form-check-input"
                                    required
                                />
                                <label htmlFor="termsCheck" className="form-check-label">
                                     <a href="#">Koşulları</a> kabul ediyorum.
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100 fs-6"
                                    disabled={loading}
                                >
                                    {loading ? "Kaydoluyor..." : "Kaydol"}
                                </button>
                            </div>

                            {/* Login Redirect */}
                            <div className="text-center">
                                <small>
                                    Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
                                </small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;