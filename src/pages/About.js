import styles from "./About.module.css";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>About Our Clinic Booking System 🏥</h1>

        <p className={styles.paragraph}>
          Welcome to our Clinic Booking System — a modern platform designed to
          simplify how patients connect with doctors. We aim to provide a
          seamless experience for scheduling appointments, managing records, and
          improving healthcare accessibility.
        </p>

        <p className={styles.paragraph}>
          Our mission is to save your time and make healthcare more efficient by
          offering an easy, secure, and fast way to book appointments online.
          Whether you’re looking for a general practitioner or a specialist, you
          can find the right doctor within a few clicks.
        </p>

        <p className={styles.paragraph}>
          We continuously enhance our system based on patient and doctor
          feedback. Our goal is to ensure a smooth communication process and
          build a reliable bridge between patients and healthcare providers.
        </p>

        <div className={styles.contactSection}>
          <p>Want to get in touch with us?</p>
          <Link to="/contact" className={styles.contactLink}>
            Go to Contact Page →
          </Link>
        </div>
      </div>
    </div>
  );
}
