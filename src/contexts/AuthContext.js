// TODO: this is still a work in progress,
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as authAPI from "../services/auth";

// Create context
const AuthContext = createContext(null);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status at start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authAPI.checkAuthStatus();
      setUser(data.user);
      setError(null);
    } catch (err) {
      setUser(null);
      setError("Authentication check failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await authAPI.login(credentials);
      setUser(data.user);
      setError(null);
      // Redirect to starting page
      const from = location.state?.from?.pathname || "/create-entry";
      navigate(from, { replace: true });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const data = await authAPI.signup(userData);
      setUser(data.user);
      setError(null);
      navigate("/dashboard");
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
      setUser(null);
      setError(null);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const data = await authAPI.forgotPassword(email);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Password reset request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    forgotPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using auth context
// export const useAuth = () => {
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
