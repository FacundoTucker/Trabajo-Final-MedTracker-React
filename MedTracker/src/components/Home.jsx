import { useState } from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import ImgMedicosPacientes from "../img/medicospacientes.jpg";
import casaMedicina from "../img/casamedicina.jpg";
/*usando useState para mostrar/ocultar el menú REGISTRARSE. */
const Home = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  return (
    <>
      <main className="contenedorHome">
        <div className="acciones-home">
  <Link to="/login">
    <button id="btn-login">INICIAR SESIÓN</button>
  </Link>

  <div className="dropdown">
    <button id="btn-register" onClick={toggleDropdown}>
      REGISTRARSE ▼
    </button>

    {dropdownVisible && (
      <div id="dropdown-menu" className="dropdown-menu">
        <Link to="/registro-paciente" className="dropdown-item">Paciente</Link>
        <Link to="/registro-especialista" className="dropdown-item">Especialista</Link>
      </div>
    )}
  </div>
</div>


        <div className="contenedorUno">
          <img className="imgHome" src={ImgMedicosPacientes} alt="Imagen medico y pacientes"
          width="760"
           />
          <h2>
            Plataforma útil para clínicas de todos los tamaños, desde grandes equipos
            hasta profesionales independientes. El paquete de funciones incluye proceso
            de admisión de pacientes, gestionar horarios, realizar notas y formularios
            personalizados, recordatorios de citas gratuitos a los pacientes,
            facturación, telesalud y mucho más.
          </h2>
        </div>
        <div className="contenedorDos">
          <img className="imgHome" src={casaMedicina} alt="imagen de casa relacion a medicina"
            width="500"
          />
          <h3>
            Hacemos que los datos médicos sean fáciles de acceder y comprender para los
            profesionales de la salud y los pacientes, contribuyendo a una atención más
            eficiente y personalizada. <strong>¡Confianza!</strong> Fomentamos relaciones
            basadas en la confianza entre pacientes y proveedores de salud, ofreciendo una
            plataforma que respeta la privacidad y los derechos de los usuarios.
          </h3>
        </div>
      </main>
    </>
  );
};
export default Home;