import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-red-700">Admin Dashboard</h1>
      <p className="mt-4">Manage employees, parcels, and delivery records.</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
