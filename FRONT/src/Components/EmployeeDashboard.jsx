import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

// --- SVG Icons ---
const IconClipboardList = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
);
const IconArchiveBox = () => (
  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 006.586 13H4" /></svg>
);
const IconHourglass = () => (
  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const IconClock = () => (
  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const IconTruck = () => (
  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const IconCheckCircle = () => (
  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);
// --------------------

function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState({});
  const [assignedParcels, setAssignedParcels] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/");
      return;
    }

    async function fetchData() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        // [FIXED] Removed /api/employee from fetch URLs
        const [pRes, parcelsRes, eventsRes] = await Promise.all([
          fetch(`${apiUrl}/api/employee/profile/${user.id}`),
          fetch(`${apiUrl}/api/employee/parcels/assigned/${user.id}`),
          fetch(`${apiUrl}/api/employee/parcels/recent-events/${user.id}`),
        ]);
        
        const p = await pRes.json();
        const parcelsData = await parcelsRes.json();
        const eventsData = await eventsRes.json();
        
        setProfile(p);
        setAssignedParcels(Array.isArray(parcelsData) ? parcelsData : []);
        setRecentEvents(Array.isArray(eventsData) ? eventsData : []);
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
      // [FIXED] Removed /api/employee from fetch URL
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
        // [FIXED] Removed /api/employee from fetch URLs
        const [parcelsRes, eventsRes] = await Promise.all([
          fetch(`${apiUrl}api/employee/parcels/assigned/${user.id}`),
          fetch(`${apiUrl}api/employee/parcels/recent-events/${user.id}`),
        ]);
        const parcelsData = await parcelsRes.json();
        const eventsData = await eventsRes.json();
        setAssignedParcels(Array.isArray(parcelsData) ? parcelsData : []);
        setRecentEvents(Array.isArray(eventsData) ? eventsData : []);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
                  <label className="text-sm font-medium text-gray-500">Post Office</label>
                  <div className="text-lg font-semibold text-gray-800">
                    {profile?.PostOfficeName
                      ? `${profile.PostOfficeName} (${profile.PostOfficeID || "N/A"})`
                      : profile?.PostOfficeID || "N/A"}
                  </div>
                  {profile?.PostOfficeLocation && (
                    <p className="text-sm text-gray-500">{profile.PostOfficeLocation}</p>
                  )}
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
                  <span className="mr-3 text-blue-600"><IconClipboardList /></span>
                  Assigned Parcels
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {assignedParcels.length} Assigned
                </span>
              </div>
              {assignedParcels.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 inline-block"><IconArchiveBox /></div>
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
                            {p.ReceiverName && (
                              <p>
                                <span className="font-medium">Recipient:</span> {p.ReceiverName}
                                {p.ReceiverEmail && (
                                  <span className="text-xs text-gray-500 ml-2">{p.ReceiverEmail}</span>
                                )}
                              </p>
                            )}
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

      default: {
        const pendingCount = assignedParcels.filter(p => p.CurrentStatus === 'Pending').length;
        const waitingCount = assignedParcels.filter(p => p.CurrentStatus === 'Waiting').length;
        const inTransitCount = assignedParcels.filter(p => p.CurrentStatus === 'In Transit').length;
        const deliveredCount = assignedParcels.filter(p => p.CurrentStatus === 'Delivered').length;

        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Employee"}!</h1>
              <p className="text-blue-100">Manage your assigned parcels efficiently</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Assigned Parcels</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{assignedParcels.length}</p>
                  </div>
                  <div className="text-4xl"><IconClipboardList /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{pendingCount}</p>
                  </div>
                  <div className="text-4xl"><IconHourglass /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Waiting</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{waitingCount}</p>
                  </div>
                  <div className="text-4xl"><IconClock /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">In Transit</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{inTransitCount}</p>
                  </div>
                  <div className="text-4xl"><IconTruck /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Delivered</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{deliveredCount}</p>
                  </div>
                  <div className="text-4xl"><IconCheckCircle /></div>
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
                        p.CurrentStatus === 'Waiting' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {p.CurrentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              {recentEvents.length === 0 ? (
                <p className="text-gray-500">No recent updates logged</p>
              ) : (
                <div className="space-y-3">
                  {recentEvents.slice(0, 10).map((event) => (
                    <div key={event.EventID} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{event.BarcodeNo}</p>
                        <p className="text-sm text-gray-600">
                          {event.EventType} {event.Location ? `• ${event.Location}` : ""}
                        </p>
                        {event.Remarks && (
                          <p className="text-xs text-gray-500 mt-1">{event.Remarks}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(event.Timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }
      case "addPackage":
        const onCreate = async (e) => {
          e.preventDefault();
          setCreateError("");
          setCreateSuccess("");
          setCreating(true);
          const form = e.target;
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
          const payload = {
            barcodeNo: form.barcodeNo.value.trim(),
            type: form.type.value.trim(),
            mode: form.mode.value,
            senderName: form.senderName.value.trim() || null,
            senderAddress: form.senderAddress.value.trim() || null,
            receiverEmail: form.receiverEmail.value.trim() || null,
            expectedDeliveryDate: form.expectedDeliveryDate.value || null,
            handledBy: user.id,
          };
          try {
            // [FIXED] Removed /api/employee from fetch URL
            const res = await fetch(`${apiUrl}/api/employee/parcels/create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              const msg = await res.json().catch(() => ({}));
              throw new Error(msg?.error || "Failed to create package");
            }
            setCreateSuccess("Package created successfully.");
            form.reset();
          } catch (err) {
            setCreateError(err.message || "Something went wrong");
          } finally {
            setCreating(false);
          }
        };
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2 text-blue-600"><IconPlus /></span> Add New Package
              </h2>
              <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barcode No</label>
                  <input name="barcodeNo" type="text" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Unique barcode" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <input name="type" type="text" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Letter / Parcel / Document" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                  <select name="mode" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="Incoming">Incoming</option>
                    <option value="Outgoing">Outgoing</option>
                    <option value="Internal">Internal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Receiver Email</label>
                  <input name="receiverEmail" type="email" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional (for internal deliveries)" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                  <input name="senderName" type="text" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sender Address</label>
                  <input name="senderAddress" type="text" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
                  <input name="expectedDeliveryDate" type="datetime-local" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" disabled={creating} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                    {creating ? "Creating..." : "Create Package"}
                  </button>
                </div>
              </form>
              {createError && <p className="text-red-600 mt-4">{createError}</p>}
              {createSuccess && <p className="text-green-700 mt-4">{createSuccess}</p>}
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
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";

// // --- SVG Icons ---
// const IconClipboardList = () => (
//   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
// );
// const IconArchiveBox = () => (
//   <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 006.586 13H4" /></svg>
// );
// const IconHourglass = () => (
//   <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
// );
// const IconClock = () => (
//   <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
// );
// const IconTruck = () => (
//   <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
// );
// const IconCheckCircle = () => (
//   <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
// );
// const IconPlus = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
// );
// // --------------------

// function EmployeeDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [profile, setProfile] = useState({});
//   const [assignedParcels, setAssignedParcels] = useState([]);
//   const [recentEvents, setRecentEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [createError, setCreateError] = useState("");
//   const [createSuccess, setCreateSuccess] = useState("");

//   useEffect(() => {
//     if (!user || !user.id) {
//       navigate("/");
//       return;
//     }

//     async function fetchData() {
//       try {
//         const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//         const [pRes, parcelsRes, eventsRes] = await Promise.all([
//           fetch(`${apiUrl}/api/employee/profile/${user.id}`),
//           fetch(`${apiUrl}/api/employee/parcels/assigned/${user.id}`),
//           fetch(`${apiUrl}/api/employee/parcels/recent-events/${user.id}`),
//         ]);
        
//         const p = await pRes.json();
//         const parcelsData = await parcelsRes.json();
//         const eventsData = await eventsRes.json();
        
//         setProfile(p);
//         setAssignedParcels(Array.isArray(parcelsData) ? parcelsData : []);
//         setRecentEvents(Array.isArray(eventsData) ? eventsData : []);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [user, navigate]);

//   const handleStatusUpdate = async (mailId, newStatus) => {
//     if (!newStatus) return;
    
//     setUpdating(true);
//     try {
//       const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//       const res = await fetch(`${apiUrl}/api/employee/parcels/update-status`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           mailId,
//           newStatus,
//           empId: user.id,
//         }),
//       });

//       if (res.ok) {
//         // Refresh assigned parcels
//         const [parcelsRes, eventsRes] = await Promise.all([
//           fetch(`${apiUrl}/api/employee/parcels/assigned/${user.id}`),
//           fetch(`${apiUrl}/api/employee/parcels/recent-events/${user.id}`),
//         ]);
//         const parcelsData = await parcelsRes.json();
//         const eventsData = await eventsRes.json();
//         setAssignedParcels(Array.isArray(parcelsData) ? parcelsData : []);
//         setRecentEvents(Array.isArray(eventsData) ? eventsData : []);
//       } else {
//         alert("Failed to update status");
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Error updating status");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   const renderContent = () => {
//     switch (activeTab) {
//       case "profile":
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-8">
//               <div className="flex items-center space-x-4 mb-6">
//                 <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
//                   {profile?.Name?.charAt(0)?.toUpperCase() || "E"}
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">{profile?.Name || "Employee"}</h2>
//                   <p className="text-gray-500">{profile?.Role || "Employee"}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Full Name</label>
//                   <div className="text-lg font-semibold text-gray-800">{profile?.Name || "N/A"}</div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Role</label>
//                   <div className="text-lg font-semibold text-gray-800">{profile?.Role || "N/A"}</div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Login ID</label>
//                   <div className="text-lg font-semibold text-gray-800">{profile?.LoginID || "N/A"}</div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Contact Number</label>
//                   <div className="text-lg font-semibold text-gray-800">{profile?.ContactNumber || "N/A"}</div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Post Office</label>
//                   <div className="text-lg font-semibold text-gray-800">
//                     {profile?.PostOfficeName
//                       ? `${profile.PostOfficeName} (${profile.PostOfficeID || "N/A"})`
//                       : profile?.PostOfficeID || "N/A"}
//                   </div>
//                   {profile?.PostOfficeLocation && (
//                     <p className="text-sm text-gray-500">{profile.PostOfficeLocation}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case "assigned":
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                   <span className="mr-3 text-blue-600"><IconClipboardList /></span>
//                   Assigned Parcels
//                 </h2>
//                 <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
//                   {assignedParcels.length} Assigned
//                 </span>
//               </div>
//               {assignedParcels.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="text-6xl mb-4 inline-block"><IconArchiveBox /></div>
//                   <p className="text-gray-500 text-lg">No parcels currently assigned to you</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {assignedParcels.map((p) => (
//                     <div key={p.MailID} className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl hover:shadow-lg transition-shadow">
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="flex-1">
//                           <div className="flex items-center space-x-3 mb-3">
//                             <span className="font-bold text-xl text-gray-800">{p.BarcodeNo}</span>
//                             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                               p.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
//                               p.CurrentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                               p.CurrentStatus === 'In Transit' ? 'bg-blue-100 text-blue-800' :
//                               'bg-gray-100 text-gray-800'
//                             }`}>
//                               {p.CurrentStatus}
//                             </span>
//                           </div>
//                           <div className="text-sm text-gray-600 space-y-1 mb-3">
//                             <p><span className="font-medium">Type:</span> {p.Type} | <span className="font-medium">Mode:</span> {p.Mode}</p>
//                             {p.ReceiverName && (
//                               <p>
//                                 <span className="font-medium">Recipient:</span> {p.ReceiverName}
//                                 {p.ReceiverEmail && (
//                                   <span className="text-xs text-gray-500 ml-2">{p.ReceiverEmail}</span>
//                                 )}
//                               </p>
//                             )}
//                             {p.SenderName && (
//                               <p><span className="font-medium">From:</span> {p.SenderName} ({p.SenderAddress})</p>
//                             )}
//                             {p.ExpectedDeliveryDate && (
//                               <p><span className="font-medium">Expected Delivery:</span> {new Date(p.ExpectedDeliveryDate).toLocaleDateString()}</p>
//                             )}
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <select
//                             value={p.CurrentStatus}
//                             onChange={(e) => handleStatusUpdate(p.MailID, e.target.value)}
//                             disabled={updating}
//                             className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <option value="Pending">Pending</option>
//                             <option value="Waiting">Waiting</option>
//                             <option value="In Transit">In Transit</option>
//                             <option value="Delivered">Delivered</option>
//                             <option value="Returned">Returned</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       default: {
//         const pendingCount = assignedParcels.filter(p => p.CurrentStatus === 'Pending').length;
//         const waitingCount = assignedParcels.filter(p => p.CurrentStatus === 'Waiting').length;
//         const inTransitCount = assignedParcels.filter(p => p.CurrentStatus === 'In Transit').length;
//         const deliveredCount = assignedParcels.filter(p => p.CurrentStatus === 'Delivered').length;

//         return (
//           <div className="space-y-6">
//             {/* Welcome Card */}
//             <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
//               <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Employee"}!</h1>
//               <p className="text-blue-100">Manage your assigned parcels efficiently</p>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">Assigned Parcels</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{assignedParcels.length}</p>
//                   </div>
//                   <div className="text-4xl"><IconClipboardList /></div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">Pending</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{pendingCount}</p>
//                   </div>
//                   <div className="text-4xl"><IconHourglass /></div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">Waiting</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{waitingCount}</p>
//                   </div>
//                   <div className="text-4xl"><IconClock /></div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">In Transit</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{inTransitCount}</p>
//                   </div>
//                   <div className="text-4xl"><IconTruck /></div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">Delivered</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{deliveredCount}</p>
//                   </div>
//                   <div className="text-4xl"><IconCheckCircle /></div>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Assigned Parcels */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Assigned Parcels</h2>
//               {assignedParcels.length === 0 ? (
//                 <p className="text-gray-500">No parcels assigned yet</p>
//               ) : (
//                 <div className="space-y-3">
//                   {assignedParcels.slice(0, 5).map((p) => (
//                     <div key={p.MailID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                       <div>
//                         <span className="font-semibold text-gray-800">{p.BarcodeNo}</span>
//                         <span className="ml-3 text-sm text-gray-600">{p.Type} • {p.Mode}</span>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         p.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
//                         p.CurrentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                         p.CurrentStatus === 'In Transit' ? 'bg-blue-100 text-blue-800' :
//                         p.CurrentStatus === 'Waiting' ? 'bg-orange-100 text-orange-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {p.CurrentStatus}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
//               {recentEvents.length === 0 ? (
//                 <p className="text-gray-500">No recent updates logged</p>
//               ) : (
//                 <div className="space-y-3">
//                   {recentEvents.slice(0, 10).map((event) => (
//                     <div key={event.EventID} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
//                       <div>
//                         <p className="font-semibold text-gray-800">{event.BarcodeNo}</p>
//                         <p className="text-sm text-gray-600">
//                           {event.EventType} {event.Location ? `• ${event.Location}` : ""}
//                         </p>
//                         {event.Remarks && (
//                           <p className="text-xs text-gray-500 mt-1">{event.Remarks}</p>
//                         )}
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         {new Date(event.Timestamp).toLocaleString()}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       }
//       case "addPackage":
//         const onCreate = async (e) => {
//           e.preventDefault();
//           setCreateError("");
//           setCreateSuccess("");
//           setCreating(true);
//           const form = e.target;
//           const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//           const payload = {
//             barcodeNo: form.barcodeNo.value.trim(),
//             type: form.type.value.trim(),
//             mode: form.mode.value,
//             senderName: form.senderName.value.trim() || null,
//             senderAddress: form.senderAddress.value.trim() || null,
//             receiverEmail: form.receiverEmail.value.trim() || null,
//             expectedDeliveryDate: form.expectedDeliveryDate.value || null,
//             handledBy: user.id,
//           };
//           try {
//             const res = await fetch(`${apiUrl}/api/employee/parcels/create`, {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(payload),
//             });
//             if (!res.ok) {
//               const msg = await res.json().catch(() => ({}));
//               throw new Error(msg?.error || "Failed to create package");
//             }
//             setCreateSuccess("Package created successfully.");
//             form.reset();
//           } catch (err) {
//             setCreateError(err.message || "Something went wrong");
//           } finally {
//             setCreating(false);
//           }
//         };
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
//                 <span className="mr-2 text-blue-600"><IconPlus /></span> Add New Package
//               </h2>
//               <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Barcode No</label>
//                   <input name="barcodeNo" type="text" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Unique barcode" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
//                   <input name="type" type="text" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Letter / Parcel / Document" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
//                   <select name="mode" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
//                     <option value="Incoming">Incoming</option>
//                     <option value="Outgoing">Outgoing</option>
//                     <option value="Internal">Internal</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Receiver Email</label>
//                   <input name="receiverEmail" type="email" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional (for internal deliveries)" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
//                   <input name="senderName" type="text" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Sender Address</label>
//                   <input name="senderAddress" type="text" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
//                   <input name="expectedDeliveryDate" type="datetime-local" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <button type="submit" disabled={creating} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
//                     {creating ? "Creating..." : "Create Package"}
//                   </button>
//                 </div>
//               </form>
//               {createError && <p className="text-red-600 mt-4">{createError}</p>}
//               {createSuccess && <p className="text-green-700 mt-4">{createSuccess}</p>}
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//       <div className="flex-1 p-8">
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

// export default EmployeeDashboard;
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";

// function EmployeeDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [profile, setProfile] = useState({});
//   const [assignedParcels, setAssignedParcels] = useState([]);
//   const [recentEvents, setRecentEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [createError, setCreateError] = useState("");
//   const [createSuccess, setCreateSuccess] = useState("");

//   useEffect(() => {
//     if (!user || !user.id) {
//       navigate("/");
//       return;
//     }

//     async function fetchData() {
//       try {
//         const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//         const [pRes, parcelsRes, eventsRes] = await Promise.all([
//           fetch(`${apiUrl}/api/employee/profile/${user.id}`),
//           fetch(`${apiUrl}/api/employee/parcels/assigned/${user.id}`),
//           fetch(`${apiUrl}/api/employee/parcels/recent-events/${user.id}`),
//         ]);
        
//         const p = await pRes.json();
//         const parcelsData = await parcelsRes.json();
//         const eventsData = await eventsRes.json();
        
//         setProfile(p);
//         setAssignedParcels(Array.isArray(parcelsData) ? parcelsData : []);
//         setRecentEvents(Array.isArray(eventsData) ? eventsData : []);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [user, navigate]);

//   const handleStatusUpdate = async (mailId, newStatus) => {
//     if (!newStatus) return;
    
//     setUpdating(true);
//     try {
//       const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//       const res = await fetch(`${apiUrl}/api/employee/parcels/update-status`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           mailId,
//           newStatus,
//           empId: user.id,
//         }),
//       });

//       if (res.ok) {
//         // Refresh assigned parcels
//         const [parcelsRes, eventsRes] = await Promise.all([
//           fetch(`${apiUrl}/api/employee/parcels/assigned/${user.id}`),
//           fetch(`${apiUrl}/api/employee/parcels/recent-events/${user.id}`),
//         ]);
//         const parcelsData = await parcelsRes.json();
//         const eventsData = await eventsRes.json();
//         setAssignedParcels(Array.isArray(parcelsData) ? parcelsData : []);
//         setRecentEvents(Array.isArray(eventsData) ? eventsData : []);
//       } else {
//         alert("Failed to update status");
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Error updating status");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   const renderContent = () => {
//     switch (activeTab) {
//       case "profile":
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-8">
//               <div className="flex items-center space-x-4 mb-6">
//                 <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
//                   {profile?.Name?.charAt(0)?.toUpperCase() || "E"}
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">{profile?.Name || "Employee"}</h2>
//                   <p className="text-gray-500">{profile?.Role || "Employee"}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Full Name</label>
//                   <div className="text-lg font-semibold text-gray-800">{profile?.Name || "N/A"}</div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Role</label>
//                   <div className="text-lg font-semibold text-gray-800">{profile?.Role || "N/A"}</div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Login ID</label>
//                   <div className="text-lg font-semibold text-gray-800">{profile?.LoginID || "N/A"}</div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Contact Number</label>
//                   <div className="text-lg font-semibold text-gray-800">{profile?.ContactNumber || "N/A"}</div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-500">Post Office</label>
//                   <div className="text-lg font-semibold text-gray-800">
//                     {profile?.PostOfficeName
//                       ? `${profile.PostOfficeName} (${profile.PostOfficeID || "N/A"})`
//                       : profile?.PostOfficeID || "N/A"}
//                   </div>
//                   {profile?.PostOfficeLocation && (
//                     <p className="text-sm text-gray-500">{profile.PostOfficeLocation}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case "assigned":
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                   <span className="mr-3"></span>
//                   Assigned Parcels
//                 </h2>
//                 <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
//                   {assignedParcels.length} Assigned
//                 </span>
//               </div>
//               {assignedParcels.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="text-6xl mb-4"></div>
//                   <p className="text-gray-500 text-lg">No parcels currently assigned to you</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {assignedParcels.map((p) => (
//                     <div key={p.MailID} className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl hover:shadow-lg transition-shadow">
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="flex-1">
//                           <div className="flex items-center space-x-3 mb-3">
//                             <span className="font-bold text-xl text-gray-800">{p.BarcodeNo}</span>
//                             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                               p.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
//                               p.CurrentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                               p.CurrentStatus === 'In Transit' ? 'bg-blue-100 text-blue-800' :
//                               'bg-gray-100 text-gray-800'
//                             }`}>
//                               {p.CurrentStatus}
//                             </span>
//                           </div>
//                           <div className="text-sm text-gray-600 space-y-1 mb-3">
//                             <p><span className="font-medium">Type:</span> {p.Type} | <span className="font-medium">Mode:</span> {p.Mode}</p>
//                             {p.ReceiverName && (
//                               <p>
//                                 <span className="font-medium">Recipient:</span> {p.ReceiverName}
//                                 {p.ReceiverEmail && (
//                                   <span className="text-xs text-gray-500 ml-2">{p.ReceiverEmail}</span>
//                                 )}
//                               </p>
//                             )}
//                             {p.SenderName && (
//                               <p><span className="font-medium">From:</span> {p.SenderName} ({p.SenderAddress})</p>
//                             )}
//                             {p.ExpectedDeliveryDate && (
//                               <p><span className="font-medium">Expected Delivery:</span> {new Date(p.ExpectedDeliveryDate).toLocaleDateString()}</p>
//                             )}
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <select
//                             value={p.CurrentStatus}
//                             onChange={(e) => handleStatusUpdate(p.MailID, e.target.value)}
//                             disabled={updating}
//                             className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <option value="Pending">Pending</option>
//                             <option value="Waiting">Waiting</option>
//                             <option value="In Transit">In Transit</option>
//                             <option value="Delivered">Delivered</option>
//                             <option value="Returned">Returned</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       default: {
//         const pendingCount = assignedParcels.filter(p => p.CurrentStatus === 'Pending').length;
//         const waitingCount = assignedParcels.filter(p => p.CurrentStatus === 'Waiting').length;
//         const inTransitCount = assignedParcels.filter(p => p.CurrentStatus === 'In Transit').length;
//         const deliveredCount = assignedParcels.filter(p => p.CurrentStatus === 'Delivered').length;

//         return (
//           <div className="space-y-6">
//             {/* Welcome Card */}
//             <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
//               <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Employee"}! 👋</h1>
//               <p className="text-blue-100">Manage your assigned parcels efficiently</p>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">Assigned Parcels</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{assignedParcels.length}</p>
//                   </div>
//                   <div className="text-4xl"></div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">Pending</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{pendingCount}</p>
//                   </div>
//                   <div className="text-4xl"></div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">Waiting</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{waitingCount}</p>
//                   </div>
//                   <div className="text-4xl">🕒</div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">In Transit</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{inTransitCount}</p>
//                   </div>
//                   <div className="text-4xl">🚚</div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm font-medium">Delivered</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{deliveredCount}</p>
//                   </div>
//                   <div className="text-4xl">✅</div>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Assigned Parcels */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Assigned Parcels</h2>
//               {assignedParcels.length === 0 ? (
//                 <p className="text-gray-500">No parcels assigned yet</p>
//               ) : (
//                 <div className="space-y-3">
//                   {assignedParcels.slice(0, 5).map((p) => (
//                     <div key={p.MailID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                       <div>
//                         <span className="font-semibold text-gray-800">{p.BarcodeNo}</span>
//                         <span className="ml-3 text-sm text-gray-600">{p.Type} • {p.Mode}</span>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         p.CurrentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
//                         p.CurrentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                         p.CurrentStatus === 'In Transit' ? 'bg-blue-100 text-blue-800' :
//                         p.CurrentStatus === 'Waiting' ? 'bg-orange-100 text-orange-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {p.CurrentStatus}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
//               {recentEvents.length === 0 ? (
//                 <p className="text-gray-500">No recent updates logged</p>
//               ) : (
//                 <div className="space-y-3">
//                   {recentEvents.slice(0, 10).map((event) => (
//                     <div key={event.EventID} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
//                       <div>
//                         <p className="font-semibold text-gray-800">{event.BarcodeNo}</p>
//                         <p className="text-sm text-gray-600">
//                           {event.EventType} {event.Location ? `• ${event.Location}` : ""}
//                         </p>
//                         {event.Remarks && (
//                           <p className="text-xs text-gray-500 mt-1">{event.Remarks}</p>
//                         )}
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         {new Date(event.Timestamp).toLocaleString()}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       }
//       case "addPackage":
//         const onCreate = async (e) => {
//           e.preventDefault();
//           setCreateError("");
//           setCreateSuccess("");
//           setCreating(true);
//           const form = e.target;
//           const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//           const payload = {
//             barcodeNo: form.barcodeNo.value.trim(),
//             type: form.type.value.trim(),
//             mode: form.mode.value,
//             senderName: form.senderName.value.trim() || null,
//             senderAddress: form.senderAddress.value.trim() || null,
//             receiverEmail: form.receiverEmail.value.trim() || null,
//             expectedDeliveryDate: form.expectedDeliveryDate.value || null,
//             handledBy: user.id,
//           };
//           try {
//             const res = await fetch(`${apiUrl}/api/employee/parcels/create`, {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(payload),
//             });
//             if (!res.ok) {
//               const msg = await res.json().catch(() => ({}));
//               throw new Error(msg?.error || "Failed to create package");
//             }
//             setCreateSuccess("Package created successfully.");
//             form.reset();
//           } catch (err) {
//             setCreateError(err.message || "Something went wrong");
//           } finally {
//             setCreating(false);
//           }
//         };
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
//                 <span className="mr-2">➕</span> Add New Package
//               </h2>
//               <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Barcode No</label>
//                   <input name="barcodeNo" type="text" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Unique barcode" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
//                   <input name="type" type="text" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Letter / Parcel / Document" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
//                   <select name="mode" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
//                     <option value="Incoming">Incoming</option>
//                     <option value="Outgoing">Outgoing</option>
//                     <option value="Internal">Internal</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Receiver Email</label>
//                   <input name="receiverEmail" type="email" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional (for internal deliveries)" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
//                   <input name="senderName" type="text" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Sender Address</label>
//                   <input name="senderAddress" type="text" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
//                   <input name="expectedDeliveryDate" type="datetime-local" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <button type="submit" disabled={creating} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
//                     {creating ? "Creating..." : "Create Package"}
//                   </button>
//                 </div>
//               </form>
//               {createError && <p className="text-red-600 mt-4">{createError}</p>}
//               {createSuccess && <p className="text-green-700 mt-4">{createSuccess}</p>}
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//       <div className="flex-1 p-8">
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

// export default EmployeeDashboard;
