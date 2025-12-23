import styles from "./DoctorDashboard.module.css";
import { useState, useEffect } from "react";

// Fetch real appointments from API for the logged-in doctor

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    // Use OPTIONS to check allowed methods and pick one to avoid 405 responses.
    async function complete() {
      const token = localStorage.getItem("token");
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = { status: "completed" };

      const readErr = async (res) => {
        try {
          return await res.text();
        } catch (e) {
          return "";
        }
      };

      const resourceUrl = `https://localhost:54246/api/Appointment/${selectedAppointment.id}`;
      const statusUrl = resourceUrl + "/status";

      try {
        // 0) Ask the server which methods are allowed (may return Allow header)
        let allowMethods = null;
        try {
          const opt = await fetch(resourceUrl, { method: "OPTIONS", headers: { ...authHeader } });
          if (opt && opt.headers) {
            allowMethods = opt.headers.get("allow") || opt.headers.get("Allow") || null;
          }
        } catch (e) {
          // ignore OPTIONS failure — we'll still try best-effort methods
          console.warn("OPTIONS request failed or blocked by CORS", e);
        }

        const allowed = allowMethods ? allowMethods.toLowerCase() : "";
            // The controller accepts specific status values (see backend). Use "completed" here.
            if (allowed.includes("patch") || allowed === "") {
              const desired = "completed";
              const resPatch = await fetch(statusUrl, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify(desired),
              });

              if (resPatch.ok) {
                setAppointments((prev) => prev.map((a) => (a.id === selectedAppointment.id ? { ...a, status: desired } : a)));
                closeModal();
                return;
              }

              const body = await readErr(resPatch);
              throw new Error(`Failed to PATCH ${statusUrl} (${resPatch.status}) ${body}`);
            }

            throw new Error(allowMethods ? `Server does not allow PATCH. Allow: ${allowMethods}` : "Failed to update appointment (no allowed methods)");
      } catch (err) {
        console.error(err);
        alert("Could not mark appointment complete — " + (err.message || "unknown error"));
      }
    }

    complete();
  }

  // 🗓️ استخراج الأيام بدون تكرار — نحسب اليوم من حقل التاريخ إن وجد
  const getDateObj = (a) => {
    const dateStr = a.appointment_Date || a.date || a.appointmentDate;
    return dateStr ? new Date(dateStr) : null;
  };

  const getDayName = (a) => {
    const d = getDateObj(a);
    return d ? d.toLocaleDateString("en-GB", { weekday: "long" }) : "Unknown";
  };

  const days = [...new Set(appointments.map((a) => getDayName(a)))];

  // 🧠 دالة لتنسيق التاريخ بشكل أنيق
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr || "-";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options); // مثل: 9 Nov 2025
  }

  // جلب المواعيد عند تحميل الصفحة (مع Authorization لو متوفر)
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const user = JSON.parse(stored);
        const token = localStorage.getItem("token");
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        const res = await fetch(
          `https://localhost:54246/api/Appointment/user/${user.userId}`,
          { headers }
        );
        if (!res.ok) throw new Error(`Failed to load appointments (${res.status})`);
        const data = await res.json();
        setAppointments(data || []);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError(err.message || "Error fetching appointments");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Doctor Dashboard 🩺</h1>
        <p className={styles.subtitle}>Upcoming Weekly Schedule</p>

        <div className={styles.calendar}>
          {loading ? (
            <p>Loading appointments...</p>
          ) : error ? (
            <p className={styles.error}>Error: {error}</p>
          ) : (
            days.map((day) => (
              <div key={day} className={styles.dayRow}>
                <h3 className={styles.dayHeader}>{day}</h3>

                <div className={styles.appointmentsRow}>
                  {appointments
                    .filter((a) => getDayName(a) === day)
                    .map((a) => {
                      const dateStr = a.appointment_Date || a.date || a.appointmentDate;
                      const time = a.appointment_Time || a.time || "-";
                      const patientName =
                        a.patient?.fullName || a.patientFullName || a.patient || a.patientName || "Unknown";

                      return (
                        <div
                          key={a.id}
                          className={`${styles.appointment} ${
                            a.status === "inProgress" || a.status === "booked"
                              ? styles.booked
                              : styles.available
                          }`}
                          onClick={() => (a.status === "inProgress" || a.status === "booked") && openModal(a)}
                        >
                          <span className={styles.date}>
                            🗓️ {formatDate(dateStr)} — <strong>{time}</strong>
                          </span>

                          {a.status === "inProgress" || a.status === "booked" ? (
                            <span className={styles.patient}>👤 {patientName}</span>
                          ) : (
                            <span className={styles.free}>Completed Appointment</span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && selectedAppointment && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // عشان ما يقفلش عند الضغط داخل المودال
          >
            <h2 className={styles.modalTitle}>Patient Details</h2>
            {(() => {
              const a = selectedAppointment;
              const patientName =
                a.patient?.fullName || a.patientFullName || a.patient || a.patientName || "Unknown";
              const age = a.patient?.age || a.age || a.patientAge || "-";
              const address = a.patient?.address || a.address || a.patientAddress || "-";
              const desc = a.description || a.note || "-";
              const dateStr = a.appointment_Date || a.date || a.appointmentDate || "-";
              const time = a.appointment_Time || a.time || "-";

              return (
                <>
                  <p>
                    <strong>Name:</strong> {patientName}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(dateStr)} | <strong>Time:</strong> {time}
                  </p>
                  <p>
                    <strong>Age:</strong> {age}
                  </p>
                  <p>
                    <strong>Address:</strong> {address}
                  </p>
                  <p>
                    <strong>Description:</strong> {desc}
                  </p>
                </>
              );
            })()}

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
