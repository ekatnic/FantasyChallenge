import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as authAPI from "../services/auth";

// Create context
const AuthContext = createContext(null);

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

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
      const from = location.state?.from?.pathname || "/dashboard";
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
      // TODO: Set null user and redirects to the confirm-signup page
      setUser(null);
      setError(null);
      // Go to confirm-signup route and pass email as state so user can just give confirmation code from email
      navigate("/confirm-signup", {
        state: { userData },
      });
      return data;
    } catch (err) {
      console.log("signup func err: ", err)
    //   // Improve error handling to capture both message and validation errors
      const errorMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;

    // Flatten and format all error messages
      const fullErrorMessage = validationErrors ? Object.values(validationErrors) 
        .flat() // Flatten the arrays of error messages
        .join("\n") // Join them with a newline
        : errorMessage || "Signup failed"; 

      // console.log("full error mes", fullErrorMessage) 
      setError(fullErrorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmSignup = async (confirmationData) => {
    try {
      setLoading(true);
      const data = await authAPI.confirmSignup(confirmationData);
      setUser(null); // NOTE: Setting user to null means the user needs to login again after signing up
      setError(null);
      navigate("/login");
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Signup confirmation failed");
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
    setError,
    login,
    signup,
    confirmSignup,
    logout,
    forgotPassword,
    isAuthenticated: !!user,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
