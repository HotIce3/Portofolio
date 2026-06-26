import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Interceptor handles token → just fetch user
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem("token", newToken);
    setUser(userData);

    return userData;
  };

  const register = async (email, password, name) => {
    const response = await api.post("/auth/register", {
      email,
      password,
      name,
    });
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem("token", newToken);
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    await api.put("/auth/password", { currentPassword, newPassword });
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updatePassword,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
