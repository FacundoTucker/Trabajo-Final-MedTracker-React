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

  const [dniActual, setDniActual] = useState(null);

  useEffect(() => {
  const p = JSON.parse(localStorage.getItem("pacienteActual"));
  setDniActual(p?.DNI || null);
}, []);


  useEffect(() => {
  //carga usuario
  const data = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (data) {
    setUsuario({ ...data, rol: data.rol?.toLowerCase() });
  } else {
    setUsuario(null);
  }

  //escucha los cambios del paciente actual
  const actualizarPaciente = (e) => {
    const nuevoPaciente = e.detail;
    setDniActual(nuevoPaciente?.DNI);
  };

  window.addEventListener("pacienteChanged", actualizarPaciente);

  return () => {
    window.removeEventListener("pacienteChanged", actualizarPaciente);
  };
}, [location]);



  const rutasOcultas = ["/login", "/registro-paciente", "/registro-especialista","/","/contacto"];
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
            <span className="divider-vertical"></span>
            <li><Link to="/solicitar-turno">Solicitar Turno</Link></li>
          </>
        )}
        {esEspecialista && (
          <>
            <li><Link to="/turnos-especialista">Mis Turnos</Link></li>
            <span className="divider-vertical"></span>
            <li><Link to="/carga-evolutivo">Cargar Evolutivo</Link></li>
            <span className="divider-vertical"></span>
            {dniActual && (
              <>
              <li><Link to={`/verhc/${dniActual}`}>Ver Historia Clínica</Link></li>
              <span className="divider-vertical"></span>
              <li><Link to={`/indicacion/${dniActual}`}>Nueva indicación</Link></li>
              </>
            )}
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
