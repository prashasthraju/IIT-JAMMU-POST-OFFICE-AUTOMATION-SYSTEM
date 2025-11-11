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
app.post("/login", async (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    // ========== ADMIN / EMPLOYEE LOGIN ==========
    if (userType === "admin" || userType === "employee") {
      const [rows] = await pool.query(
        "SELECT EmployeeID AS id, Name, Role, LoginID AS username, PasswordHash, ContactNumber, PostOfficeID FROM Employee WHERE LoginID = ?",
        [username]
      );

      if (rows.length === 0)
        return res.status(401).json({ success: false, message: "Invalid username" });

      const emp = rows[0];
      if (emp.PasswordHash !== password)
        return res.status(401).json({ success: false, message: "Invalid password" });

      // Role mapping: Head Officer and Manager are admins, others are employees
      const role =
        emp.Role === "Head Officer" || emp.Role === "Manager" ? "admin" : "employee";

      return res.json({
        success: true,
        role,
        id: emp.id,
        name: emp.Name,
        username: emp.username,
        employeeRole: emp.Role,
        contactNumber: emp.ContactNumber,
        postOfficeID: emp.PostOfficeID,
      });
    }

    // ========== USER LOGIN ==========
    else if (userType === "user") {
      const [rows] = await pool.query(
        "SELECT PersonID AS id, Name, Role, Email AS username, PasswordHash, ContactNumber, DeptID, BuildingId, RoomNumber FROM Person WHERE Email = ?",
        [username]
      );

      if (rows.length === 0)
        return res.status(401).json({ success: false, message: "Invalid email" });

      const person = rows[0];
      // Handle case where PasswordHash might be NULL (for existing records)
      if (!person.PasswordHash || person.PasswordHash !== password)
        return res.status(401).json({ success: false, message: "Invalid password" });

      return res.json({
        success: true,
        role: "user",
        id: person.id,
        name: person.Name,
        email: person.username,
        contactNumber: person.ContactNumber,
        roleType: person.Role,
      });
    }

    // ========== INVALID TYPE ==========
    else {
      return res.status(400).json({ success: false, message: "Invalid user type" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});


// 🔹 Integrated Dashboard Routes
app.use("/api/user", userRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
