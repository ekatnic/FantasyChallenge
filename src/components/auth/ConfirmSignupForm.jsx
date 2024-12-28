import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

export default function ConfirmSignupForm() {
  const { confirmSignup, error } = useAuth();
  const [confirmationCode, setConfirmationCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;

  // Redirect if no userData
  if (!userData) {
    navigate("/signup");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmSignup({
        email: userData.email,
        confirmation_code: confirmationCode,
        first_name: userData.first_name,
        last_name: userData.last_name,
        password1: userData.password1,
        password2: userData.password2,
      });
    } catch (err) {
      console.error("Confirmation failed:", err);
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
            Confirm Your Email
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" align="center" sx={{ mb: 3 }}>
            Please enter the confirmation code sent to your email address.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmationCode"
              label="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Verify Account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
