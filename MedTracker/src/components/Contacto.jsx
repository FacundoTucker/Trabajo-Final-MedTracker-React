import { useState } from "react";
import Swal from "sweetalert2";
import "../styles/contacto.css";
import { useNavigate } from "react-router-dom";

const Contacto = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [errores, setErrores] = useState({});

  const validar = () => {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      nuevosErrores.email = "Debes ingresar un email válido.";
    }

    if (form.mensaje.trim().length < 10) {
      nuevosErrores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validar()) return;

    Swal.fire({
      title: "Mensaje enviado",
      text: "Gracias por contactarte con nosotros!",
      icon: "success",
      confirmButtonText: "Volver al Inicio",
    }).then(() => {
      navigate("/");
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="contacto-contenedor">
      <h2>Contacto</h2>

      <form className="contacto-form" onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="campo">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
          />
          {errores.nombre && <p className="error">{errores.nombre}</p>}
        </div>

        {/* Email */}
        <div className="campo">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ejemplo@email.com"
          />
          {errores.email && <p className="error">{errores.email}</p>}
        </div>

        {/* Mensaje */}
        <div className="campo">
          <label>Mensaje</label>
          <textarea
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            placeholder="Escribe tu mensaje aquí..."
          />
          {errores.mensaje && <p className="error">{errores.mensaje}</p>}
        </div>

        <button type="submit" className="btn-enviar">
          Enviar mensaje
        </button>
      </form>
    </div>
  );
};

export default Contacto;
