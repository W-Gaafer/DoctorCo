//////////////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    clinics: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    async function loadSpecialitiesCount() {
      try {
        const response = await fetch(
          "https://localhost:54246/api/Users/doctors"
        );
        const doctors = await response.json();

        if (!Array.isArray(doctors)) {
          console.error("Doctors API did not return an array");
          return;
        }

        const specialitiesSet = new Set();

        doctors.forEach((doc) => {
          if (doc.speciality) {
            specialitiesSet.add(doc.speciality);
          }
        });

        setStats((prev) => ({
          ...prev,
          doctors: doctors.length,
          clinics: specialitiesSet.size,
        }));
      } catch (error) {
        console.error("Error loading doctors specialities", error);
      }
    }
    loadSpecialitiesCount();
    ///////////////////////////////////////////////////////////////////////
    async function loadPatientsCount() {
      try {
        const response = await fetch("https://localhost:54246/api/Users");
        const users = await response.json();

        if (!Array.isArray(users)) {
          console.error("Users API did not return an array");
          return;
        }

        const patientsCount = users.filter(
          (user) => user.role === "patient"
        ).length;

        setStats((prev) => ({
          ...prev,
          patients: patientsCount,
        }));
      } catch (error) {
        console.error("Error loading doctors specialities", error);
      }
    }
    loadPatientsCount();
    /////////////////////////////////////////////////////////////////////
    async function loadAppointmentsCount() {
      try {
        const response = await fetch("https://localhost:54246/api/Appointment");
        const appointments = await response.json();

        if (!Array.isArray(appointments)) {
          console.error("Users API did not return an array");
          return;
        }

        setStats((prev) => ({
          ...prev,
          appointments: appointments.length,
        }));
      } catch (error) {
        console.error("Error loading appointments", error);
      }
    }
    loadAppointmentsCount();

    /* ===============================
       Mock data (unchanged)
       =============================== */
    const mockBookings = [
      {
        id: 1,
        patientName: "John Doe",
        doctorName: "Dr. Sarah Smith",
        clinicName: "Smile Dental Clinic",
        date: "2025-11-11T14:30:00",
        status: "Completed",
      },
      {
        id: 2,
        patientName: "Emily Carter",
        doctorName: "Dr. Michael Brown",
        clinicName: "Eye Vision Center",
        date: "2025-11-11T16:00:00",
        status: "Pending",
      },
      {
        id: 3,
        patientName: "Ahmed Hassan",
        doctorName: "Dr. Sarah Smith",
        clinicName: "Smile Dental Clinic",
        date: "2025-11-11T09:00:00",
        status: "Completed",
      },
    ];
    setRecentBookings(mockBookings);

    const mockTopDoctors = [
      {
        id: 1,
        name: "Dr. Sarah Smith",
        specialization: "Dentist",
        city: "Cairo",
        bookings: 56,
      },
      {
        id: 2,
        name: "Dr. Michael Brown",
        specialization: "Ophthalmologist",
        city: "Alexandria",
        bookings: 49,
      },
      {
        id: 3,
        name: "Dr. David Johnson",
        specialization: "Cardiologist",
        city: "Giza",
        bookings: 45,
      },
      {
        id: 4,
        name: "Dr. Emily Wilson",
        specialization: "Dermatologist",
        city: "Mansoura",
        bookings: 40,
      },
      {
        id: 5,
        name: "Dr. Ahmed Ali",
        specialization: "ENT",
        city: "Tanta",
        bookings: 39,
      },
      {
        id: 6,
        name: "Dr. Olivia White",
        specialization: "Pediatrician",
        city: "Zagazig",
        bookings: 37,
      },
      {
        id: 7,
        name: "Dr. John Carter",
        specialization: "Orthopedic",
        city: "Assiut",
        bookings: 34,
      },
      {
        id: 8,
        name: "Dr. Fatima Noor",
        specialization: "Gynecologist",
        city: "Cairo",
        bookings: 30,
      },
      {
        id: 9,
        name: "Dr. Adam Lee",
        specialization: "Neurologist",
        city: "Alexandria",
        bookings: 28,
      },
      {
        id: 10,
        name: "Dr. Mona Saleh",
        specialization: "Psychiatrist",
        city: "Giza",
        bookings: 25,
      },
    ];
    setTopDoctors(mockTopDoctors);
  }, []);

  function handleDelete(id) {
    setRecentBookings((prev) => prev.filter((b) => b.id !== id));
  }

  function handleEdit(id) {
    const booking = recentBookings.find((b) => b.id === id);
    if (!booking) return;

    const [datePart, timePart] = booking.date.split("T");
    setNewDate(datePart);
    setNewTime(timePart.slice(0, 5));
    setEditingBooking(booking);
  }

  function handleSave() {
    if (!editingBooking) return;

    const updatedDateTime = `${newDate}T${newTime}`;
    setRecentBookings((prev) =>
      prev.map((b) =>
        b.id === editingBooking.id ? { ...b, date: updatedDateTime } : b
      )
    );
    setEditingBooking(null);
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      <div className={styles.controlActions}>
        <h2 className={styles.sectionTitle}>Control Actions</h2>
        <div className={styles.actions}>
          <button
            className={styles.createDoctorBtn}
            onClick={() => navigate("/createprofile")}
          >
            + Button !
          </button>
        </div>
      </div>

      <div className={styles.statistics}>
        <h2 className={styles.sectionTitle}>Statistics</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Clinics</h3>
            <p>{stats.clinics}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Doctors</h3>
            <p>{stats.doctors}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Patients</h3>
            <p>{stats.patients}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Bookings</h3>
            <p>{stats.appointments}</p>
          </div>
        </div>
      </div>

      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Recent Bookings (Last 24 Hours)</h2>
        {recentBookings.length === 0 ? (
          <p className={styles.empty}>No bookings in the last 24 hours.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Clinic</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => {
                const isCompleted = b.status === "Completed";
                return (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.patientName}</td>
                    <td>{b.doctorName}</td>
                    <td>{b.clinicName}</td>
                    <td>{new Date(b.date).toLocaleString()}</td>
                    <td>{b.status}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(b.id)}
                        className={`${styles.btn} ${styles.edit} ${
                          isCompleted ? styles.disabledBtn : ""
                        }`}
                        disabled={isCompleted}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className={`${styles.btn} ${styles.delete} ${
                          isCompleted ? styles.disabledBtn : ""
                        }`}
                        disabled={isCompleted}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Top 10 Doctors */}
      <div className={styles.topDoctors}>
        <h2 className={styles.sectionTitle}>Top 10 Doctors (Last 3 Months)</h2>
        {topDoctors.length === 0 ? (
          <p className={styles.empty}>No data available.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>City</th>
                <th>Total Bookings</th>
              </tr>
            </thead>
            <tbody>
              {topDoctors.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.name}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.city}</td>
                  <td>{doc.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for editing booking */}
      {editingBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit Booking #{editingBooking.id}</h3>

            <label>Date:</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className={styles.input}
            />

            <label>Time:</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className={styles.input}
            />

            <div className={styles.modalActions}>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditingBooking(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
