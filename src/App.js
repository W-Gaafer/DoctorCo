import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Booking from "./pages/Booking";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProfile from "./pages/CreateProfile";
import DoctorDashboard from "./pages/DoctorDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/doctors/:id/booking" element={<Booking />} />
            <Route path="/patientdashboard" element={<PatientDashboard />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/createprofile" element={<CreateProfile />} />
            <Route path="/doctordashboard" element={<DoctorDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          </Routes>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
