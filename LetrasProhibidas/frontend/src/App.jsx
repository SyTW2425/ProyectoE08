import { LoginPage } from "./components/pages/LoginPage";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./components/pages/Home";
import { AuthProvider, useAuth } from "./components/hooks/useAuth";

import "@fontsource/poppins/200.css"
import "@fontsource/poppins/400.css"; // Normal
import "@fontsource/poppins/500.css"; // Normal
import "@fontsource/poppins/600.css"; // Normal
import "@fontsource/poppins/900.css"; // Black
import { Background } from "./components/pages/Background";


function App() {
  return (
    <AuthProvider>
      <Background>
        <Router>
          <Routes>
              <Route path="/" element={<AuthWrapper />} />
          </Routes>
        </Router>
      </Background>
    </AuthProvider>
  );
}

const AuthWrapper = () => {
  const {isAuthenticated, login, register} = useAuth()
  return (
    <div>
      {
        isAuthenticated ?
          <Home/>
          :
          <LoginPage onLogin={login} onRegister={register}/>
      }
    </div>
  )
}

export default App;
