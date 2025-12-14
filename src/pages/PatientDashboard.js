import { useState, useEffect } from "react";
import styles from "./PatientDashboard.module.css";

export default function PatientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState({});

  // جلب بيانات الحجز من API عند تحميل الصفحة
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const patient = JSON.parse(storedUser);
        const res = await fetch(
          `https://localhost:54246/api/Appointment/user/${patient.userId}`
        );
        const data = await res.json();
        setBookings(data);

        // تهيئة المراجعات
        const initialReviews = {};
        data.forEach((b) => {
          initialReviews[b.id] = {
            rating: b.rating || 0,
            comment: b.comment || "",
            isEditing: false,
          };
        });
        setReviews(initialReviews);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  const handleRateClick = (id) => {
    setReviews((prev) => ({
      ...prev,
      [id]: { ...prev[id], isEditing: true },
    }));
  };

  const handleStarClick = (id, value) => {
    setReviews((prev) => {
      if (!prev[id]?.isEditing) return prev;
      return { ...prev, [id]: { ...prev[id], rating: value } };
    });
  };

  const handleCommentChange = (id, text) => {
    setReviews((prev) => {
      if (!prev[id]?.isEditing) return prev;
      return { ...prev, [id]: { ...prev[id], comment: text } };
    });
  };

  const handleDone = (id) => {
    setReviews((prev) => ({
      ...prev,
      [id]: { ...prev[id], isEditing: false },
    }));
    // هنا ممكن تضيف API لتحديث الـ review على السيرفر لو حابب
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      const res = await fetch(`https://localhost:54246/api/Appointment/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to cancel appointment");

      // تحديث الواجهة بعد الحذف
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel appointment");
    }
  };

  const upcoming = bookings.filter((b) => b.status === "inProgress");
  const completed = bookings.filter((b) => b.status === "completed");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Appointments</h1>

      {/* Upcoming */}
      <section>
        <h2 className={styles.sectionTitle}>Upcoming:</h2>
        <div className={styles.list}>
          {upcoming.map((b) => (
            <div key={b.id} className={styles.card}>
              <h3 className={styles.cardTitle}>
                {b.doctor?.fullName || "Unknown Doctor"}
              </h3>
              <p className={styles.cardElement}>
                {b.doctor?.speciality || "Specialty N/A"}
              </p>
              <p className={styles.cardElement}>
                <strong>Date:</strong> {b.appointment_Date} |{" "}
                <strong>Time:</strong> {b.appointment_Time}
              </p>
              <p className={styles.cardElement}>
                <strong>Price:</strong> {b.doctor?.reservationPrice || "N/A"}{" "}
                EGP
              </p>
              <button
                className={styles.cancelBtn}
                onClick={() => handleCancel(b.id)}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Completed */}
      <section>
        <h2 className={styles.sectionTitle}>Completed:</h2>
        <div className={styles.list}>
          {completed.map((b) => {
            const review = reviews[b.id] || {
              rating: 0,
              comment: "",
              isEditing: false,
            };

            return (
              <div key={b.id} className={`${styles.card} ${styles.completed}`}>
                <h3>{b.doctor?.fullName || "Unknown Doctor"}</h3>
                <p>{b.doctor?.speciality || "Specialty N/A"}</p>
                <p>
                  <strong>Date:</strong> {b.appointment_Date} |{" "}
                  <strong>Time:</strong> {b.appointment_Time}
                </p>
                <p>
                  <strong>Price:</strong> {b.doctor?.reservationPrice || "N/A"}{" "}
                  EGP
                </p>

                <div className={styles.reviewBox}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span
                        key={value}
                        className={
                          value <= review.rating
                            ? styles.starActive
                            : styles.star
                        }
                        onClick={() => handleStarClick(b.id, value)}
                        style={{
                          cursor: review.isEditing ? "pointer" : "default",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <textarea
                    className={styles.textarea}
                    value={review.comment}
                    placeholder="Write your feedback..."
                    onChange={(e) => handleCommentChange(b.id, e.target.value)}
                    readOnly={!review.isEditing}
                  />

                  {!review.isEditing ? (
                    <button
                      className={styles.rateBtn}
                      onClick={() => handleRateClick(b.id)}
                    >
                      {review.comment || review.rating > 0
                        ? "Edit Review"
                        : "Enable Review"}
                    </button>
                  ) : (
                    <button
                      className={styles.doneBtn}
                      onClick={() => handleDone(b.id)}
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
