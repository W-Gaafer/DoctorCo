import { useState } from "react";
import styles from "./Register.module.css";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
    // Here you'll add the actual registration logic (API or backend)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create New Account 🩺</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="01012345678"
            />
          </div>

          <div className={styles.formGroup}>
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Cairo"
            />
          </div>

          <button type="submit" className={styles.registerBtn}>
            Register
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <a href="/login" className={styles.loginLink}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
