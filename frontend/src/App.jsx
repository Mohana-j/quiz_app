import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Welcome from "./pages/welcome/Welcome";
import QuizCategories from "./pages/quiz/Categories";
import QuizPage from "./pages/quiz/QuizPage";
import AdminDashboard from "./pages/admin/AdminDashboard"; // ✅ Import Admin Dashboard
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import { useAuthStore } from "./store/useAuthStore"; // Zustand authentication store

const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebarAndNavbar = location.pathname === "/";

  return (
    <div>
      {!hideSidebarAndNavbar && (
        <div style={styles.navbarWrapper}>
          <Navbar />
        </div>
      )}

      <div style={{ display: "flex", height: "100vh" }}>
        {!hideSidebarAndNavbar && (
          <div style={styles.sidebarWrapper}>
            <Sidebar />
          </div>
        )}

        <div style={{
          flex: 1,
          marginLeft: hideSidebarAndNavbar ? "0px" : "250px",
          marginTop: hideSidebarAndNavbar ? "0px" : "70px",
          padding: "20px",
          overflowY: "auto",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

/* =========================================
   🚀 Admin Access Restriction
========================================= */
const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  React.useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/categories"); // Redirect non-admins
    }
  }, [user, navigate]);

  return user?.role === "admin" ? children : null;
};

/* =========================================
   🚀 Main App Component (Routing Setup)
========================================= */
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/categories" element={<Layout><QuizCategories /></Layout>} />
        <Route path="/quiz/:category" element={<Layout><QuizPage /></Layout>} />
        {/* ✅ Admin-Only Route */}
        <Route path="/admin/manage-questions" element={<Layout><AdminRoute><AdminDashboard /></AdminRoute></Layout>} />
      </Routes>
    </Router>
  );
};

/* ✅ CSS for Layout */
const styles = {
  navbarWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "60px",
    zIndex: 1000,
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  },
  sidebarWrapper: {
    position: "fixed",
    top: "60px",
    left: 0,
    width: "250px",
    height: "calc(100vh - 60px)",
    backgroundColor: "#333",
    color: "white",
    padding: "20px",
    overflowY: "auto",
    zIndex: 999,
  }
};

export default App;
