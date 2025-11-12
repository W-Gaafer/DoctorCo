import { useState } from "react";
import styles from "./Booking.module.css";

// مثال بيانات مواعيد الدكتور
const doctorSchedule = {
  "2025-11-10": ["09:00", "10:00", "13:00"],
  "2025-11-11": ["11:00", "14:00"],
  "2025-11-12": [],
};

// قائمة الساعات الممكنة للحجز
const allTimes = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export default function Booking() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    description: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // احصل على المواعيد المتاحة للتاريخ المحدد
  const availableTimes = formData.date
    ? allTimes.filter((t) => !doctorSchedule[formData.date]?.includes(t))
    : [];

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Booking Data:", formData);
    alert("Appointment booked successfully!");
    setFormData({ date: "", time: "", description: "" });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Book an Appointment</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* وصف الحالة المرضية */}
          <div className={styles.formGroup}>
            <label>Describe your condition</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter a brief description of your condition..."
            ></textarea>
          </div>

          {/* اختيار اليوم */}
          <div className={styles.formGroup}>
            <label>Select Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* اختيار الساعة */}
          <div className={styles.formGroup}>
            <label>Select Time</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={!formData.date}
            >
              <option value="">-- Select Time --</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.bookBtn}>
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
