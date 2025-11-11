import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState({});
  const [assignedParcels, setAssignedParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/");
      return;
    }

    async function fetchData() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const [pRes, parcelsRes] = await Promise.all([
          fetch(`${apiUrl}/api/employee/profile/${user.id}`),
          fetch(`${apiUrl}/api/employee/parcels/assigned/${user.id}`),
        ]);
        
        const p = await pRes.json();
        const parcelsData = await parcelsRes.json();
        
        setProfile(p);
        setAssignedParcels(Array.isArray(parcelsData) ? parcelsData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, navigate]);

  const handleStatusUpdate = async (mailId, newStatus) => {
    if (!newStatus) return;
    
    setUpdating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/employee/parcels/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mailId,
          newStatus,
          empId: user.id,
        }),
      });

      if (res.ok) {
        // Refresh assigned parcels
        const parcelsRes = await fetch(`${apiUrl}/api/employee/parcels/assigned/${user.id}`);
        const parcelsData = await parcelsRes.json();
        setAssignedParcels(Array.isArray(parcelsData) ? parcelsData : []);
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

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
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {profile?.Name?.charAt(0)?.toUpperCase() || "E"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile?.Name || "Employee"}</h2>
                  <p className="text-gray-500">{profile?.Role || "Employee"}</p>
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

      case "assigned":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="mr-3">📋</span>
                  Assigned Parcels
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {assignedParcels.length} Assigned
                </span>
              </div>
              {assignedParcels.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">No parcels currently assigned to you</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedParcels.map((p) => (
                    <div key={p.MailID} className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="font-bold text-xl text-gray-800">{p.BarcodeNo}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              p.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                              p.CurrentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              p.CurrentStatus === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {p.CurrentStatus}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1 mb-3">
                            <p><span className="font-medium">Type:</span> {p.Type} | <span className="font-medium">Mode:</span> {p.Mode}</p>
                            {p.SenderName && (
                              <p><span className="font-medium">From:</span> {p.SenderName} ({p.SenderAddress})</p>
                            )}
                            {p.ExpectedDeliveryDate && (
                              <p><span className="font-medium">Expected Delivery:</span> {new Date(p.ExpectedDeliveryDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <select
                            value={p.CurrentStatus}
                            onChange={(e) => handleStatusUpdate(p.MailID, e.target.value)}
                            disabled={updating}
                            className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Waiting">Waiting</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Returned">Returned</option>
                          </select>
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
        const pendingCount = assignedParcels.filter(p => p.CurrentStatus === 'Pending').length;
        const inTransitCount = assignedParcels.filter(p => p.CurrentStatus === 'In Transit').length;
        const deliveredCount = assignedParcels.filter(p => p.CurrentStatus === 'Delivered').length;

        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Employee"}! 👋</h1>
              <p className="text-blue-100">Manage your assigned parcels efficiently</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Assigned Parcels</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{assignedParcels.length}</p>
                  </div>
                  <div className="text-4xl">📦</div>
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
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Delivered</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{deliveredCount}</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
            </div>

            {/* Recent Assigned Parcels */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Assigned Parcels</h2>
              {assignedParcels.length === 0 ? (
                <p className="text-gray-500">No parcels assigned yet</p>
              ) : (
                <div className="space-y-3">
                  {assignedParcels.slice(0, 5).map((p) => (
                    <div key={p.MailID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <span className="font-semibold text-gray-800">{p.BarcodeNo}</span>
                        <span className="ml-3 text-sm text-gray-600">{p.Type} • {p.Mode}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        p.CurrentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        p.CurrentStatus === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
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

export default EmployeeDashboard;
