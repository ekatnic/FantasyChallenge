// import React from "react";
// import { Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../../services/auth";
// import { useAuth } from "../../contexts/AuthContext";
// import CSRFToken from "../../services/csrftoken";

import React from "react";
import { Button } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import CSRFToken from "../../services/csrftoken";

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // thisll handle everythingm the API call, user state, navigation
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <CSRFToken />
      <Button
        color="secondary"
        variant="outlined"
        onClick={handleLogout}
        sx={{ marginLeft: "auto" }}
      >
        Logout
      </Button>
    </>
  );
}
