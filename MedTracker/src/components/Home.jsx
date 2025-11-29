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
      <header>
        <Link to="/" className="medTracker">MEDTRACKER</Link>
        <div className="acciones-header">
          <Link to="/login">
            <button id="btn-login">INICIAR SESIÓN</button>
          </Link>
          <div className="dropdown">
            <button id="btn-register" onClick={toggleDropdown}>
              REGISTRARSE ▼
            </button>
              {dropdownVisible && (
            <div
              id="dropdown-menu"
              className={`dropdown-menu ${dropdownVisible ? "" : "hidden"}`}
            >
             <Link to="/registro-paciente"><button>Paciente</button></Link>
              <Link to="/registro-especialista"><button>Especialista</button></Link>
            </div>
            )}
          </div>
        </div>
      </header>
      <main className="contenedor">
        <div className="titulo"></div>
        <div className="contenedorUno">
          <img src={ImgMedicosPacientes} alt="Imagen medico y pacientes"
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
          <img src={casaMedicina} alt="imagen de casa relacion a medicina"
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
      <footer className="footer">
        <div className="footer-container">
          <section className="footer-section about">
            <h4>MedTracker</h4>
            <p>
              Software de gestión médica pensado para clínicas, profesionales y
              pacientes.
            </p>
          </section>
          <section className="footer-section links">
            <h4>Navegación</h4>
            <ul>
              <li><a href="home.html">Inicio</a></li>
              <li><a href="contacto.html">Contacto</a></li>
              <li><a href="#">Preguntas frecuentes</a></li>
            </ul>
          </section>
          <section className="footer-section contact">
            <h4>Contacto</h4>
            <p><i className="fas fa-envelope"></i> info@medtracker.com</p>
            <p><i className="fas fa-phone"></i> +54 9 11 1234-5678</p>
          </section>
          <section className="footer-section social">
            <h4>Seguinos</h4>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </section>
        </div>
        <div className="footer-copy">
          © 2025 MedTracker. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
};
export default Home;