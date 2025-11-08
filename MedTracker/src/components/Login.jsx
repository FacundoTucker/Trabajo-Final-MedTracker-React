import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/login.css";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const mensajeError = useRef();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    // cargar usuarios desde el localstorage
    const pacientes = JSON.parse(localStorage.getItem("pacientesDePrueba")) || [];
    const especialistas = JSON.parse(localStorage.getItem("especialistasDePrueba")) || [];

    //buscar por paciente
    const pacienteEncontrado = pacientes.find(
      (p) => p.email === email && p.contraseña === password
    );

    //buscar por especialista
    const especialistaEncontrado = especialistas.find(
      (e) => e.email === email && e.contraseña === password
    );

    if (pacienteEncontrado) {
      localStorage.setItem("pacienteActivo", JSON.stringify({ tipo: "paciente", email }));
      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        text: "Has ingresado como paciente",
        confirmButtonColor: "#00acdb",
      }).then(() => {
        navigate("/home-paciente"); //cambia la ruta a HomePaciente
      });
    } else if (especialistaEncontrado) {
      localStorage.setItem("especialistaActivo", JSON.stringify({ tipo: "especialista", email }));
      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        text: "Has ingresado como especialista",
        confirmButtonColor: "#00acdb",
      }).then(() => {
        navigate("/carga-evolutivo"); //cambia la ruta a HomeEspecialista
      });
    } else {
      //mostrar mensaje de error
      mensajeError.current.classList.remove("mensajeError");
      mensajeError.current.classList.add("mostrarMensajeError");
    }
  };

  return (
    <div className="contenedorLoginForm">
      <h2 className="tituloForm">INICIO DE SESIÓN</h2>
      <form onSubmit={handleSubmit} id="loginForm" className="loginForm">
        <label htmlFor="email">CORREO ELECTRÓNICO</label>
        <input ref={emailRef} type="email" id="email" placeholder="Ingrese su email"/>

        <label htmlFor="password">CONTRASEÑA</label>
        <input ref={passwordRef} type="password" id="password" placeholder="Ingrese su contraseña"/>

        <p ref={mensajeError} id="mensajeError" className="mensajeError">⚠ Credenciales Incorrectas</p>

        <Link to="/recuperar-contraseña">¿Has olvidado la contraseña?</Link>

        <button type="submit">INICIAR SESIÓN</button>
      </form>
    </div>
  );
};

export default Login;
