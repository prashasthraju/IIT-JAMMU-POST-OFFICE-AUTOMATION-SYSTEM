import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EmployeeLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login("employee");
    navigate("/employee/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4">Employee Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
        <input type="text" placeholder="Username" className="border p-2 rounded" />
        <input type="password" placeholder="Password" className="border p-2 rounded" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

export default EmployeeLogin;
