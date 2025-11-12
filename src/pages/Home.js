import styles from "./Home.module.css";

const images = [
  "/images/image01.jpg",
  "/images/image02.jpg",
  "/images/image01.jpg",
];
const sections = [
  {
    title: "Search for the Best Doctors",
    text: "Finding the right doctor has never been easier. You can search for doctors directly by their name if someone recommends them to you, or you can filter your search by location, medical specialty, or patient ratings. Our platform provides detailed doctor profiles including qualifications, experience, and reviews from other patients, allowing you to make an informed decision and choose the doctor that best suits your healthcare needs.",
  },
  {
    title: "Easily Book Your Appointment",
    text: "Booking an appointment is quick and convenient. Simply fill out your personal information, describe your symptoms or concerns, and select a preferred date and time for your visit. Once submitted, the doctor receives a notification instantly and confirms your appointment. You can track all your upcoming appointments in your dashboard, receive reminders, and make any necessary adjustments without hassle, ensuring a smooth and stress-free experience.",
  },
  {
    title: "Track Your Health Progress",
    text: "After your consultation, you can access detailed information about your diagnosis, prescribed treatments, and follow-up schedules. Our system allows you to keep all your medical records organized and accessible in one place. You will be notified about any follow-up appointments and can review previous consultations to monitor your progress over time. This feature ensures continuity of care and helps you manage your health effectively, providing peace of mind and better outcomes.",
  },
];

export default function Home() {
  return (
    <div>
      {sections.map((section, index) => (
        <div key={index} className={styles.section}>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${images[index]})` }}
          ></div>
          <div className={styles.content}>
            <h2 className={styles.title}>{section.title}</h2>
            <p className={styles.text}>{section.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
