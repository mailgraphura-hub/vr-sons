import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  const access = localStorage.getItem("admin");

  if (!access) return <Navigate to="/admin/login" />;

  return children;
}
