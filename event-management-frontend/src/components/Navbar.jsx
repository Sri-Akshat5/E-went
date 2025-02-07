import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { token, isGuest, logout } = useContext(AuthContext);

  return (
    <nav className="fixed top-4 left-0 right-0 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg rounded-full px-8 py-3 w-[95%] md:w-[90%] lg:w-[80%] flex justify-between items-center z-50">
      
      <Link to="/" className="text-2xl font-bold tracking-wide">
        E<span className="text-yellow-300"> Went</span> 
      
      <span className="text-sm font-normal pl-2"> Event Management application </span>
      </Link>

      <div className="flex space-x-6 items-center">
        <Link to="/" className="hover:text-yellow-300">Dashboard</Link>

        {token ? (
          isGuest ? (
            <button onClick={logout} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full">
              👤 Guest Logout
            </button>
          ) : (
            <>
              <Link to="/create-event" className="hover:text-yellow-300">Create Event</Link>
              <Link to="/admin">My Events</Link>
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
    </nav>
  );
};

export default Navbar;
