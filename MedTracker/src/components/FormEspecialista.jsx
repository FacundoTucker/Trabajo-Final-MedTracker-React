import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/registro.css";
import Swal from "sweetalert2";

const FormEspecialista = () => {

  const nombre = useRef();
  const apellido = useRef();
  const fechaNacimiento = useRef();
  const numeroDocumento = useRef();
  const domicilio = useRef();
  const email = useRef();
  const telefono = useRef();
  const matricula = useRef();
  const especialidad = useRef();
  const contraseña = useRef();
  const contraseñaRepetida = useRef();
  const mensajeError = useRef();

  const navigate = useNavigate();

  const mostrarError = (mensaje) => {
    mensajeError.current.textContent = mensaje;
    mensajeError.current.classList.remove("mensajeError");
    mensajeError.current.classList.add("mostrarMensajeError");
  };

  const validarContraseña = (pass) => {
    if (pass.length < 7) return false;
    const tieneMayuscula = /[A-Z]/.test(pass);
    const tieneNumero = /\d/.test(pass);
    return tieneMayuscula && tieneNumero;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      nombre: nombre.current.value.trim(),
      apellido: apellido.current.value.trim(),
      fechaNacimiento: fechaNacimiento.current.value.trim(),
      numeroDocumento: numeroDocumento.current.value.trim(),
      domicilio: domicilio.current.value.trim(),
      email: email.current.value.trim(),
      telefono: telefono.current.value.trim(),
      matricula: matricula.current.value.trim(),
      especialidad: especialidad.current.value.trim(),
      contraseña: contraseña.current.value,
      contraseñaRepetida: contraseñaRepetida.current.value,
    };

    for (let key in datos) {
      if (!datos[key]) {
        mostrarError("⚠ Asegúrese de completar todos los campos correctamente.");
        return;
    }}
    if (datos.contraseña !== datos.contraseñaRepetida) {
      mostrarError("⚠ Las contraseñas no coinciden.");
      return;
    }
    if (!validarContraseña(datos.contraseña)) {
      mostrarError("⚠ La contraseña debe tener al menos 7 caracteres, una mayúscula y un número.");
      return;
    }

    const especialistaParaBack = {
    nombre: datos.nombre,
    apellido: datos.apellido,
    fechaNacimiento: datos.fechaNacimiento,
    DNI: Number(datos.numeroDocumento),
    domicilio: datos.domicilio,
    correoElectronico: datos.email,
    nroTelefono: Number(datos.telefono),
    especialidad: datos.especialidad,
    nroMatricula: datos.matricula,
    contraseña: datos.contraseña,
};


    try {
      const response = await fetch("https://trabajo-final-medtracker.onrender.com/especialista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(especialistaParaBack),
      });

      if (!response.ok) {
        const error = await response.json();
        mostrarError(error.message || "Error al registrar el especialista");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "✔ Tu especialista ha sido registrado correctamente",
        confirmButtonColor: "#00acdb",
      }).then(() => {
        navigate("/login");
      });

      e.target.reset();

    } catch (err) {
      console.error(err);
      mostrarError("⚠ Error conectando con el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} id="registroEspecialistaForm">
      <label htmlFor="nombre">NOMBRE</label>
      <input ref={nombre} type="text" id="nombre" />

      <label htmlFor="apellido">APELLIDO</label>
      <input ref={apellido} type="text" id="apellido" />

      <label htmlFor="fechaNacimiento">FECHA DE NACIMIENTO</label>
      <input ref={fechaNacimiento} type="date" id="fechaNacimiento" />

      <label htmlFor="numeroDocumento">N° DE DOCUMENTO</label>
      <input ref={numeroDocumento} type="text" id="numeroDocumento" />

      <label htmlFor="domicilio">DOMICILIO</label>
      <input ref={domicilio} type="text" id="domicilio" />

      <label htmlFor="email">CORREO ELECTRÓNICO</label>
      <input ref={email} type="email" id="email" />

      <label htmlFor="telefono">N° DE TELÉFONO</label>
      <input ref={telefono} type="tel" id="telefono" />

      <label htmlFor="matricula">N° DE MATRÍCULA</label>
      <input ref={matricula} type="text" id="matricula" />

      <label htmlFor="especialidad">ESPECIALIDAD</label>
      <input ref={especialidad} type="text" id="especialidad" />

      <label htmlFor="contraseña">CONTRASEÑA</label>
      <input ref={contraseña} type="password" id="contraseña" />

      <label htmlFor="contraseñaRepetida">REPETIR CONTRASEÑA</label>
      <input ref={contraseñaRepetida} type="password" id="contraseñaRepetida" />

      <p ref={mensajeError} id="mensajeEspecialista" className="mensajeError">
        mensajeError
      </p>

      <Link to="/login">¿Ya tienes una cuenta? Inicia sesión.</Link>
      <button type="submit">REGISTRARSE</button>
    </form>
  );
}

export default FormEspecialista;

