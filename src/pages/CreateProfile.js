import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateProfile.module.css";

export default function CreateProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    city: "",
    phone: "",
    address: "",
    bio: "",
    avatar: null,
    location: "", // Hyperlink
  });

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form Data:", formData);

    // هنا ممكن تبعت البيانات للـ API
    // Example:
    // const formPayload = new FormData();
    // Object.keys(formData).forEach(key => formPayload.append(key, formData[key]));
    // axios.post('/api/doctors', formPayload);

    alert("Doctor profile submitted!");
    navigate("/admin-dashboard");
  }

  return (
    <div className={styles.container}>
      <h1>Create Doctor Profile</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Specialization:</label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />

        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label>Bio:</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="4"
          required
        />

        <label>Profile Image:</label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
        />

        <label>Location (Hyperlink):</label>
        <input
          type="url"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="https://maps.google.com/..."
        />

        <button type="submit" className={styles.submitBtn}>
          Create Profile
        </button>
      </form>
    </div>
  );
}
