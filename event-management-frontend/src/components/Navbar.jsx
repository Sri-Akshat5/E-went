import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; 
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { token, isGuest, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-0 right-0 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg rounded-full px-6 py-3 w-[95%] md:w-[90%] lg:w-[80%] flex justify-between items-center z-50">
      
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        E<span className="text-yellow-300">Went</span> 
        <span className="text-sm font-normal pl-2 hidden md:inline">Event Management</span>
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white text-2xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/" className="hover:text-yellow-300">Dashboard</Link>

        {token ? (
          isGuest ? (
            <button onClick={logout} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full">
              👤 Guest Logout
            </button>
          ) : (
            <>
              <Link to="/create-event" className="hover:text-yellow-300">Create Event</Link>
              <Link to="/admin" className="hover:text-yellow-300">My Events</Link>
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full">
                Logout
              </button>
            </>
          )
        ) : (
          <>
            <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full">Login</Link>
            <Link to="/register" className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-full">Register</Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 w-[90%] rounded-lg shadow-lg p-5 flex flex-col space-y-4 md:hidden">
          <Link to="/" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>

          {token ? (
            isGuest ? (
              <button onClick={logout} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full">
                👤 Guest Logout
              </button>
            ) : (
              <>
                <Link to="/create-event" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Create Event</Link>
                <Link to="/admin" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>My Events</Link>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full">
                  Logout
                </button>
              </>
            )
          ) : (
            <>
              <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-center" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-full text-center" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
