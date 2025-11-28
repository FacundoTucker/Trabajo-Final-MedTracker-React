import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, rol }) => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  // Si no hay usuario → no está logueado
  if (!usuario) return <Navigate to="/login" />;

  // Si la ruta requiere un rol (paciente/especialista) y no coincide
  if (rol && usuario.rol !== rol) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

