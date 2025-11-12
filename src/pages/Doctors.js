import styles from "./Doctors.module.css";

const doctors = [
  {
    id: 1,
    name: "Dr. Ahmed Hassan",
    specialty: "Cardiologist",
    city: "Cairo",
    image: "/images/doctors/doctor1.jpg",
  },
  {
    id: 2,
    name: "Dr. Sara Ali",
    specialty: "Dermatologist",
    city: "Alexandria",
    image: "/images/doctors/doctor2.jpg",
  },
  {
    id: 3,
    name: "Dr. Omar Khaled",
    specialty: "Dentist",
    city: "Giza",
    image: "/images/doctors/doctor3.jpg",
  },
];

export default function Doctors() {
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
          <div key={doc.id} className={styles.card}>
            <img src={doc.image} alt={doc.name} />
            <h3>{doc.name}</h3>
            <p>{doc.specialty}</p>
            <span>{doc.city}</span>
            <button className={styles.bookBtn}>View Profile</button>
          </div>
        ))}
      </div>
    </div>
  );
}
