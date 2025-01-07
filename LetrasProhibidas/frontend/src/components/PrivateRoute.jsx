import { Navigate } from "react-router-dom"; // Solo necesitamos Navigate
import { useAuth } from "./hooks/useAuth"; // Ajusta la ruta si es necesario

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return children;
  }
  return <Navigate to="/login" />;
};
