import { LoginPage } from "./components/pages/LoginPage";
import { Home } from "./components/pages/Home";
import { Profile } from "./components/pages/Profile"
import { Lobby } from "./components/pages/Lobby"
import { PrivateRoute } from "./components/PrivateRoute";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/hooks/useAuth";

import "@fontsource/poppins/200.css"
import "@fontsource/poppins/400.css"; // Normal
import "@fontsource/poppins/500.css"; // Normal
import "@fontsource/poppins/600.css"; // Normal
import "@fontsource/poppins/900.css"; // Black
import { Background } from "./components/pages/Background";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Background>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/lobby/:id"
              element={
                <PrivateRoute>
                  <Lobby />
                </PrivateRoute>
              }
            />
          </Routes>
        </Background>
      </AuthProvider>
    </Router>
  );
}



export default App;
