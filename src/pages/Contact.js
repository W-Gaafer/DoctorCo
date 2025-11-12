import { useState } from "react";
import styles from "./Contact.module.css";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
    // هنا ممكن تضيف لوجيك الإرسال الحقيقي (API أو Email service)
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Contact Us 📬</h1>
        <p className={styles.subtitle}>
          We’d love to hear from you! Reach out using the form below or through
          our contact info.
        </p>

        {/* Contact Information */}
        <div className={styles.infoSection}>
          <p>
            <strong>Phone:</strong> +20 100 123 4567
          </p>
          <p>
            <strong>Email:</strong> clinicbooking@example.com
          </p>
          <p>
            <strong>Address:</strong> 15 El-Tahrir St, Cairo, Egypt
          </p>

          <div className={styles.socials}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write your message..."
            ></textarea>
          </div>

          <button type="submit" className={styles.sendBtn}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
