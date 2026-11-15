
import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status when the application starts
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/auth/profile");
        setUser(response.data.user);
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register new user
  const register = async (name, email, password) => {
    const response = await API.post("/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  // Login existing user
  const login = async (email, password) => {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);
  setUser(response.data.user);

  return response.data.user;
};

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication
export const useAuth = () => {
  return useContext(AuthContext);
};
