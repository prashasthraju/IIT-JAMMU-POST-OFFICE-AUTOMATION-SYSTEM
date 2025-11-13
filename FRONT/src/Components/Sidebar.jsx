import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavItems = () => {
    if (user?.role === "user") {
      return [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "profile", label: "My Profile", icon: "👤" },
        { id: "parcels", label: "My Parcels", icon: "📦" },
      ];
    } else if (user?.role === "employee") {
      return [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "profile", label: "My Profile", icon: "👤" },
        { id: "assigned", label: "Assigned Parcels", icon: "📋" },
        { id: "addPackage", label: "Add Package", icon: "➕" },
      ];
    } else if (user?.role === "admin") {
      return [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "profile", label: "My Profile", icon: "👤" },
        { id: "parcels", label: "All Parcels", icon: "📦" },
        { id: "summary", label: "Summary", icon: "📈" },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white min-h-screen flex flex-col shadow-xl">
      {/* Logo/Header */}
      <div className="p-6 border-b border-indigo-500">
        <h1 className="text-2xl font-bold">IIT Jammu</h1>
        <p className="text-sm text-indigo-200 mt-1">Post Office System</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-indigo-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center text-lg font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
            <p className="text-xs text-indigo-200 truncate capitalize">{user?.role || "User"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? "bg-white text-indigo-600 shadow-md"
                : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-indigo-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

