import { useState } from "react";
import styles from "./Register.module.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    role: "patient", // القيمة الافتراضية
    specialty: "",
    bio: "",
    image: "",
    reservationPrice: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,      // ✅ اتأكد إن اسم الحقل في الباك كده
        city: formData.city,
        role: formData.role,                    // "patient" أو "doctor"
        specialty: formData.specialty || null,  // لو فاضي نخليه null
        bio: formData.bio || null,
        image: formData.image || null,
        reservationPrice:
          formData.reservationPrice !== ""
            ? Number(formData.reservationPrice)
            : null,
        location: formData.location || null,
      };

      console.log("Calling API...", "https://localhost:54246/api/Auth/register");

      const response = await fetch(
        "https://localhost:54246/api/Auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Got response object:", response);


      if (!response.ok) {
        let message = "Registration failed. Please try again.";

        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            message = errorData.message;
          }
        } catch {
          // ولو مفيش body JSON نسيب الرسالة الافتراضية
        }

        throw new Error(message);
      }

      const data = await response.json();
      console.log("Registered user:", data);

      setSuccessMessage("Account created successfully 🎉");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        city: "",
        role: "patient",
        specialty: "",
        bio: "",
        image: "",
        reservationPrice: "",
        location: "",
      });
      // ممكن تعمل redirect هنا:
      // window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const isDoctor = formData.role === "doctor";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create New Account 🩺</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* رسالة نجاح */}
          {successMessage && (
            <div className={styles.successMsg}>{successMessage}</div>
          )}

          {/* رسالة خطأ */}
          {error && <div className={styles.errorMsg}>{error}</div>}

          {/* Full Name */}
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Dr. Osama Ashraf"
            />
          </div>

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
              name="phoneNumber"
              value={formData.phoneNumber}
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

          {/* 🩺 اختيار نوع المستخدم */}
          <div className={styles.formGroup}>
            <label>Account Type</label>
            <div className={styles.roleOptions}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={formData.role === "patient"}
                  onChange={handleChange}
                />
                Patient
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={formData.role === "doctor"}
                  onChange={handleChange}
                />
                Doctor
              </label>
            </div>
          </div>

          {/* حقول خاصة بالدكتور */}
          {isDoctor && (
            <>
              <div className={styles.formGroup}>
                <label>Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Cardiologist, Dentist, etc."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Short description about the doctor..."
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Profile Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Reservation Price (EGP)</label>
                <input
                  type="number"
                  name="reservationPrice"
                  value={formData.reservationPrice}
                  onChange={handleChange}
                  placeholder="300"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Clinic Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Nasr City, Cairo"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className={styles.registerBtn}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
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
