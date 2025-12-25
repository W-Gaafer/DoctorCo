import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Booking.module.css";
import { useNotifications } from "../contexts/NotificationsContext";

export default function Booking() {
  const { id } = useParams();

  const [weekSchedule, setWeekSchedule] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [description, setDescription] = useState("");
  const { createNotification } = useNotifications();

  /* ================================
     جلب مواعيد العمل (Schedules)
  ================================= */
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
      }
    }
    fetchSchedule();
  }, [id]);

  /* ================================
     جلب المواعيد المحجوزة (Appointments)
  ================================= */
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch(
          `https://localhost:54246/api/Appointment/user/${id}`
        );
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [id]);

  /* ================================
     حساب المواعيد المتاحة حسب اليوم
  ================================= */
  useEffect(() => {
    if (!weekSchedule.length) return;

    const dayOfWeek = selectedDate.getDay(); // 0 Sunday
    const apiDay = dayOfWeek === 0 ? 7 : dayOfWeek;

    const scheduleForDay = weekSchedule.filter(
      (s) => s.day_Of_Week === apiDay && s.isAvailable
    );

    const scheduleTimes = scheduleForDay.map((s) => s.start_Time);

    const selectedDateStr = selectedDate
      .toLocaleDateString("en-CA")
      .split("T")[0];

    const bookedTimes = appointments
      .filter((a) => a.appointment_Date === selectedDateStr)
      .map((a) => a.appointment_Time);

    const finalSlots = scheduleTimes.map((time) => ({
      time,
      isBooked: bookedTimes.includes(time),
    }));

    setAvailableTimes(finalSlots);
    setSelectedTime(null);
  }, [selectedDate, weekSchedule, appointments]);

  /* ================================
     إرسال الحجز
  ================================= */
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
      appointment_Date: selectedDate.toLocaleDateString("en-CA").split("T")[0],
      appointment_Time: selectedTime,
      description,
      status: "inProgress",
    };
    //show selected date
    console.log(selectedDate, selectedDate.toLocaleDateString("en-CA"));
    //show booking data
    console.log(bookingData);

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

      // تحديث المواعيد المحجوزة فورياً بعد الحجز
      setAppointments([...appointments, bookingData]);

      // Create in-app notifications for patient and doctor (stored in localStorage)
      try {
        // patient notification
        createNotification({
          recipientId: patient.userId,
          title: "Appointment Confirmed",
          message: `Appointment confirmed on ${bookingData.appointment_Date} at ${bookingData.appointment_Time}`,
          data: bookingData,
        });

        // doctor notification
        createNotification({
          recipientId: id,
          title: "New Booking",
          message: `New appointment with ${patient.fullName} on ${bookingData.appointment_Date} at ${bookingData.appointment_Time}`,
          data: bookingData,
        });

        // schedule reminder 1 day before (in-app)
        const apptIso = `${bookingData.appointment_Date}T${bookingData.appointment_Time}`;
        const apptDate = new Date(apptIso);
        console.log(apptDate); // هيظهر التاريخ الصحيح
        const remindAt = apptDate.getTime() - 24 * 60 * 60 * 1000;
        console.log(remindAt, Date.now()); // يوضح الفرق بدقة
        const now = Date.now();
        const reminderForPatient = () =>
          createNotification({
            recipientId: patient.userId,
            title: "Appointment Reminder",
            message: `You have an appointment on ${bookingData.appointment_Date} at ${bookingData.appointment_Time}`,
            data: bookingData,
          });
        const reminderForDoctor = () =>
          createNotification({
            recipientId: id,
            title: "Upcoming Appointment",
            message: `You have an appointment with ${patient.fullName} on ${bookingData.appointment_Date} at ${bookingData.appointment_Time}`,
            data: bookingData,
          });

        if (remindAt <= now) {
          // If less than a day away, create immediately
          reminderForPatient();
          reminderForDoctor();
        } else {
          // schedule reminder (works while tab is open)
          setTimeout(() => {
            try {
              reminderForPatient();
              reminderForDoctor();
            } catch (e) {
              // ignore
            }
          }, remindAt - now);
        }
      } catch (err) {
        console.error("Failed to create in-app notifications:", err);
      }
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    }
  }

  if (loading) return <h3 className="text-center mt-10">Loading...</h3>;

  return (
    <div className={styles.container}>
      {/* Calendar */}
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Select a Date</h2>
        <div className={styles.calendarWrapper}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
            locale="en-US"
          />
        </div>
      </div>

      {/* Slots */}
      <div className={styles.rightPanel}>
        <h2 className={styles.title}>
          Available Slots for {selectedDate.toDateString()}
        </h2>

        <div className={styles.slotsGrid}>
          {availableTimes.length ? (
            availableTimes.map(({ time, isBooked }) => (
              <div
                key={time}
                className={`${styles.slot} 
                  ${isBooked ? styles.slotBooked : ""}
                  ${selectedTime === time ? styles.slotSelected : ""}`}
                onClick={() => {
                  if (!isBooked) setSelectedTime(time);
                }}
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
