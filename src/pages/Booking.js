import { useState } from "react";
import styles from "./Booking.module.css";

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [description, setDescription] = useState("");

  // ثابت لحين ربط الـ API
  const weekSchedule = {
    "Monday": {
      date: "2025-11-10",
      all: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      booked: ["10:00", "13:00"],
    },
    "Tuesday": {
      date: "2025-11-11",
      all: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      booked: ["11:00"],
    },
    "Wednesday": {
      date: "2025-11-12",
      all: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      booked: [],
    },
    "Thursday": {
      date: "2025-11-13",
      all: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      booked: ["09:00", "14:00"],
    },
    "Friday": {
      date: "2025-11-14",
      all: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      booked: [],
    },
  };

  function handleSelect(day, time) {
    setSelectedDate(weekSchedule[day].date);
    setSelectedTime(time);
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Appointment booked for ${selectedDate} at ${selectedTime}`);
    setSelectedTime(null);
    setSelectedDate(null);
    setDescription("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Book an Appointment</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Describe your condition</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter a brief description..."
            />
          </div>

{/* Weekly Calendar */}
<div className={styles.weeklyWrapper}>
  {Object.entries(weekSchedule).map(([day, data]) => (
    <div key={day} className={styles.weekColumn}>
      <div className={styles.dayTitle}>{day}</div>

      <div className={styles.timeSlots}>
        {data.all.map((time) => {
          const isBooked = data.booked.includes(time);
          const isSelected =
            selectedTime === time && selectedDate === data.date;

          return (
            <div
              key={time}
              className={
                isBooked
                  ? styles.slotDisabled
                  : isSelected
                  ? styles.slotSelected
                  : styles.slot
              }
              onClick={() => !isBooked && handleSelect(day, time)}
            >
              {time}
            </div>
          );
        })}
      </div>
    </div>
  ))}
</div>


          <button
            type="submit"
            className={styles.bookBtn}
            disabled={!selectedTime || !selectedDate}
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
