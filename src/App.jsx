import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/signup';
import AdminPanel from "./pages/AdminPanel";
import ForgetPassword from "./pages/ForgotPassword"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminPanel onBackToLogin={() => navigate("/login")} />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />

      </Routes>
    </Router>
  );
}
