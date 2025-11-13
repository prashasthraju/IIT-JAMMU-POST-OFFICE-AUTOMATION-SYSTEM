import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
// Import Chart.js components
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

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

        // Corrected the profile fetch URL to include the user ID
        const [pRes, sRes, parcelsRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/profile/${user.id}`), // <-- Fixed
          fetch(`${apiUrl}/api/admin/summary`),
          fetch(`${apiUrl}/api/admin/parcels`),
        ]);

        // Add error checking for non-OK responses
        if (!pRes.ok) throw new Error(`Profile fetch failed: ${pRes.status}`);
        if (!sRes.ok) throw new Error(`Summary fetch failed: ${sRes.status}`);
        if (!parcelsRes.ok) throw new Error(`Parcels fetch failed: ${parcelsRes.status}`);

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

  // --- Chart Data & Options ---
  // Memoize chart data to prevent re-renders
  const summaryChartData = {
    labels: summary.map((s) => s.CurrentStatus),
    datasets: [
      {
        label: "Mail Count",
        data: summary.map((s) => s.Count),
        backgroundColor: [
          '#3b82f6', // Blue (Delivered)
          '#f97316', // Orange (Pending)
          '#eab308', // Yellow (In Transit)
          '#ef4444', // Red (Returned)
          '#6b7280', // Gray (Waiting)
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  // --- End Chart ---

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          {/* Changed loading spinner color */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
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
            {/* Changed card style */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center space-x-4 mb-6">
                {/* Changed avatar style */}
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {profile?.Name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.Name || "Admin"}</h2>
                  <p className="text-gray-600">{profile?.Role || "Administrator"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Changed text styles */}
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
                  <label className="text-sm font-medium text-gray-500">Post Office Name</label>
                  <div className="text-lg font-semibold text-gray-800">{profile?.PostOfficeName || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "parcels":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Removed emoji */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                All Parcels
              </h2>
              {parcels.length === 0 ? (
                <div className="text-center py-12">
                  {/* Removed emoji */}
                  <p className="text-gray-500 text-lg">No parcels found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    {/* Changed table header style */}
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Barcode</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mode</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Received</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parcels.map((p) => (
                        <tr key={p.MailID} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.BarcodeNo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.Type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.Mode}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* Standardized status badge */}
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
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
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Removed emoji */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Mail Status Summary
              </h2>
              {summary.length === 0 ? (
                <div className="text-center py-12">
                  {/* Removed emoji */}
                  <p className="text-gray-500 text-lg">No data available</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {/* Changed summary card style */}
                  {summary.map((s) => (
                    <div key={s.CurrentStatus} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{s.Count}</div>
                      <div className="text-sm font-semibold text-gray-600 capitalize">{s.CurrentStatus}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Added chart to summary page */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status Visualization</h2>
              <div style={{ height: '400px' }}>
                <Doughnut data={summaryChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        );

      default: // dashboard
        const totalParcels = parcels.length;
        const deliveredCount = summary.find(s => s.CurrentStatus === 'Delivered')?.Count || 0;
        const pendingCount = summary.find(s => s.CurrentStatus === 'Pending')?.Count || 0;

        return (
          <div className="space-y-6">
            {/* Changed Welcome Card style */}
            <div className="bg-gray-800 rounded-lg shadow-md p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Admin"}!</h1>
              <p className="text-gray-300">Manage the post office system efficiently</p>
            </div>

            {/* Changed Stats Cards style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-b-4 border-gray-800">
                <p className="text-gray-500 text-sm font-medium">Total Parcels</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalParcels}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-b-4 border-gray-800">
                <p className="text-gray-500 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{deliveredCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-b-4 border-gray-800">
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{pendingCount}</p>
              </div>
            </div>

            {/* Replaced Status Summary with Doughnut Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status Overview</h2>
              {summary.length === 0 ? (
                <p className="text-gray-500">No data available</p>
              ) : (
                <div style={{ height: '350px' }}>
                  <Doughnut data={summaryChartData} options={chartOptions} />
                </div>
              )}
            </div>

            {/* Recent Parcels - cleaned up style */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Parcels</h2>
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
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
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
    // Changed main bg and added font-sans
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;

// export default AdminDashboard;
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";

// function AdminDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [profile, setProfile] = useState({});
//   const [summary, setSummary] = useState([]);
//   const [parcels, setParcels] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user || !user.id) {
//       navigate("/");
//       return;
//     }

//     async function fetchData() {
//       try {
//         const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

//         // const [pRes, sRes, parcelsRes] = await Promise.all([
//         //   fetch(`${apiUrl}/api/admin/profile/`),
//         //   fetch(`${apiUrl}/api/admin/summary`),
//         //   fetch(`${apiUrl}/api/admin/parcels`),
//         // ]);
//         const [pRes, sRes, parcelsRes] = await Promise.all([
//         // Add user.id to the URL
//          fetch(`${apiUrl}/api/admin/profile/${user.id}`), // <-- FIXED
//         fetch(`${apiUrl}/api/admin/summary`),
//        fetch(`${apiUrl}/api/admin/parcels`),
//     ]);
//         const p = await pRes.json();
//         const s = await sRes.json();
//         const parcelsData = await parcelsRes.json();

//         setProfile(p);
//         setSummary(Array.isArray(s) ? s : []);
//         setParcels(Array.isArray(parcelsData) ? parcelsData : []);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [user, navigate]);

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
//                 <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
//                   {profile?.Name?.charAt(0)?.toUpperCase() || "A"}
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">{profile?.Name || "Admin"}</h2>
//                   <p className="text-gray-500">{profile?.Role || "Administrator"}</p>
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
//                   <label className="text-sm font-medium text-gray-500">Post Office ID</label>
//                   <div className="text-lg font-semibold text-gray-800">{profile?.PostOfficeID || "N/A"}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case "parcels":
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
//                 <span className="mr-3">📦</span>
//                 All Parcels
//               </h2>

//               {parcels.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="text-6xl mb-4">📭</div>
//                   <p className="text-gray-500 text-lg">No parcels found</p>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
//                       <tr>
//                         <th className="px-6 py-4">Barcode</th>
//                         <th className="px-6 py-4">Type</th>
//                         <th className="px-6 py-4">Mode</th>
//                         <th className="px-6 py-4">Status</th>
//                         <th className="px-6 py-4">Date Received</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {parcels.map((p) => (
//                         <tr key={p.MailID} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4">{p.BarcodeNo}</td>
//                           <td className="px-6 py-4">{p.Type}</td>
//                           <td className="px-6 py-4">{p.Mode}</td>
//                           <td className="px-6 py-4">
//                             <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200">
//                               {p.CurrentStatus}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4">
//                             {p.DateReceived ? new Date(p.DateReceived).toLocaleDateString() : "N/A"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case "summary":
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
//                 <span className="mr-3">📈</span>
//                 Mail Status Summary
//               </h2>

//               {summary.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="text-6xl mb-4">📊</div>
//                   <p className="text-gray-500 text-lg">No data available</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//                   {summary.map((s) => (
//                     <div
//                       key={s.CurrentStatus}
//                       className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow"
//                     >
//                       <div className="text-4xl font-bold text-indigo-600 mb-2">{s.Count}</div>
//                       <div className="text-sm font-semibold text-gray-700 capitalize">
//                         {s.CurrentStatus}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       default: {
//         const totalParcels = parcels.length;
//         const deliveredCount = summary.find((s) => s.CurrentStatus === "Delivered")?.Count || 0;
//         const pendingCount = summary.find((s) => s.CurrentStatus === "Pending")?.Count || 0;

//         return (
//           <div className="space-y-6">
//             {/* Welcome Card */}
//             <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
//               <h1 className="text-3xl font-bold mb-2">
//                 Welcome back, {user?.name || "Admin"}! 👋
//               </h1>
//               <p className="text-red-100">Manage the post office system efficiently</p>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
//                 <p className="text-gray-500 text-sm font-medium">Total Parcels</p>
//                 <p className="text-3xl font-bold text-gray-800 mt-2">{totalParcels}</p>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
//                 <p className="text-gray-500 text-sm font-medium">Delivered</p>
//                 <p className="text-3xl font-bold text-gray-800 mt-2">{deliveredCount}</p>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
//                 <p className="text-gray-500 text-sm font-medium">Pending</p>
//                 <p className="text-3xl font-bold text-gray-800 mt-2">{pendingCount}</p>
//               </div>
//             </div>

//             {/* Status Summary */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Status Overview</h2>
//               {summary.length === 0 ? (
//                 <p className="text-gray-500">No data available</p>
//               ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//                   {summary.map((s) => (
//                     <div key={s.CurrentStatus} className="bg-gray-50 rounded-lg p-4 text-center">
//                       <div className="text-2xl font-bold text-indigo-600">{s.Count}</div>
//                       <div className="text-sm text-gray-600 mt-1 capitalize">{s.CurrentStatus}</div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Recent Parcels */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Parcels</h2>
//               {parcels.length === 0 ? (
//                 <p className="text-gray-500">No parcels found</p>
//               ) : (
//                 <div className="space-y-3">
//                   {parcels.slice(0, 5).map((p) => (
//                     <div
//                       key={p.MailID}
//                       className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <div>
//                         <span className="font-semibold text-gray-800">{p.BarcodeNo}</span>
//                         <span className="ml-3 text-sm text-gray-600">
//                           {p.Type} • {p.Mode}
//                         </span>
//                       </div>
//                       <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200">
//                         {p.CurrentStatus}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       }
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//       <div className="flex-1 p-8">{renderContent()}</div>
//     </div>
//   );
// }

// export default AdminDashboard;
