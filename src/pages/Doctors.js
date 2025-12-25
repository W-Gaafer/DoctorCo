import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Doctors.module.css";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedRank, setSelectedRank] = useState("All");

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
        setDoctors(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const uniqueSpecialities = useMemo(() => {
    const specs = doctors
      .map((d) => d.speciality)
      .filter((s) => s && s.trim() !== "");
    return Array.from(new Set(specs)).sort();
  }, [doctors]);

  const uniqueCities = useMemo(() => {
    const cities = doctors
      .map((d) => d.city)
      .filter((c) => c && c.trim() !== "");
    return Array.from(new Set(cities)).sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const docName = (doc.fullName || "").toLowerCase();
      const docSpec = (doc.speciality || "").toLowerCase();
      const docCity = (doc.city || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        term === "" || docName.includes(term) || docSpec.includes(term);

      const matchesSpeciality =
        selectedSpeciality === "All" || doc.speciality === selectedSpeciality;

      const matchesCity = selectedCity === "All" || doc.city === selectedCity;

      const matchesRank = selectedRank === "All";

      return matchesSearch && matchesSpeciality && matchesCity && matchesRank;
    });
  }, [doctors, searchTerm, selectedSpeciality, selectedCity, selectedRank]);

  if (loading) return <p className={styles.loading}>Loading doctors...</p>;
  if (error) return <p className={styles.errorMsg}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Doctors</h1>

      {/* Search & Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or speciality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={selectedSpeciality}
          onChange={(e) => setSelectedSpeciality(e.target.value)}
          className={styles.select}
        >
          <option value="All">All Specialities</option>
          {uniqueSpecialities.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className={styles.select}
        >
          <option value="All">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={selectedRank}
          onChange={(e) => setSelectedRank(e.target.value)}
          className={styles.select}
        >
          <option value="All">All Ranks</option>
          <option value="1">★</option>
          <option value="2">★★</option>
          <option value="3">★★★</option>
          <option value="4">★★★★</option>
          <option value="5">★★★★★</option>
        </select>
      </div>

      {/* Doctors List */}
      <div className={styles.doctorList}>
        {filteredDoctors.length === 0 ? (
          <p className={styles.noResults}>No doctors found for your filters.</p>
        ) : (
          filteredDoctors.map((doc) => (
            <div key={doc.userId} className={styles.card}>
              <img
                src={doc.image || "/images/doctors/default.jpg"}
                alt={doc.fullName}
              />
              <h3>{doc.fullName}</h3>
              <p className={styles.spec}>{doc.speciality}</p>
              <span className={styles.city}>{doc.city}</span>
              <button
                className={styles.bookBtn}
                onClick={() => navigate(`/doctors/${doc.userId}`)}
              >
                View Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
