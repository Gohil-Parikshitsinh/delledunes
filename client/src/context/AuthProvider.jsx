import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext.js";
import { loginUser, logoutUser, registerUser, getMe } from "../api/auth.js";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const register = async ({ name, email, password }) => {
    const data = await registerUser({ name, email, password });
    setUser(data.user);
    navigate("/");
    return data;
  };

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });
    setUser(data.user);
    if (data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // clear client state regardless
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, isAdmin, login, logout, register }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;