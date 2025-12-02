/* Navbar principal: muestra las opciones según el tipo de usuario
     (paciente o especialista) y permite cerrar sesión. Mejora la experiencia
     del usuario al navegar por la aplicación y asegura que las rutas sensibles
     no sean accesibles sin login. */

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (data) setUsuario({ ...data, rol: data.rol?.toLowerCase() });
  }, []); // se ejecuta al montar el componente

  const rutasOcultas = ["/login", "/registro-paciente", "/registro-especialista"];
  if (rutasOcultas.includes(location.pathname) || !usuario) return null;

  const esPaciente = usuario.tipo === "paciente";
  const esEspecialista = usuario.tipo === "especialista";

  const handleLogout = () => {
    localStorage.removeItem("usuarioActivo");
    setUsuario(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {esPaciente && (
          <>
            <li><Link to="/mis-turnos">Mis Turnos</Link></li>
            <li><Link to="/solicitar-turno">Solicitar Turno</Link></li>
          </>
        )}
        {esEspecialista && (
          <>
            <li><Link to="/turnos-especialista">Mis Turnos</Link></li>
            <li><Link to="/carga-evolutivo">Cargar Evolutivo</Link></li>
          </>
        )}

        <li className="saludo-navbar">
  <span className="user-icon">👤</span>
  <span>
    {esPaciente && `Hola! Paciente ${usuario.nombre}`}
    {esEspecialista && `Hola! Dr/a ${usuario.nombre}`}
  </span>
</li>


        <li className="logout-btn" onClick={handleLogout}>Cerrar Sesión</li>
      </ul>
    </nav>
  );
};

export default Navbar;
