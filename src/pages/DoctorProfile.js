import styles from "./DoctorProfile.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`https://localhost:54246/api/Users/${id}`);
        if (!response.ok) throw new Error("Failed to load doctor profile");

        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <p className={styles.loading}>Loading profile...</p>;
  if (!doctor) return <p className={styles.error}>Doctor not found.</p>;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= fullStars ? styles.starFull : styles.starEmpty}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src={doctor.image || "/images/doctors/default.jpg"}
          alt={doctor.fullName}
          className={styles.image}
        />

        <h1 className={styles.name}>{doctor.fullName}</h1>
        <p className={styles.specialty}>{doctor.speciality}</p>

        {/* Ranking */}
        <div className={styles.ratingBox}>
          {renderStars(doctor.ranking || 0)}
          <span className={styles.ratingNumber}>({doctor.ranking || 0}/5)</span>
        </div>

        {/* Bio */}
        <p className={styles.bio}>{doctor.bio || "No biography available."}</p>

        <p className={styles.city}>{doctor.city}</p>

        {/* Location */}
        <p className={styles.location}>
          Location:{" "}
          {doctor.location ? (
            <a
              href={`${doctor.location}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.locationLink}
            >
              {doctor.location}
            </a>
          ) : (
            "No location provided"
          )}
        </p>

        {/* Contact Section */}
        <div className={styles.contact}>
          <p>
            <strong>Phone:</strong> {doctor.phoneNumber || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {doctor.email || "N/A"}
          </p>
        </div>

        {/* Pricing */}
        <p className={styles.price}>
          Consultation Price:{" "}
          <span>{doctor.reservationPrice || "N/A"} EGP</span>
        </p>

        <button
          className={styles.bookBtn}
          onClick={() => navigate(`/doctors/${doctor.userId}/booking`)}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
