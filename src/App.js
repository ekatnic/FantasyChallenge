import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CssBaseline, Container } from "@mui/material";

// Components
import LayoutWrapper from "./components/layouts/LayoutWrapper";
import LoginForm from "./components/auth/LoginForm";
import Signup from "./components/auth/Signup";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./components/Home";
import ProtectedHome from "./components/ProtectedHome";
import Standings from "./components/Standings";
import Players from "./components/Players";
import Rules from "./components/Rules";
import EntryList from "./components/EntryList";
import CreateEntry from "./components/CreateEntry";
import EditEntry from "./components/EditEntry";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<LayoutWrapper />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/rules" element={<Rules />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<ProtectedHome />} />
              <Route path="/user-home" element={<ProtectedHome />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/players" element={<Players />} />
              <Route path="/create-entry" element={<CreateEntry />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
