// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); 
//   // user = { role: "admin" | "employee" | "user" }

//   const login = (role) => {
//     setUser({ role });
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Load persisted user on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to parse stored user", e);
      localStorage.removeItem("user");
    } finally {
      setReady(true);
    }
  }, []);

  // data: object returned by backend, e.g. { success: true, role: "user", id: 1, name: "Manogna" }
  const login = (data) => {
    if (!data) return;
    const toStore = {
      role: data.role,
      id: data.id,
      name: data.name,
    };
    setUser(toStore);
    localStorage.setItem("user", JSON.stringify(toStore));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook to consume context
export const useAuth = () => useContext(AuthContext);
