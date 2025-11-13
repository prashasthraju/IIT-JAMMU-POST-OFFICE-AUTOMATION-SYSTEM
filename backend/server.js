// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import pool from "./db.js";

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// // 🔹 Test route
// app.get("/", (req, res) => {
//   res.send("✅ Backend running on localhost");
// });

// // 🔹 Fetch all users (for debugging/demo)
// app.get("/users", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM users");
//     res.json(rows);
//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).send("Database error");
//   }
// });

// // 🔹 Simple login route (no hashing yet)
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password)
//     return res.status(400).json({ success: false, message: "Missing fields" });

//   try {
//     const [rows] = await pool.query(
//       "SELECT * FROM users WHERE username = ? AND password = ?",
//       [username, password]
//     );

//     if (rows.length > 0) {
//       const user = rows[0];
//       res.json({ success: true, role: user.role, id: user.id });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Base route
app.get("/", (req, res) => {
  res.send("✅ Backend running for IIT JAMMU POST OFFICE SYSTEM");
});

// 🔹 Simple login route (for your existing AuthContext)
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password)
//     return res.status(400).json({ success: false, message: "Missing fields" });

//   try {
//     const [rows] = await pool.query(
//       "SELECT * FROM users WHERE username = ? AND password = ?",
//       [username, password]
//     );

//     if (rows.length > 0) {
//       const user = rows[0];
//       res.json({ success: true, role: user.role, id: user.id });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).send("Server error");
//   }
// });
// --- LOGIN ROUTE --- //
// import express from "express";
 // ✅ use your existing connection pool

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    // ============================================================
    // 1️⃣ ADMIN LOGIN
    // ============================================================
    if (userType === "admin") {
      const [rows] = await pool.query(
        `SELECT 
            EmployeeID AS id, 
            Name, 
            Role, 
            LoginID AS username, 
            PasswordHash, 
            ContactNumber, 
            PostOfficeID, 
            HasAccess
         FROM Employee 
         WHERE LoginID = ? AND Role = 'Admin' AND HasAccess = TRUE`,
        [username]
      );

      if (rows.length === 0)
        return res.status(401).json({ success: false, message: "Invalid admin credentials" });

      const admin = rows[0];
      const isPasswordValid = password === admin.PasswordHash; // 🔹 direct comparison

      if (!isPasswordValid)
        return res.status(401).json({ success: false, message: "Invalid password" });

      return res.json({
        success: true,
        role: "admin",
        id: admin.id,
        name: admin.Name,
        username: admin.username,
        contactNumber: admin.ContactNumber,
        postOfficeID: admin.PostOfficeID,
      });
    }

    // ============================================================
    // 2️⃣ EMPLOYEE LOGIN (non-admin)
    // ============================================================
    else if (userType === "employee") {
      const [rows] = await pool.query(
        `SELECT 
            EmployeeID AS id, 
            Name, 
            Role, 
            LoginID AS username, 
            PasswordHash, 
            ContactNumber, 
            PostOfficeID, 
            HasAccess
         FROM Employee 
         WHERE LoginID = ? AND HasAccess = TRUE AND Role <> 'Admin'`,
        [username]
      );

      if (rows.length === 0)
        return res.status(401).json({ success: false, message: "Invalid employee credentials" });

      const emp = rows[0];
      const isPasswordValid = password === emp.PasswordHash;

      if (!isPasswordValid)
        return res.status(401).json({ success: false, message: "Invalid password" });

      return res.json({
        success: true,
        role: emp.Role,
        id: emp.id,
        name: emp.Name,
        username: emp.username,
        contactNumber: emp.ContactNumber,
        postOfficeID: emp.PostOfficeID,
      });
    }

    // ============================================================
    // 3️⃣ USER LOGIN (Person table)
    // ============================================================
    else if (userType === "user") {
      const [rows] = await pool.query(
        `SELECT 
            PersonID AS id, 
            Name, 
            Email AS username, 
            PasswordHash, 
            ContactNumber
         FROM Person 
         WHERE Email = ?`,
        [username]
      );

      if (rows.length === 0)
        return res.status(401).json({ success: false, message: "Invalid user credentials" });

      const person = rows[0];
      const isPasswordValid = password === person.PasswordHash;

      if (!isPasswordValid)
        return res.status(401).json({ success: false, message: "Invalid password" });

      return res.json({
        success: true,
        role: "user",
        id: person.id,
        name: person.Name,
        email: person.username,
        contactNumber: person.ContactNumber,
      });
    }

    // ============================================================
    // 4️⃣ INVALID USERTYPE
    // ============================================================
    else {
      return res.status(400).json({ success: false, message: "Invalid user type" });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// mount auth router on root
app.use("/", router);

// import bcrypt from "bcrypt";  // make sure to install bcrypt
// // npm install bcrypt

// app.post("/login", async (req, res) => {
//   const { username, password, userType } = req.body;

//   if (!username || !password || !userType) {
//     return res.status(400).json({ success: false, message: "Missing fields" });
//   }

//   try {
//     // ============================================================
//     // 1️⃣ ADMIN LOGIN
//     // ============================================================
//     if (userType === "admin") {
//       const [rows] = await pool.query(
//         `SELECT 
//             EmployeeID AS id, 
//             Name, 
//             Role, 
//             LoginID AS username, 
//             PasswordHash, 
//             ContactNumber, 
//             PostOfficeID, 
//             HasAccess
//          FROM Employee 
//          WHERE LoginID = ? AND Role = 'Admin' AND HasAccess = TRUE`,
//         [username]
//       );

//       if (rows.length === 0) {
//         return res.status(401).json({ success: false, message: "Invalid admin credentials" });
//       }

//       const admin = rows[0];

//       // compare password securely
//       const isPasswordValid = await bcrypt.compare(password, admin.PasswordHash);

//       if (!isPasswordValid) {
//         return res.status(401).json({ success: false, message: "Invalid password" });
//       }

//       return res.json({
//         success: true,
//         role: "admin",
//         id: admin.id,
//         name: admin.Name,
//         username: admin.username,
//         contactNumber: admin.ContactNumber,
//         postOfficeID: admin.PostOfficeID,
//       });
//     }

//     // ============================================================
//     // 2️⃣ EMPLOYEE LOGIN (non-admin)
//     // ============================================================
//     else if (userType === "employee") {
//       const [rows] = await pool.query(
//         `SELECT 
//             EmployeeID AS id, 
//             Name, 
//             Role, 
//             LoginID AS username, 
//             PasswordHash, 
//             ContactNumber, 
//             PostOfficeID, 
//             HasAccess
//          FROM Employee 
//          WHERE LoginID = ? AND HasAccess = TRUE AND Role <> 'Admin'`,
//         [username]
//       );

//       if (rows.length === 0) {
//         return res.status(401).json({ success: false, message: "Invalid employee credentials" });
//       }

//       const emp = rows[0];
//       const isPasswordValid = await bcrypt.compare(password, emp.PasswordHash);

//       if (!isPasswordValid) {
//         return res.status(401).json({ success: false, message: "Invalid password" });
//       }

//       return res.json({
//         success: true,
//         role: emp.Role,
//         id: emp.id,
//         name: emp.Name,
//         username: emp.username,
//         contactNumber: emp.ContactNumber,
//         postOfficeID: emp.PostOfficeID,
//       });
//     }

//     // ============================================================
//     // 3️⃣ INVALID USERTYPE
//     // ============================================================
//     else {
//       return res.status(400).json({ success: false, message: "Invalid user type" });
//     }
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

// else if (userType === "user") {
//   const [rows] = await pool.query(
//     "SELECT PersonID AS id, Name, Email AS username, PasswordHash, ContactNumber FROM Person WHERE Email = ?",
//     [username]
//   );

//   // Check if the email exists
//   if (rows.length === 0) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid user credentials" });
//   }

//   const person = rows[0];

//   // ⚠️ Recommended: use bcrypt for secure password comparison
//   // If you're storing plain hashes like "hash1", compare directly (not recommended)
//   const isPasswordValid = person.PasswordHash === password;

//   // If using bcrypt, replace above with:
//   // const isPasswordValid = await bcrypt.compare(password, person.PasswordHash);

//   if (!isPasswordValid) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid password" });
//   }

//   // Successful login response
//   return res.json({
//     success: true,
//     role: "user",
//     id: person.id,
//     name: person.Name,
//     email: person.username,
//     contactNumber: person.ContactNumber,
//   });
// }

//     // // ========== USER LOGIN (User table) ==========
//     // else if (userType === "user") {
//     //   const [rows] = await pool.query(
//     //     "SELECT UserID AS id, Name, Email AS username, PasswordHash, ContactNumber FROM person WHERE Email = ?",
//     //     [username]
//     //   );

//     //   if (rows.length === 0)
//     //     return res.status(401).json({ success: false, message: "Invalid user credentials" });

//     //   const person = rows[0];
//     //   if (!person.PasswordHash || person.PasswordHash !== password)
//     //     return res.status(401).json({ success: false, message: "Invalid password" });

//     //   return res.json({
//     //     success: true,
//     //     role: "user",
//     //     id: person.id,
//     //     name: person.Name,
//     //     email: person.username,
//     //     contactNumber: person.ContactNumber,
//     //   });
//     // }

//     // ========== INVALID TYPE ==========
//     else {
//       return res.status(400).json({ success: false, message: "Invalid user type" });
//     }
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).send("Server error");
//   }
// });


// 🔹 Integrated Dashboard Routes
app.use("/api/user", userRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
