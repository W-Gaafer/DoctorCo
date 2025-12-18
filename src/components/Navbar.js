import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNotifications } from "../contexts/NotificationsContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, markAsRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

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
            <div className={styles.notifContainer}>
              <button
                className={styles.bell}
                onClick={() => setOpen((s) => !s)}
                aria-label="Notifications"
              >
                🔔
              </button>
              {notifications && notifications.filter((n) => !n.read).length > 0 && (
                <span className={styles.badge}>
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}

              {open && (
                <div className={styles.notifDropdown}>
                  <div style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
                    <strong>Notifications</strong>
                    <button
                      style={{ float: "right", background: "transparent", border: "none", cursor: "pointer", color: "#1e40af" }}
                      onClick={() => markAllRead()}
                    >
                      Mark all
                    </button>
                  </div>
                  {notifications.length === 0 && (
                    <div className={styles.notifItem}>No notifications</div>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`${styles.notifItem} ${!n.read ? styles.notifItemUnread : ""}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className={styles.notifTitle}>{n.title}</div>
                      <div>{n.message}</div>
                      <div className={styles.notifTime}>{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
