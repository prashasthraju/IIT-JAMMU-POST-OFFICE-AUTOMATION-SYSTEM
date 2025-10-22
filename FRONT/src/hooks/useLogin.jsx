import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      // store user role in context
      login(data.role);

      // navigate based on role
      if (data.role === "admin") navigate("/admin/dashboard");
      else if (data.role === "employee") navigate("/employee/dashboard");
      else if (data.role === "user") navigate("/user/dashboard");
      else navigate("/");

    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};
