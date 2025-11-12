import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
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
        <Link to="/patientdashboard">Patient Dashboard</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      {/* زر Login على اليمين */}
      <div>
        <Link to="/login" className={styles.loginButton}>
          Sign in
        </Link>
        <Link to="/register" className={styles.loginButton}>
          Register
        </Link>
      </div>
    </nav>
  );
}
