import axios from "axios";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
} from "@mui/material";

// Configure axios to work with Django CSRF token
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default function Signup() {
  const { signup, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate that password1 and confirm password1 match
    if (formData.password1 !== formData.password2) {
      setFormError("Passwords don't match!");
      return;
    }
  
    try {
      // call the signup function w/ user form data
      await signup({
        username: formData.email,
        email: formData.email,
        password1: formData.password1,
        password2: formData.password2,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
    } catch (err) {
      console.error("Signup failed:", err);
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      const errors = err.response?.data?.errors || {};
      const detailedErrorMessage = Object.values(errors).flat().join(' ') || errorMessage;
      setFormError(detailedErrorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {/* First Name Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="first_name"
              label="First Name"
              autoComplete="given-name"
              autoFocus
              value={formData.first_name}
              onChange={handleChange}
            />

            {/* Last Name Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="last_name"
              label="Last Name"
              autoComplete="family-name"
              value={formData.last_name}
              onChange={handleChange}
            />

            {/* Email Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password1"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={formData.password1}
              onChange={handleChange}
            />

            {/* Confirm Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              value={formData.password2}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            {/* Link to login page */}
            <Box sx={{ textAlign: "center" }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Log in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}