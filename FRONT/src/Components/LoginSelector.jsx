import { useNavigate } from "react-router-dom";

function LoginSelector() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        IIT Jammu Post Office Automation System
      </h1>
      <p className="text-gray-500">Select your role to login</p>
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/login/user")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          User Login
        </button>
        <button
          onClick={() => navigate("/login/employee")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Employee Login
        </button>
        <button
          onClick={() => navigate("/login/admin")}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default LoginSelector;
