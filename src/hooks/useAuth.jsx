// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const userData = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
        setUser(userData);
      } catch (error) {
        console.error("Token invalide");
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    }
    setLoading(false);
  }, [navigate]);

  return { user, loading };
};
