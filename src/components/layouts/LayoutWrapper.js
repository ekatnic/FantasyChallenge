import React from "react";
import { Outlet } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import NavBar from "../NavBar";

export default function LayoutWrapper() {
  return (
    <>
      <CssBaseline />
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
