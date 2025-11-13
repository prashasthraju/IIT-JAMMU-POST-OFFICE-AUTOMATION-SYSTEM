// src/App.jsx
import React from "react";
// Import useLocation for AnimatePresence
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// Import framer-motion
import { AnimatePresence } from "framer-motion";

// Import your components
import LoginSelector from "./Components/LoginSelector";
import AdminLogin from "./Components/AdminLogin";
import EmployeeLogin from "./Components/EmployeeLogin";
import UserLogin from "./Components/UserLogin";
import AdminDashboard from "./Components/AdminDashboard";
import EmployeeDashboard from "./Components/EmployeeDashboard";
import UserDashboard from "./Components/UserDashboard";
import UserSignup from "./Components/UserSignup";
import { useAuth } from "./context/AuthContext";

// Import your new animation wrapper
import AnimatedPage from "./Components/AnimatedPage";

function ProtectedRoute({ children, allowedRole }) {
  const { user, ready } = useAuth();

  if (!ready) return null;

  if (!user) return <Navigate to="/" replace />;
  
  const got = String(user.role || "").toLowerCase();
  const want = String(allowedRole || "").toLowerCase();
  if (got !== want) return <Navigate to="/" replace />;

  return children;
}

function App() {
  // Get the location object for AnimatePresence
  const location = useLocation();

  return (
    // Minimalist palette: set a very light gray background
    <div className="min-h-screen bg-gray-50">
      
      {/* AnimatePresence handles the exit/enter animations */}
      <AnimatePresence mode="wait">
        
        {/* We pass location and a key to Routes so AnimatePresence detects page changes */}
        <Routes location={location} key={location.pathname}>
          
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <AnimatedPage>
                <LoginSelector />
              </AnimatedPage>
            }
          />
          <Route
            path="/login/admin"
            element={
              <AnimatedPage>
                <AdminLogin />
              </AnimatedPage>
            }
          />
          <Route
            path="/login/employee"
            element={
              <AnimatedPage>
                <EmployeeLogin />
              </AnimatedPage>
            }
          />
          <Route
            path="/login/user"
            element={
              <AnimatedPage>
                <UserLogin />
              </AnimatedPage>
            }
          />
          <Route
            path="/signup/user"
            element={
              <AnimatedPage>
                <UserSignup />
              </AnimatedPage>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AnimatedPage>
                  <AdminDashboard />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRole="employee">
                <AnimatedPage>
                  <EmployeeDashboard />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRole="user">
                <AnimatedPage>
                  <UserDashboard />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
// // import { Routes, Route, Navigate } from "react-router-dom";
// // import LoginSelector from "./Components/LoginSelector";
// // import AdminLogin from "./Components/AdminLogin";
// // import EmployeeLogin from "./Components/EmployeeLogin";
// // import UserLogin from "./Components/UserLogin";
// // import AdminDashboard from "./Components/AdminDashboard";
// // import EmployeeDashboard from "./Components/EmployeeDashboard";
// // import UserDashboard from "./Components/UserDashboard";
// // import { useAuth } from "./context/AuthContext";

// // function ProtectedRoute({ children, allowedRole }) {
// //   const { user } = useAuth();

// //   if (!user) return <Navigate to="/" replace />;
// //   if (user.role !== allowedRole) return <Navigate to="/" replace />;

// //   return children;
// // }

// // function App() {
// //   return (
// //     <div className="min-h-screen bg-gray-100">
// //       <Routes>
// //         {/* login selector */}
// //         <Route path="/" element={<LoginSelector />} />

// //         {/* role-based login pages */}
// //         <Route path="/login/admin" element={<AdminLogin />} />
// //         <Route path="/login/employee" element={<EmployeeLogin />} />
// //         <Route path="/login/user" element={<UserLogin />} />

// //         {/* protected components */}
// //         <Route
// //           path="/admin/dashboard"
// //           element={
// //             <ProtectedRoute allowedRole="admin">
// //               <AdminDashboard />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/employee/dashboard"
// //           element={
// //             <ProtectedRoute allowedRole="employee">
// //               <EmployeeDashboard />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/user/dashboard"
// //           element={
// //             <ProtectedRoute allowedRole="user">
// //               <UserDashboard />
// //             </ProtectedRoute>
// //           }
// //         />
// //       </Routes>
// //     </div>
// //   );
// // }

// // export default App;
// // src/App.jsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginSelector from "./Components/LoginSelector";
// import AdminLogin from "./Components/AdminLogin";
// import EmployeeLogin from "./Components/EmployeeLogin";
// import UserLogin from "./Components/UserLogin";
// import AdminDashboard from "./Components/AdminDashboard";
// import EmployeeDashboard from "./Components/EmployeeDashboard";
// import UserDashboard from "./Components/UserDashboard";
// import UserSignup from "./Components/UserSignup";
// import { useAuth } from "./context/AuthContext";

// function ProtectedRoute({ children, allowedRole }) {
//   const { user, ready } = useAuth();

//   // while auth loads, avoid redirecting (prevents race)
//   if (!ready) return null;

//   if (!user) return <Navigate to="/" replace />;
//   // normalized compare
//   const got = String(user.role || "").toLowerCase();
//   const want = String(allowedRole || "").toLowerCase();
//   if (got !== want) return <Navigate to="/" replace />;

//   return children;
// }

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 bg">
//       <Routes>
//         <Route path="/" element={<LoginSelector />} />
//         <Route path="/login/admin" element={<AdminLogin />} />
//         <Route path="/login/employee" element={<EmployeeLogin />} />
//         <Route path="/login/user" element={<UserLogin />} />
//         <Route path="/signup/user" element={<UserSignup />} />

//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/employee/dashboard"
//           element={
//             <ProtectedRoute allowedRole="employee">
//               <EmployeeDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/user/dashboard"
//           element={
//             <ProtectedRoute allowedRole="user">
//               <UserDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;
