import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-700">User Dashboard</h1>
      <p className="mt-4">Track your parcels and notifications.</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Logout
      </button>
    </div>
  );
}

export default UserDashboard;
