import { useState, useEffect } from "react";
import styles from "./Booking.module.css";
import { useParams } from "react-router-dom";

export default function Booking() {
  const { id } = useParams();
  const [weekSchedule, setWeekSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [description, setDescription] = useState("");

  // تحويل رقم اليوم (1=Saturday,..5=Thursday) إلى اسم اليوم
  const dayNames = {
    1: "Saturday",
    2: "Sunday",
    3: "Monday",
    4: "Tuesday",
    5: "Wednesday",
    6: "Thursday",
  };

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const res = await fetch(
          `https://localhost:54246/api/Schedule/user/${id}`
        );
        const data = await res.json();

        // نجمّع المواعيد حسب اليوم
        const grouped = {};
        data.forEach((item) => {
          const dayName = dayNames[item.day_Of_Week];
          if (!grouped[dayName])
            grouped[dayName] = { date: dayName, all: [], booked: [] };
          grouped[dayName].all.push(item.start_Time);
          if (!item.isAvailable) grouped[dayName].booked.push(item.start_Time);
        });

        setWeekSchedule(grouped);
      } catch (err) {
        console.error("Failed to load schedule:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [id]);

  function handleSelect(day, time) {
    setSelectedDate(day);
    setSelectedTime(time);
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Appointment booked for ${selectedDate} at ${selectedTime}`);
    setSelectedTime(null);
    setSelectedDate(null);
    setDescription("");
  }

  if (loading) return <h3 className={styles.loading}>Loading...</h3>;
  if (!Object.keys(weekSchedule).length)
    return <h3 className={styles.error}>No schedule found.</h3>;

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
                      selectedTime === time && selectedDate === day;

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
