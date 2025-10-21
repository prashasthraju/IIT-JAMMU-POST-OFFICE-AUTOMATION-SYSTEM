import React, { useState } from "react";
import UserLogin from "./UserLogin";
import EmployeeLogin from "./EmployeeLogin";
import AdminLogin from "./AdminLogin";

function LoginSelector() {
  const [selectedLogin, setSelectedLogin] = useState(null);

  const renderLogin = () => {
    switch (selectedLogin) {
      case "user":
        return <UserLogin />;
      case "employee":
        return <EmployeeLogin />;
      case "admin":
        return <AdminLogin />;
      default:
        return (
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{ padding: "20px", border: "1px solid black", cursor: "pointer",backgroundColor:"green" }}
              onClick={() => setSelectedLogin("user")}
            >
              User Login
            </div>
            <div
              style={{ padding: "20px", border: "1px solid black", cursor: "pointer",backgroundColor:"green"}}
              onClick={() => setSelectedLogin("employee")}
            >
              Employee Login
            </div>
            <div
              style={{ padding: "20px", border: "1px solid black", cursor: "pointer" ,backgroundColor:"green"}}
              onClick={() => setSelectedLogin("admin")}
            >
              Admin Login
            </div>
          </div>
        );
    }
  };

  return <div>{renderLogin()}</div>;
}

export default LoginSelector;
