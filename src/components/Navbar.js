import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  // تحديد رابط الـ Dashboard بناءً على الدور
  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === "doctor") return "/doctordashboard";
    if (user.role === "patient") return "/patientdashboard";
    if (user.role === "admin") return "/admindashboard";
    return null;
  };

  return (
    <nav className={styles.navbar}>
      {/* الشعار على الشمال */}
      <div className={styles.logo}>
        <img src={"/images/image03.png"} alt="Logo" />
        <span>Clinic Booking</span>
      </div>

      {/* الروابط في النص */}
      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
        <Link to="/doctors">Doctors</Link>
        {user && getDashboardLink() && (
          <Link to={getDashboardLink()}>Dashboard</Link>
        )}
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      {/* زر Login/Logout على اليمين */}
      <div>
        {user ? (
          <>
            <span className={styles.userName}>Hi, {user.fullName}</span>
            <button
              onClick={logout}
              className={`${styles.loginButton} ${styles.logoutButton}`}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.loginButton}>
              Sign in
            </Link>
            <Link to="/register" className={styles.loginButton}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
