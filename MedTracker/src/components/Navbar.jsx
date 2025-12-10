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

  // ESTADOS
  const [usuario, setUsuario] = useState(null); // Usuario logueado
  const [dniActual, setDniActual] = useState(null); // DNI del paciente


  // FUNCIONES 
  // Función para volver atrás o al dashboard según usuario
  const handleBack = () => {
    // Navegar hacia atrás si hay historial, sino al dashboard según tipo de usuario
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      if (usuario?.tipo === "especialista") {
        navigate("/dashboard-especialista");
      } else {
        navigate("/dashboard-paciente");
      }
    }
  };

  // FUNCION PARA CERRAR SESION
  const handleLogout = () => {
    localStorage.removeItem("usuarioActivo");
    setUsuario(null);
    navigate("/login");
  };

  // FUNCION PARA NAVEGAR A PAGINA DE EDICION SEGUN TIPO DE USUARIO
  // va A  editar perfil segun TIPO DE USUARIO
  const handleEditarPerfil = () => {
    if (esPaciente) {
      navigate("/editar-paciente");
    }

    if (esEspecialista) {
      navigate("/editar-especialista");
    }
  };

  // CARGA DE DATOS
  useEffect(() => {
    //carga usuario activo del localStorage
    const data = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (data) {
      setUsuario({ ...data, rol: data.rol?.toLowerCase() });
    } else {
      setUsuario(null);
    }

    //escucha los cambios del paciente seleccionado
    const actualizarPaciente = (e) => {
      const nuevoPaciente = e.detail;
      setDniActual(nuevoPaciente?.DNI);
    };

    window.addEventListener("pacienteChanged", actualizarPaciente);

    return () => {

      window.removeEventListener("pacienteChanged", actualizarPaciente);
    };
  }, [location]);


  // RUTAS OCULTAS
  // donde el navbar no se muestra
  const rutasOcultas = ["/login", "/registro-paciente", "/registro-especialista", "/", "/contacto"];
  if (rutasOcultas.includes(location.pathname) || !usuario) return null;


  //define tipo de usuario
  const esPaciente = usuario.tipo === "paciente";
  const esEspecialista = usuario.tipo === "especialista";

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {/* Botón volver */}
        <li className="btn-back" onClick={handleBack}>← Volver</li>

        {/* Opciones para pacientes */}
        {esPaciente && (
          <>
            <li><Link to="/mis-turnos">Mis Turnos</Link></li>
            <span className="divider-vertical"></span>
            <li><Link to="/solicitar-turno">Solicitar Turno</Link></li>
            <span className="divider-vertical"></span>
            <li><Link to="/verhc/:dniCargado">Historia Clinica</Link></li>
          </>
        )}

        {/* Opciones para especialistas */}
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
                <li>
                </li>
              </>
            )}
          </>
        )}

        {/* Saludo y editar perfil */}
        <li className="saludo-navbar">
          <img
            className="user-avatar"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Usuario"
          />

          <div className="saludo-texto">
            {esPaciente && <span>Hola, {usuario.nombre}</span>}
            {esEspecialista && <span>Dr/a {usuario.nombre}</span>}
            <li>
              <small onClick={handleEditarPerfil}>
                Editar perfil
              </small>
            </li>
          </div>
        </li>

        {/* Botón cerrar sesión */}
        <li className="logout-btn" onClick={handleLogout}>Cerrar Sesión</li>
      </ul>
    </nav>
  );
};

export default Navbar;
