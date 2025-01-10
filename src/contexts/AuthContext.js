import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as authAPI from "../services/auth";
import {getFullValidationErrorMessage} from "../componentUtils"

// Create context
const AuthContext = createContext(null);

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkAuthError, setCheckAuthError] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [confirmSignupError, setConfirmSignupError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [forgotPasswordError, setForgotPasswordError] = useState(null);
  const [confirmForgotPasswordError, setConfirmForgotPasswordError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);
    
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
      setCheckAuthError(null);
    } catch (err) {
      setUser(null);
      setCheckAuthError("Authentication check failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await authAPI.login(credentials);
      setUser(data.user);
      setLoginError(null);
      // Redirect to starting page
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
      return data;
    } catch (err) {
      setLoginError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const data = await authAPI.signup(userData);

      // NOTE: automatically logs in user after successful signup and redirects to dashboard
      setUser(data.user);
      setSignupError(null);
      navigate("/dashboard");
      
      return data;
    } catch (err) {
      console.log("signup func err: ", err)
      // error handling to capture both message and validation errors
      const errorMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;
  
      // Flatten and format all error messages
      const fullErrorMessage = validationErrors ? Object.values(validationErrors) 
        .flat() // Flatten the arrays of error messages
        .join("\n") // Join them with a newline
        : errorMessage || "Signup failed"; 

      setSignupError(fullErrorMessage);
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
      setConfirmSignupError(null);
      navigate("/login");
      return data;
    } catch (err) {
      setConfirmSignupError(err.response?.data?.message || "Signup confirmation failed");
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
      setLogoutError(null);
      navigate("/login");
    } catch (err) {
      setLogoutError(err.response?.data?.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const data = await authAPI.forgotPassword(email);
      setForgotPasswordError(null);
      return data;
    } catch (err) {
      setForgotPasswordError(err.response?.data?.message || "Password reset request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const confirmForgotPassword = async (confirmationData) => {
    try {
      setLoading(true);
      const data = await authAPI.confirmForgotPassword(confirmationData);
      setUser(null); // NOTE: Setting user to null means the user needs to login again after signing up
      setConfirmForgotPasswordError(null);
      setLoginError(null);
      navigate("/login", {
        state: {
          message:
            "Password reset successful! Please log in with your new password.",
        },
      });
      return data;
    } catch (err) {

      const errorMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;

    // Flatten and format all error messages
      const fullErrorMessage = validationErrors ? Object.values(validationErrors) 
        .flat() // Flatten the arrays of error messages
        .join("\n") // Join them with a newline
        : errorMessage || "Forgot password confirmation failed"; 
      
      setConfirmForgotPasswordError(fullErrorMessage)

      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    checkAuthError,
    signupError,
    confirmSignupError,
    loginError,
    forgotPasswordError,
    confirmForgotPasswordError,
    logoutError,
    signup,
    confirmSignup,
    login,
    forgotPassword,
    confirmForgotPassword,
    logout,
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
