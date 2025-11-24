import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Provider Component
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // يشيل بيانات المستخدم
  const [token, setToken] = useState(null); // يشيل الـ JWT

  // لما التطبيق يفتح، نقرأ بيانات المستخدم من LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // تسجيل الدخول
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    // توجيه حسب الدور
    if (userData.role === "doctor") {
      navigate("/doctordashboard");
    } else if (userData.role === "admin") {
      navigate("/admindashboard");
    } else {
      navigate("/patientdashboard");
    }
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook لاستخدام الـ context بسهولة
export function useAuth() {
  return useContext(AuthContext);
}
