import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// --- SVG Icon Components ---
// I've defined the SVGs here for clarity.
// They use 'currentColor' to automatically match the text color.

const IconDashboard = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m6 0v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
  </svg>
);

const IconProfile = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconParcels = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4-8-4V7l8-4 8 4zM4 7v10l8 4 8-4V7" />
  </svg>
);

const IconAssigned = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const IconAddPackage = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconSummary = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// --- Sidebar Component ---

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
        { id: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
        { id: "profile", label: "My Profile", icon: <IconProfile /> },
        { id: "parcels", label: "My Parcels", icon: <IconParcels /> },
      ];
    } else if (user?.role === "employee") {
      return [
        { id: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
        { id: "profile", label: "My Profile", icon: <IconProfile /> },
        { id: "assigned", label: "Assigned Parcels", icon: <IconAssigned /> },
        { id: "addPackage", label: "Add Package", icon: <IconAddPackage /> },
      ];
    } else if (user?.role === "admin") {
      return [
        { id: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
        { id: "profile", label: "My Profile", icon: <IconProfile /> },
        { id: "parcels", label: "All Parcels", icon: <IconParcels /> },
        { id: "summary", label: "Summary", icon: <IconSummary /> },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    // Changed colors to teal, added font-comic
    <div className="w-64 bg-gradient-to-b from-black-500 to-blue-700 text-white min-h-screen flex flex-col shadow-xl font-comic">
      {/* Logo/Header */}
      <div className="p-6 border-b border-teal-400">
        <h1 className="text-2xl font-bold">IIT Jammu</h1>
        <p className="text-sm text-teal-100 mt-1">Post Office System</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-teal-400">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center text-lg font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
            <p className="text-xs text-teal-100 truncate capitalize">{user?.role || "User"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            // Changed active/hover colors
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? "bg-white text-teal-700 shadow-md"
                : "text-teal-50 hover:bg-teal-600 hover:text-white"
            }`}
          >
            {/* Icon is now an SVG component */}
            <span className="w-6 h-6">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-teal-400">
        <button
          onClick={handleLogout}
          // Changed logout color to be neutral
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-800 text-white transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <span className="w-6 h-6"><IconLogout /></span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Sidebar({ activeTab, setActiveTab }) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const getNavItems = () => {
//     if (user?.role === "user") {
//       return [
//         { id: "dashboard", label: "Dashboard", icon: "📊" },
//         { id: "profile", label: "My Profile", icon: "👤" },
//         { id: "parcels", label: "My Parcels", icon: "📦" },
//       ];
//     } else if (user?.role === "employee") {
//       return [
//         { id: "dashboard", label: "Dashboard", icon: "📊" },
//         { id: "profile", label: "My Profile", icon: "👤" },
//         { id: "assigned", label: "Assigned Parcels", icon: "📋" },
//         { id: "addPackage", label: "Add Package", icon: "➕" },
//       ];
//     } else if (user?.role === "admin") {
//       return [
//         { id: "dashboard", label: "Dashboard", icon: "📊" },
//         { id: "profile", label: "My Profile", icon: "👤" },
//         { id: "parcels", label: "All Parcels", icon: "📦" },
//         { id: "summary", label: "Summary", icon: "📈" },
//       ];
//     }
//     return [];
//   };

//   const navItems = getNavItems();

//   return (
//     <div className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white min-h-screen flex flex-col shadow-xl">
//       {/* Logo/Header */}
//       <div className="p-6 border-b border-indigo-500">
//         <h1 className="text-2xl font-bold">IIT Jammu</h1>
//         <p className="text-sm text-indigo-200 mt-1">Post Office System</p>
//       </div>

//       {/* User Info */}
//       <div className="p-4 border-b border-indigo-500">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center text-lg font-semibold">
//             {user?.name?.charAt(0)?.toUpperCase() || "U"}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
//             <p className="text-xs text-indigo-200 truncate capitalize">{user?.role || "User"}</p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 space-y-2">
//         {navItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActiveTab(item.id)}
//             className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//               activeTab === item.id
//                 ? "bg-white text-indigo-600 shadow-md"
//                 : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
//             }`}
//           >
//             <span className="text-xl">{item.icon}</span>
//             <span className="font-medium">{item.label}</span>
//           </button>
//         ))}
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-indigo-500">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md hover:shadow-lg"
//         >
//           <span className="text-xl">🚪</span>
//           <span className="font-medium">Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// }

