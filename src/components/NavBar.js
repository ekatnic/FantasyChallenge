import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "./auth/LogoutButton";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const NavBar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const publicNavItems = [
    { path: "/", label: "Home" },
    { path: "/rules", label: "Rules" },
  ];

  const privateNavItems = [
    { path: `${BASE_URL}/user_home/`, label: "Home" },
    { path: `${BASE_URL}/players/`, label: "Standings" },
    { path: `${BASE_URL}/standings/`, label: "Players" },
    { path: "/create-entry", label: "Create Entry" },
    { path: "/rules", label: "Rules" },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            color: "white",
            textDecoration: "none",
          }}
        >
          Fantasy Football Challenge 2025
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {isAuthenticated ? (
            <>
              {privateNavItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  /* Temporary, change to the following once other pages are done:
                      component={RouterLink}
                      to={item.path}
                  */
                  component="a"
                  href={item.path}
                  sx={{
                    backgroundColor: isActiveRoute(item.path)
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <LogoutButton />
            </>
          ) : (
            <>
              {publicNavItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    backgroundColor: isActiveRoute(item.path)
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{
                  backgroundColor: isActiveRoute("/login")
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/signup"
                sx={{
                  backgroundColor: isActiveRoute("/signup")
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;