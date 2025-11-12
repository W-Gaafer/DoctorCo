import Navbar from "../components/Navbar";
import styles from "./AppLayout.module.css";
import { Outlet } from "react-router-dom";
function AppLayout() {
  return (
    <>
      <div className={styles.appContainer}>
        <Navbar />

        <main className={styles.main}>
          <Outlet />
        </main>

        <footer className={styles.footer}>
          &copy; 2025 Clinic Booking System
        </footer>
      </div>
    </>
  );
}

export default AppLayout;
