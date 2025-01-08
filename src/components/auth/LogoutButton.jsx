import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import CSRFToken from "./CSRFToken";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const LogoutButton = ({
  variant = "contained",
  color = "primary",
  size = "medium",
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CSRFToken />
      <Button
        variant={variant}
        color={color}
        size={size}
        onClick={handleLogout}
        disabled={isLoading}
        startIcon={isLoading && <CircularProgress size={20} />}
      >
        {isLoading ? "Logging out..." : "Logout"}
      </Button>
    </>
  );
};

export default LogoutButton;

