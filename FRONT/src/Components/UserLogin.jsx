import { useLogin } from "../hooks/useLogin";

function UserLogin() {
  const { handleLogin, loading, error } = useLogin();

  const onSubmit = (e) => {
    e.preventDefault();
    const username = e.target.loginId.value; // this maps to 'username' in backend
    const password = e.target.password.value;
    handleLogin(username, password);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-50 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute w-[40rem] h-[40rem] bg-green-100 rounded-full -top-40 -left-60 filter blur-3xl opacity-50"></div>
      <div className="absolute w-[30rem] h-[30rem] bg-indigo-100 rounded-full -bottom-20 -right-20 filter blur-3xl opacity-60"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 p-10 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          User Login
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="loginId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Roll No or Email
            </label>
            <input
              id="loginId"
              name="loginId"
              type="text"
              placeholder="Enter your Roll No or Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-gray-600 hover:text-indigo-600 hover:underline"
          >
            Back to role selection
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
