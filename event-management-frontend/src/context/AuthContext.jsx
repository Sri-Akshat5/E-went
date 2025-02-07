import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isGuest, setIsGuest] = useState(localStorage.getItem("guest") === "true");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Handle regular login
  const login = (newToken, guest = false) => {
    setToken(newToken);
    setIsGuest(guest);
    if (guest) {
      localStorage.setItem("guest", "true");
    } else {
      localStorage.removeItem("guest");
    }
  };

  // Handle logout (removes both user and guest sessions)
  const logout = () => {
    setToken(null);
    setIsGuest(false);
    localStorage.removeItem("token");
    localStorage.removeItem("guest");
  };

  return (
    <AuthContext.Provider value={{ token, isGuest, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
