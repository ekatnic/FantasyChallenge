import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Components
import LayoutWrapper from "./components/layouts/LayoutWrapper";
import LoginForm from "./components/auth/LoginForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ConfirmForgotPassword from "./components/auth/ConfirmForgotPassword";
import Signup from "./components/auth/Signup";
// import ConfirmSignupForm from "./components/auth/ConfirmSignupForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./components/Home";
import ProtectedHome from "./components/ProtectedHome";
import StandingsPage from "./components/StandingsPage";
import PlayerOwnership from "./components/PlayerOwnership";
import Rules from "./components/Rules";
// import CreateEntry from "./components/CreateEntry";
// import EditEntry from "./components/EditEntry";
import MyEntries from "./components/MyEntries";
import ViewEntry from "./components/ViewEntry";

const App = () => {
  
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<LayoutWrapper />}>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/confirm-forgot-password" element={<ConfirmForgotPassword />} />
        <Route path="/rules" element={<Rules />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<ProtectedHome />} />
          <Route path="/my-entries" element={<MyEntries />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/players" element={<PlayerOwnership />} />
          {/* <Route path="/create-entry" element={<CreateEntry />} /> */}
          {/* <Route path="/edit-entry/:id" element={<EditEntry />} /> */}
          <Route path="/view-entry/:id" element={<ViewEntry />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default App;