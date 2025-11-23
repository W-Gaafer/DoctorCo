import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link بدل <a> للروابط الداخلية
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://localhost:54246/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let message = "Login failed. Please check your credentials.";
        try {
          const errData = await response.json();
          if (errData && errData.error) message = errData.error; // API يرسل الخطأ تحت "error"
        } catch {}
        throw new Error(message);
      }

      const data = await response.json();
      console.log("Logged in user:", data);

      // 🔑 حفظ التوكن
      localStorage.setItem("userToken", data.token);

      // استدعاء بيانات المستخدم من التوكن لو الباك مش رجع user object
      // لو رجع user object، ممكن تخزن مباشرة:
      // localStorage.setItem("userData", JSON.stringify(data.user));

      // 🔄 توجيه حسب الدور
      // هنا لازم نعمل fetch لبيانات المستخدم من الباك إذا محتاجين الدور
      // لنفترض إن API بيرجع الـ role مباشرة
      const tokenParts = data.token.split(".");
      if (tokenParts.length !== 3) throw new Error("Invalid token received");

      const payload = JSON.parse(atob(tokenParts[1])); // decode base64
      const role =
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || payload["role"];

      if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in 🔑</h1>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles.signupText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.signupLink}>
            Create new account
          </Link>
        </p>
      </div>
    </div>
  );
}
