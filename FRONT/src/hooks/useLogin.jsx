// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";

// // export const useLogin = () => {
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   const handleLogin = async (username, password) => {
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const res = await fetch("http://localhost:5000/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ username, password }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) throw new Error(data.message || "Invalid credentials");

// //       // store user role in context
// //       login(data.role);

// //       // navigate based on role
// //       if (data.role === "admin") navigate("/admin/dashboard");
// //       else if (data.role === "employee") navigate("/employee/dashboard");
// //       else if (data.role === "user") navigate("/user/dashboard");
// //       else navigate("/");

// //     } catch (err) {
// //       setError(err.message);
// //       console.error("Login error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return { handleLogin, loading, error };
// // };
// // src/hooks/useLogin.js
// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";

// export function useLogin() {
//   const { login } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleLogin = async (username, password) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username,
//           password,
//           userType: "user" // 👈 important for UserLogin
//         })
//       });

//       const data = await res.json();

//       if (data.success) {
//         login(data); // stores role/id/name in context
//         localStorage.setItem("id", data.id);
//         localStorage.setItem("role", data.role);
//         localStorage.setItem("name", data.name);

//         // redirect to correct dashboard
//         if (data.role === "user") window.location.href = "/user/dashboard";
//         else if (data.role === "employee") window.location.href = "/employee/dashboard";
//         else if (data.role === "admin") window.location.href = "/admin/dashboard";
//       } else {
//         setError(data.message || "Invalid credentials");
//       }
//     } catch (err) {
//       setError("Network error");
//       console.error("Login error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { handleLogin, loading, error };
// }
// src/hooks/useLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * useLogin hook
 * handleLogin(username, password, userType = "user")
 */
export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (username, password, userType = "user") => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username?.trim(),
          password: password?.trim(),
          userType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If server returned 4xx/5xx with message
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      if (data && data.success) {
        // Persist in context and localStorage via login()
        login(data);

        // navigate based on returned role (ensure lowercase)
        const role = String(data.role || "").toLowerCase();
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "employee") navigate("/employee/dashboard");
        else navigate("/user/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}
