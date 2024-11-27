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
  const {isAuthenticated, loading, login, register, logout} = useAuth()
  return (
    <div>
      {
        loading ? 
        <p>Cargando...</p>  
        :     
        <div>
        {
          isAuthenticated ?
            <Home onLogout={logout}/>
            :
            <LoginPage onLogin={login} onRegister={register}/>
        }
        </div>
      }
    </div>
    
  )
}

export default App;
