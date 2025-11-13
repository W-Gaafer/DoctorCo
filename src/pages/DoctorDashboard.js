import styles from "./DoctorDashboard.module.css";
import { useState } from "react";

// 📅 بيانات مبدئية تشمل اليوم والتاريخ والساعة
const sampleAppointments = [
  {
    id: 1,
    date: "2025-11-09",
    day: "Sunday",
    time: "10:00 AM",
    patient: "Waleed Gaafar",
    status: "booked",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
  {
    id: 2,
    date: "2025-11-09",
    day: "Sunday",
    time: "12:00 PM",
    patient: null,
    status: "available",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
  {
    id: 3,
    date: "2025-11-09",
    day: "Sunday",
    time: "12:00 PM",
    patient: null,
    status: "available",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
  {
    id: 4,
    date: "2025-11-09",
    day: "Sunday",
    time: "12:00 PM",
    patient: null,
    status: "available",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
  {
    id: 5,
    date: "2025-11-10",
    day: "Monday",
    time: "09:30 AM",
    patient: "Sara Ali",
    status: "booked",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
  {
    id: 6,
    date: "2025-11-11",
    day: "Tuesday",
    time: "11:00 AM",
    patient: null,
    status: "available",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
  {
    id: 7,
    date: "2025-11-12",
    day: "Wednesday",
    time: "03:00 PM",
    patient: "Ahmed Hassan",
    status: "booked",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
  {
    id: 8,
    date: "2025-11-13",
    day: "Thursday",
    time: "01:00 PM",
    patient: null,
    status: "available",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
  {
    id: 9,
    date: "2025-11-14",
    day: "Friday",
    time: "10:30 AM",
    patient: null,
    status: "available",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
  {
    id: 10,
    date: "2025-11-15",
    day: "Saturday",
    time: "04:00 PM",
    patient: "Mona Youssef",
    status: "booked",
    age: 29,
    address: "Cairo, Nasr City",
    description: "Follow-up for previous check-up",
  },
];

export default function DoctorDashboard() {
  const [appointments] = useState(sampleAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal(appointment) {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  }

  function markAsComplete() {
    alert(
      `Appointment with ${selectedAppointment.patient} marked as complete ✅`
    );
    closeModal();
  }

  // 🗓️ استخراج الأيام بدون تكرار
  const days = [...new Set(appointments.map((a) => a.day))];

  // 🧠 دالة لتنسيق التاريخ بشكل أنيق
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options); // مثل: 9 Nov 2025
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Doctor Dashboard 🩺</h1>
        <p className={styles.subtitle}>Upcoming Weekly Schedule</p>

        <div className={styles.calendar}>
          {days.map((day) => (
            <div key={day} className={styles.dayRow}>
              <h3 className={styles.dayHeader}>{day}</h3>

              <div className={styles.appointmentsRow}>
                {appointments
                  .filter((a) => a.day === day)
                  .map((a) => (
                    <div
                      key={a.id}
                      className={`${styles.appointment} ${
                        a.status === "booked" ? styles.booked : styles.available
                      }`}
                      onClick={() => a.status === "booked" && openModal(a)}
                    >
                      <span className={styles.date}>
                        🗓️ {formatDate(a.date)} — <strong>{a.time}</strong>
                      </span>

                      {a.status === "booked" ? (
                        <span className={styles.patient}>👤 {a.patient}</span>
                      ) : (
                        <span className={styles.free}>Available</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedAppointment && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // عشان ما يقفلش عند الضغط داخل المودال
          >
            <h2 className={styles.modalTitle}>Patient Details</h2>
            <p>
              <strong>Name:</strong> {selectedAppointment.patient}
            </p>
            <p>
              <strong>Age:</strong> {selectedAppointment.age}
            </p>
            <p>
              <strong>Address:</strong> {selectedAppointment.address}
            </p>
            <p>
              <strong>Description:</strong> {selectedAppointment.description}
            </p>

            <button onClick={markAsComplete} className={styles.completeBtn}>
              Mark as Complete ✅
            </button>

            <button onClick={closeModal} className={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
