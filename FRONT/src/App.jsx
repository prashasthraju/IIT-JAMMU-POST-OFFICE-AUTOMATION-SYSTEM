import { Routes, Route, Navigate } from "react-router-dom";
import LoginSelector from "./Components/LoginSelector";
import AdminLogin from "./Components/AdminLogin";
import EmployeeLogin from "./Components/EmployeeLogin";
import UserLogin from "./Components/UserLogin";
import AdminDashboard from "./Components/AdminDashboard";
import EmployeeDashboard from "./Components/EmployeeDashboard";
import UserDashboard from "./Components/UserDashboard";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== allowedRole) return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* login selector */}
        <Route path="/" element={<LoginSelector />} />

        {/* role-based login pages */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/employee" element={<EmployeeLogin />} />
        <Route path="/login/user" element={<UserLogin />} />

        {/* protected components */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
