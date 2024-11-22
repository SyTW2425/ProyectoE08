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


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
            <Route path="/" element={<AuthWrapper />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const AuthWrapper = () => {
  const {isAuthenticaded, login, register} = useAuth()
  return (
    <div>
      {
        isAuthenticaded ?
          <Home/>
          :
          <LoginPage onLogin={login} onRegister={register}/>
      }
    </div>
  )
}

export default App;
