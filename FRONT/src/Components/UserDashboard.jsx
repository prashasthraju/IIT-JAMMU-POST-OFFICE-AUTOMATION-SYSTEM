// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// function UserDashboard() {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <div className="p-10">
//       <h1 className="text-3xl font-bold text-green-700">User Dashboard</h1>
//       <p className="mt-4">Track your parcels and notifications.</p>
//       <button
//         onClick={handleLogout}
//         className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }

// export default UserDashboard;
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState({});
  const [inTransit, setInTransit] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/");
      return;
    }

    async function fetchData() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const [pRes, tRes, hRes] = await Promise.all([
          fetch(`${apiUrl}/api/user/profile/${user.id}`),
          fetch(`${apiUrl}/api/user/parcels/in-transit/${user.id}`),
          fetch(`${apiUrl}/api/user/parcels/history/${user.id}`),
        ]);
        
        const p = await pRes.json();
        const t = await tRes.json();
        const h = await hRes.json();
        
        setProfile(p);
        setInTransit(Array.isArray(t) ? t : []);
        setHistory(Array.isArray(h) ? h : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {profile?.Name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile?.Name || "User"}</h2>
                  <p className="text-gray-500 capitalize">{profile?.Role || "User"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.Name || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.Email || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <div className="text-lg font-semibold text-gray-800 capitalize">{profile?.Role || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Contact Number</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.ContactNumber || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Room Number</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.RoomNumber || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Building</label>
                  <div className="text-lg font-semibold text-gray-800">
                    {profile?.BuildingId ? `Building ${profile.BuildingId}` : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "parcels":
        return (
          <div className="space-y-6">
            {/* In Transit */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="mr-3">📦</span>
                  Parcels In Transit
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {inTransit.length} Active
                </span>
              </div>
              {inTransit.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">No parcels currently in transit</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {inTransit.map((p) => (
                    <div key={p.MailID} className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white p-5 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-bold text-lg text-gray-800">{p.BarcodeNo}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              p.CurrentStatus === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                              p.CurrentStatus === 'Pending' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {p.CurrentStatus}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Type:</span> {p.Type}</p>
                            {p.ExpectedDeliveryDate && (
                              <p><span className="font-medium">Expected Delivery:</span> {new Date(p.ExpectedDeliveryDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">📚</span>
                Parcel History
              </h2>
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-500 text-lg">No previous parcels</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((h) => (
                    <div key={h.MailID} className="border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white p-4 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="font-semibold text-gray-800">{h.BarcodeNo}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              h.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                              h.CurrentStatus === 'Returned' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {h.CurrentStatus}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Type:</span> {h.Type}
                            {h.DateReceived && (
                              <span className="ml-4">
                                <span className="font-medium">Received:</span> {new Date(h.DateReceived).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default: // dashboard
        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"}! 👋</h1>
              <p className="text-indigo-100">Track and manage your parcels efficiently</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">In Transit</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{inTransit.length}</p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Parcels</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{history.length}</p>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Delivered</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {history.filter(h => h.CurrentStatus === 'Delivered').length}
                    </p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
            </div>

            {/* Recent Parcels */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Parcels</h2>
              {history.length === 0 ? (
                <p className="text-gray-500">No parcels yet</p>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 5).map((h) => (
                    <div key={h.MailID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-semibold text-gray-800">{h.BarcodeNo}</span>
                        <span className="ml-3 text-sm text-gray-600">{h.Type}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        h.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        h.CurrentStatus === 'Returned' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {h.CurrentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}

