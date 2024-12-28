import { LoginPage } from "./components/pages/LoginPage";
import { Home } from "./components/pages/Home";
import { Profile } from "./components/pages/Profile";
import { Lobby } from "./components/pages/Lobby";
import { Play } from "./components/pages/Play";
import { PrivateRoute } from "./components/PrivateRoute";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/hooks/useAuth";
import { Background } from "./components/pages/Background";
import { SocketProvider } from "./components/hooks/useSocket";
import { LoadingProvider } from "./components/hooks/useLoading";

import "@fontsource/poppins/200.css";
import "@fontsource/poppins/400.css"; // Normal
import "@fontsource/poppins/500.css"; // Normal
import "@fontsource/poppins/600.css"; // Normal
import "@fontsource/poppins/900.css"; // Black
import { Game } from "./components/pages/Game";

function App() {
  return (
    <LoadingProvider>
      <Router>
        <AuthProvider>
          <SocketProvider>
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
                <Route
                  path="/login"
                  element={<LoginRoute />}
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
                <Route
                  path="/play"
                  element={
                    <PrivateRoute>
                      <Play />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/game/:id"
                  element={
                    <PrivateRoute>
                      <Game />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Background>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </LoadingProvider>
  );
}

const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : <LoginPage />;
};

export default App;