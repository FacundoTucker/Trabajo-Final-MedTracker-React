import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/login.css";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const correoElectronico = emailRef.current.value.trim();
    const contraseña = passwordRef.current.value.trim();

    if (!correoElectronico || !contraseña) {
      setError("⚠ Complete todos los campos");
      return;
    }

    try {
      const response = await fetch("https://trabajo-final-medtracker.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correoElectronico, contraseña }),
      });

      if (!response.ok) {
        setError("⚠ Credenciales incorrectas");
        return;
      }

      const data = await response.json();
      console.log("DATA LOGIN:", data);


      //guardamos el usuario activo segun su tipo
      localStorage.setItem("usuarioActivo", JSON.stringify(data));

      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        text: `Ingresaste como ${data.tipo}`,
        confirmButtonColor: "#00acdb",
      }).then(() => {
        if (data.tipo === "paciente") {
          navigate("/dashboard-paciente");
        } else {
          navigate("/dashboard-especialista"          ); // home del especialista
        }
      });
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setError("⚠ Error al conectar con el servidor");
    }
  };

  return (
    <div className="contenedorLoginForm">
      <h2 className="tituloForm">INICIO DE SESIÓN</h2>

      <form onSubmit={handleSubmit} id="loginForm" className="loginForm">
        <label htmlFor="email">CORREO ELECTRÓNICO</label>
        <input ref={emailRef} type="email" id="email" placeholder="Ingrese su email" />

        <label htmlFor="password">CONTRASEÑA</label>
        <input ref={passwordRef} type="password" id="password" placeholder="Ingrese su contraseña" />

        {error && <p className="mostrarMensajeError">{error}</p>}

        <button type="submit">INICIAR SESIÓN</button>
      </form>
    </div>
  );
};

export default Login;

