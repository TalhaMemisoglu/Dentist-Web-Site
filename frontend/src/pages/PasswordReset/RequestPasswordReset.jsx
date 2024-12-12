import React, { useState } from "react";
import axios from "axios";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      await axios.post("/api/password-reset-request/", { email });
      setMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      setMessage("Error sending password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            "Send Reset Email"
          )}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RequestPasswordReset;
