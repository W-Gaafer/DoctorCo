import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Booking.module.css";

export default function Booking() {
  const { id } = useParams();
  const [weekSchedule, setWeekSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [description, setDescription] = useState("");

  // جلب جميع مواعيد الدكتور
  useEffect(() => {
    async function fetchSchedule() {
      try {
        const res = await fetch(
          `https://localhost:54246/api/Schedule/user/${id}`
        );
        const data = await res.json();
        setWeekSchedule(data);
      } catch (err) {
        console.error("Failed to load schedule:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, [id]);

  // تحديث المواعيد المتاحة عند تغيير التاريخ
  useEffect(() => {
    if (!weekSchedule.length) return;
    const dayOfWeek = selectedDate.getDay(); // 0=Sunday, 6=Saturday
    const scheduleForDay = weekSchedule.filter(
      (s) => s.day_Of_Week === (dayOfWeek === 0 ? 7 : dayOfWeek)
    );
    const times = scheduleForDay
      .filter((s) => s.isAvailable)
      .map((s) => s.start_Time);
    setAvailableTimes(times);
    setSelectedTime(null);
  }, [selectedDate, weekSchedule]);

  async function handleSubmit(e) {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("User not logged in");
      return;
    }
    const patient = JSON.parse(storedUser);

    const bookingData = {
      doctorId: id,
      patientId: patient.userId,
      appointment_Date: selectedDate.toISOString().split("T")[0],
      appointment_Time: selectedTime,
      description,
      status: "inProgress",
    };

    try {
      const response = await fetch("https://localhost:54246/api/Appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) throw new Error("Booking failed");
      alert("Appointment booked successfully!");
      setSelectedTime(null);
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    }
  }

  if (loading) return <h3 className="text-center mt-10">Loading...</h3>;

  return (
    <div className={styles.container}>
      {/* Calendar على الشمال */}
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Select a Date</h2>
        <div className={styles.calendarWrapper}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
          />
        </div>
      </div>

      {/* المواعيد وTextarea على اليمين */}
      <div className={styles.rightPanel}>
        <h2 className={styles.title}>
          Available Slots for {selectedDate.toDateString()}
        </h2>
        <div className={styles.slotsGrid}>
          {availableTimes.length ? (
            availableTimes.map((time) => (
              <div
                key={time}
                className={`${styles.slot} ${
                  selectedTime === time ? styles.slotSelected : ""
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </div>
            ))
          ) : (
            <p>No available slots.</p>
          )}
        </div>

        <textarea
          className={styles.textarea}
          rows={4}
          placeholder="Describe your condition..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={!selectedTime}
          className={styles.bookBtn}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
