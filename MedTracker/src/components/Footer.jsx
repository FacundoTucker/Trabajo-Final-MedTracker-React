import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <section className="footer-section about">
          <h4>MedTracker</h4>
          <p>
            Software de gestión médica pensado para clínicas, profesionales y pacientes.
          </p>
        </section>

        <section className="footer-section links">
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/login">Iniciar sesión</Link></li>
          </ul>
        </section>

        <section className="footer-section contact">
          <h4>Contacto</h4>
          <p><i className="fas fa-envelope"></i> info@medtracker.com</p>
          <p><i className="fas fa-phone"></i> +54 9 11 1234-5678</p>
        </section>

        <section className="footer-section social">
          <h4>Seguinos</h4>
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaLinkedinIn /></a>
        </section>
      </div>
      <div className="footer-copy">
        © 2025 MedTracker. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
