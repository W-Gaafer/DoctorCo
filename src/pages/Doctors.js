import { useState, useEffect } from "react";
import styles from "./Doctors.module.css";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          "https://localhost:54246/api/Users/doctors"
        );
        if (!response.ok) throw new Error("Failed to fetch doctors.");

        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <p className={styles.loading}>Loading doctors...</p>;
  if (error) return <p className={styles.errorMsg}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Doctors</h1>

      {/* Search & Filters */}
      <div className={styles.filters}>
        <input type="text" placeholder="Search by name or specialty..." />
        <select>
          <option>All Specialties</option>
          <option>ENT</option>
          <option>Cardiology</option>
          <option>Pediatric</option>
        </select>
        <select>
          <option>All Cities</option>
          <option>Cairo</option>
          <option>Alexandria</option>
          <option>Giza</option>
        </select>
        <select>
          <option>All Ranks</option>
          <option>★</option>
          <option>★★</option>
          <option>★★★</option>
          <option>★★★★</option>
          <option>★★★★★</option>
        </select>
      </div>

      {/* Doctors List */}
      <div className={styles.doctorList}>
        {doctors.map((doc) => (
          <div key={doc.userId} className={styles.card}>
            <img
              src={doc.image || "/images/doctors/default.jpg"}
              alt={doc.fullName}
            />
            <h3>{doc.fullName}</h3>
            <p>{doc.speciality}</p>
            <span>{doc.city}</span>
            <button className={styles.bookBtn}>View Profile</button>
          </div>
        ))}
      </div>
    </div>
  );
}
