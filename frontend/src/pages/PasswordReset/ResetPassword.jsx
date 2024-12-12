import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      await axios.post(`/api/password-reset/${uid}/${token}/`, {
        new_password: newPassword,
      });
      setMessage("Password reset successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
        setMessage(`Error: ${error.response.data.error || "An error occurred"}`);
      } else {
        setMessage("Error resetting password. The link may have expired.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ResetPassword;
