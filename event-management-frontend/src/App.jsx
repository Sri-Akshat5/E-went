import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/admin" element={<AdminDashboard />} />  
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
