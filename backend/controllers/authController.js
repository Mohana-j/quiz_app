const db = require("../config/db");
const bcrypt = require("bcrypt");

// ✅ Register User
exports.register = (req, res) => {
  const { name, email, password } = req.body;
  let role = "user"; // Default role

  // If the email belongs to admin, assign admin role
  if (email === "admin@example.com") {
    role = "admin";
  }

  // Check if the email is already registered
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("❌ Error hashing password:", err);
        return res.status(500).json({ message: "Error hashing password" });
      }

      // Insert user into the database
      db.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [name, email, hash, role],
        (err) => {
          if (err) {
            console.error("❌ Error registering user:", err);
            return res.status(500).json({ message: "Error registering user" });
          }
          res.json({ message: "User registered successfully!" });
        }
      );
    });
  });
};

// ✅ Login User
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Fetch user by email
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password with stored hash
    bcrypt.compare(password, results[0].password_hash, (err, match) => {
      if (err) {
        console.error("❌ Error comparing passwords:", err);
        return res.status(500).json({ message: "Error comparing passwords" });
      }

      if (!match) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // ✅ If admin, return admin access
      if (results[0].role === "admin") {
        return res.json({ message: "Admin login successful!", role: "admin", user_id: results[0].user_id });
      }

      // ✅ If normal user, return user access
      res.json({ message: "Login successful!", role: "user", user_id: results[0].user_id });
    });
  });
};
