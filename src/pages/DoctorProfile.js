import styles from "./DoctorProfile.module.css";
import { useParams } from "react-router-dom";

// بيانات تجريبية للدكاترة
const doctors = [
  {
    id: 1,
    name: "Dr. Ahmed Hassan",
    specialty: "Cardiologist",
    city: "Cairo",
    rating: 4,
    bio: "Dr. Ahmed has over 15 years of experience in cardiology and has treated thousands of patients with heart-related issues.",
    phone: "+20 100 123 4567",
    email: "ahmed.hassan@example.com",
    image: "/images/doctors/doctor1.jpg",
  },
  {
    id: 2,
    name: "Dr. Sara Ali",
    specialty: "Dermatologist",
    city: "Alexandria",
    rating: 5,
    bio: "Dr. Sara is a leading dermatologist specializing in skin treatments, acne, and cosmetic procedures.",
    phone: "+20 102 234 5678",
    email: "sara.ali@example.com",
    image: "/images/doctors/doctor2.jpg",
  },
];

export default function DoctorProfile() {
  const { id } = useParams(); // افتراض إن المسار فيه :id
  const doctor = doctors.find((doc) => doc.id === parseInt(id));

  if (!doctor) {
    return <p>Doctor not found.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={doctor.image} alt={doctor.name} className={styles.image} />
        <h1 className={styles.name}>{doctor.name}</h1>
        <p className={styles.specialty}>{doctor.specialty}</p>
        <p className={styles.city}>{doctor.city}</p>

        {/* Rating */}
        <p className={styles.rating}>
          {Array.from({ length: doctor.rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </p>

        {/* Bio */}
        <p className={styles.bio}>{doctor.bio}</p>

        {/* Contact */}
        <div className={styles.contact}>
          <p>
            <strong>Phone:</strong> {doctor.phone}
          </p>
          <p>
            <strong>Email:</strong> {doctor.email}
          </p>
        </div>

        {/* Book Appointment */}
        <button className={styles.bookBtn}>Book Appointment</button>
      </div>
    </div>
  );
}
