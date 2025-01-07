import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";
// import { confirmForgotPassword } from "../../services/auth";
import { useAuth } from "../../contexts/AuthContext";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ConfirmForgotPassowrd() {
  const { confirmForgotPassword, confirmForgotPasswordError } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    confirmation_code: "",
    password: "",
  });
  
  // const [error, setError] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     await confirmForgotPassword(formData);
  //     navigate("/login", {
  //       state: {
  //         message:
  //           "Password reset successful! Please log in with your new password.",
  //       },
  //     });
  //   } catch (err) {
  //     setError(err.response?.data?.errors || "An error occurred");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmForgotPassword(formData);
      // await confirmForgotPassword({
      //   email: userData.email,
      //   confirmation_code: confirmationCode,
      //   password: userData.password,
      // });
    } catch (err) {
      console.error("Confirmation failed:", err);

    }
  };

  const isValidConfirmationCode = (confirmCode) => {
    // check length is 6 and its all numbers
    return confirmCode.length == 6 && isOnlyNumbers(confirmCode) 
  }

  const isPasswordCorrectLength = (password) => {
    return password.length >= 9; 
  };

  const hasNoLeadingOrTrailingWhitespaces = (password) => {
    return password === password.trim() ;
  }

  const isOnlyNumbers = (s) => {
    return typeof s === 'string' && /^[0-9]+$/.test(s);
  }

  const hasAlphabetcalOrSpecialChar = (s) => {
    const regex = /[a-zA-Z]|[^a-zA-Z0-9]/;
    return typeof s === 'string' && regex.test(s);
  }

  const hasValidPasswordChars = (s) => {
    return hasAlphabetcalOrSpecialChar(s) && !isOnlyNumbers(s)
  }

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
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {confirmForgotPasswordError && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {confirmForgotPasswordError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirmation Code"
            name="confirmation_code"
            value={formData.confirmation_code}
            onChange={(e) =>
              setFormData({ ...formData, confirmation_code: e.target.value })
            }
          />
           {/* Validation Indicators For confirm code */}
           <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                {isValidConfirmationCode(formData.confirmation_code) ? (
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                ) : (
                  <CancelIcon color="error" sx={{ mr: 1 }} />
                )} Valid confirmation code 
              </Typography>
            </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {/* Validation Indicators */}
          <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                {isPasswordCorrectLength(formData.password) ? (
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                ) : (
                  <CancelIcon color="error" sx={{ mr: 1 }} />
                )} Correct password length
              </Typography>
              <Typography variant="body2">
                {hasNoLeadingOrTrailingWhitespaces(formData.password) && formData.password ? (
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                ) : (
                  <CancelIcon color="error" sx={{ mr: 1 }} />
                )} Password does not have leading or trailing whitespaces 
              </Typography>
              <Typography variant="body2">
                {hasValidPasswordChars(formData.password) ? (
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                ) : (
                  <CancelIcon color="error" sx={{ mr: 1 }} />
                )} Password contains atleast 1 alphabetical character or 1 special character and is not entirely numbers
              </Typography>
            </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isValidConfirmationCode(formData.confirmation_code) || !isPasswordCorrectLength(formData.password) || !hasNoLeadingOrTrailingWhitespaces(formData.password) || !hasValidPasswordChars(formData.password)}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
