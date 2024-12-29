import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Components
import LayoutWrapper from "./components/layouts/LayoutWrapper";
import LoginForm from "./components/auth/LoginForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ConfirmForgotPassword from "./components/auth/ConfirmForgotPassword";
import Signup from "./components/auth/Signup";
import ConfirmSignupForm from "./components/auth/ConfirmSignupForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./components/Home";
// import ProtectedHome from "./components/ProtectedHome";
// import Standings from "./components/Standings";
// import Players from "./components/Players";
import Rules from "./components/Rules";
import EntryList from "./components/EntryList";
import CreateEntry from "./components/CreateEntry";
import EditEntry from "./components/EditEntry";
import UserHome from "./components/UserHome";

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
            <Route path="/confirm-signup" element={<ConfirmSignupForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route
              path="/confirm-forgot-password"
              element={<ConfirmForgotPassword />}
            />
            <Route path="/rules" element={<Rules />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserHome />} />
              <Route path="/user-home" element={<UserHome />} /> 
              {/* <Route path="/standings" element={<Standings />} />
              <Route path="/players" element={<Players />} /> */}
              <Route path="/create-entry" element={<CreateEntry />} />
              <Route path="/edit-entry/:id" element={<EditEntry />} />
              <Route path="/view-entry" element={<EntryList />} />
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
