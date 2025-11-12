import { useState } from "react";
import styles from "./PatientDashboard.module.css";

const bookings = [
  {
    id: 1,
    doctor: "Dr. Ahmed Hassan",
    specialty: "Cardiology",
    date: "2025-11-20",
    time: "10:30 AM",
    price: "300 EGP",
    status: "upcoming",
  },
  {
    id: 2,
    doctor: "Dr. Sara Ali",
    specialty: "Dermatology",
    date: "2025-10-28",
    time: "03:00 PM",
    price: "250 EGP",
    status: "completed",
  },
  {
    id: 3,
    doctor: "Dr. Omar Khaled",
    specialty: "Dentistry",
    date: "2025-11-12",
    time: "01:00 PM",
    price: "400 EGP",
    status: "completed",
  },
];

export default function PatientDashboard() {
  const [reviews, setReviews] = useState({
    2: { rating: 4, comment: "Very kind and professional!", isEditing: false },
    3: { rating: 0, comment: "", isEditing: false },
  });

  const handleRateClick = (id) => {
    setReviews((prev) => ({
      ...prev,
      [id]: { ...prev[id], isEditing: true },
    }));
  };

  const handleStarClick = (id, value) => {
    setReviews((prev) => {
      if (!prev[id]?.isEditing) return prev; // ممنوع تعديل النجوم إلا في وضع التحرير
      return { ...prev, [id]: { ...prev[id], rating: value } };
    });
  };

  const handleCommentChange = (id, text) => {
    setReviews((prev) => {
      if (!prev[id]?.isEditing) return prev; // ممنوع كتابة إلا لو في وضع التحرير
      return { ...prev, [id]: { ...prev[id], comment: text } };
    });
  };

  const handleDone = (id) => {
    setReviews((prev) => ({
      ...prev,
      [id]: { ...prev[id], isEditing: false },
    }));
  };

  const upcoming = bookings.filter((b) => b.status === "upcoming");
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
              <h3>{b.doctor}</h3>
              <p>{b.specialty}</p>
              <p>
                <strong>Date:</strong> {b.date} | <strong>Time:</strong>{" "}
                {b.time}
              </p>
              <p>
                <strong>Price:</strong> {b.price}
              </p>
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
                <h3>{b.doctor}</h3>
                <p>{b.specialty}</p>
                <p>
                  <strong>Date:</strong> {b.date} | <strong>Time:</strong>{" "}
                  {b.time}
                </p>
                <p>
                  <strong>Price:</strong> {b.price}
                </p>

                <div className={styles.reviewBox}>
                  {/* النجوم */}
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

                  {/* التعليق */}
                  <textarea
                    className={styles.textarea}
                    value={review.comment}
                    placeholder="Write your feedback..."
                    onChange={(e) => handleCommentChange(b.id, e.target.value)}
                    readOnly={!review.isEditing}
                  />

                  {/* الأزرار */}
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
