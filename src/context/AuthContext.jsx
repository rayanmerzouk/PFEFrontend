import { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser({
          userId: decoded.userId,
          email: decoded.email,
          username: decoded.username,
          type: decoded.type,
        });
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("accessToken", token);
    const decoded = jwt_decode(token);
    setUser({
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      type: decoded.type,
    });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


