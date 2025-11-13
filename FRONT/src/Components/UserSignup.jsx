import React, { useState } from "react";

function UserSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      role: form.role.value,
      email: form.email.value.trim(),
      password: form.password.value,
      contactNumber: form.contactNumber.value.trim() || null,
      deptId: form.deptId.value ? Number(form.deptId.value) : null,
      buildingId: form.buildingId.value ? Number(form.buildingId.value) : null,
      roomNumber: form.roomNumber.value.trim() || null,
    };
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || "Signup failed");
      }
      setSuccess("Account created successfully. You can login now.");
      form.reset();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/iit-jammu-mockup-iit-jammu.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/60"></div>

      <div className="relative z-10 p-8 md:p-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create User Account
        </h2>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Manogna" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select name="role" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="you@iitjammu.ac.in" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input name="password" type="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Choose a password" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input name="contactNumber" type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Optional" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department ID</label>
            <input name="deptId" type="number" min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Optional" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Building ID</label>
            <input name="buildingId" type="number" min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Optional" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
            <input name="roomNumber" type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Optional" />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        {success && <p className="text-green-700 text-center mt-4">{success}</p>}

        <div className="text-center mt-6">
          <a href="/login/user" className="text-sm text-gray-700 hover:text-green-700 hover:underline">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;


