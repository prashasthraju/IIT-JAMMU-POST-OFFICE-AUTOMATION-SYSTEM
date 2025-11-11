import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState({});
  const [summary, setSummary] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/");
      return;
    }

    async function fetchData() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const [pRes, sRes, parcelsRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/profile/${user.id}`),
          fetch(`${apiUrl}/api/admin/summary`),
          fetch(`${apiUrl}/api/admin/parcels`),
        ]);
        
        const p = await pRes.json();
        const s = await sRes.json();
        const parcelsData = await parcelsRes.json();
        
        setProfile(p);
        setSummary(Array.isArray(s) ? s : []);
        setParcels(Array.isArray(parcelsData) ? parcelsData : []);
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
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {profile?.Name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile?.Name || "Admin"}</h2>
                  <p className="text-gray-500">{profile?.Role || "Administrator"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.Name || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.Role || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Login ID</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.LoginID || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Contact Number</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.ContactNumber || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Post Office ID</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.PostOfficeID || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "parcels":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">📦</span>
                All Parcels
              </h2>
              {parcels.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">No parcels found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Barcode</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mode</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Received</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parcels.map((p) => (
                        <tr key={p.MailID} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.BarcodeNo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.Type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.Mode}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              p.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                              p.CurrentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              p.CurrentStatus === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              p.CurrentStatus === 'Returned' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {p.CurrentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {p.DateReceived ? new Date(p.DateReceived).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">📈</span>
                Mail Status Summary
              </h2>
              {summary.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-500 text-lg">No data available</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {summary.map((s) => (
                    <div key={s.CurrentStatus} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                      <div className="text-4xl font-bold text-indigo-600 mb-2">{s.Count}</div>
                      <div className="text-sm font-semibold text-gray-700 capitalize">{s.CurrentStatus}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default: // dashboard
        const totalParcels = parcels.length;
        const deliveredCount = summary.find(s => s.CurrentStatus === 'Delivered')?.Count || 0;
        const pendingCount = summary.find(s => s.CurrentStatus === 'Pending')?.Count || 0;

        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Admin"}! 👋</h1>
              <p className="text-red-100">Manage the post office system efficiently</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Parcels</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{totalParcels}</p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Delivered</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{deliveredCount}</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{pendingCount}</p>
                  </div>
                  <div className="text-4xl">⏳</div>
                </div>
              </div>
            </div>

            {/* Status Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Status Overview</h2>
              {summary.length === 0 ? (
                <p className="text-gray-500">No data available</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {summary.map((s) => (
                    <div key={s.CurrentStatus} className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-indigo-600">{s.Count}</div>
                      <div className="text-sm text-gray-600 mt-1 capitalize">{s.CurrentStatus}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Parcels */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Parcels</h2>
              {parcels.length === 0 ? (
                <p className="text-gray-500">No parcels found</p>
              ) : (
                <div className="space-y-3">
                  {parcels.slice(0, 5).map((p) => (
                    <div key={p.MailID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <span className="font-semibold text-gray-800">{p.BarcodeNo}</span>
                        <span className="ml-3 text-sm text-gray-600">{p.Type} • {p.Mode}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        p.CurrentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {p.CurrentStatus}
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

export default AdminDashboard;
