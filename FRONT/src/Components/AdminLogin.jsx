import { useLogin } from "../hooks/useLogin";

function AdminLogin() {
  const { handleLogin, loading, error } = useLogin();

  const onSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value;
    handleLogin(username, password, "admin"); // Pass userType as "admin"
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-50 overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute w-[40rem] h-[40rem] bg-red-100 rounded-full -top-40 -left-60 filter blur-3xl opacity-50"></div>
      <div className="absolute w-[30rem] h-[30rem] bg-indigo-100 rounded-full -bottom-20 -right-20 filter blur-3xl opacity-60"></div>

      {/* Card */}
      <div className="relative z-10 p-10 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
