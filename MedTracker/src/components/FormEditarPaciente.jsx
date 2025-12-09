import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/registro.css";

const FormEditarPaciente = () => {
  const navigate = useNavigate();

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const id = usuarioActivo?.id;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    DNI: "",
    domicilio: "",
    correoElectronico: "",
    nroTelefono: "",
  });

  const [error, setError] = useState("");

  //get al paciente para autorrellenar
  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const res = await fetch(`https://trabajo-final-medtracker.onrender.com/paciente/${id}`);
        if (!res.ok) throw new Error("No se pudieron obtener los datos");

        const data = await res.json();

        setForm({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          fechaNacimiento: data.fechaNacimiento?.substring(0, 10) || "",
          DNI: data.DNI || "",
          domicilio: data.domicilio || "",
          correoElectronico: data.correoElectronico || "",
          nroTelefono: data.nroTelefono || "",
        });
      } catch (err) {
        setError("Error cargando los datos del paciente.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPaciente();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //validacion campos vacios
    for (let key in form) {
      if (!form[key]) {
        setError("⚠ Debes completar todos los campos.");
        return;
      }
    }

    const pacienteParaBack = {
      nombre: form.nombre,
      apellido: form.apellido,
      fechaNacimiento: form.fechaNacimiento,
      DNI: Number(form.DNI),
      domicilio: form.domicilio,
      correoElectronico: form.correoElectronico,
      nroTelefono: Number(form.nroTelefono),
    };

    try {
      const response = await fetch(`https://trabajo-final-medtracker.onrender.com/paciente/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacienteParaBack),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message || "Error al actualizar el perfil.");
        return;
      }

      localStorage.setItem(
        "usuarioActivo",
        JSON.stringify({
          ...usuarioActivo,
          ...pacienteParaBack,
        })
      );

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "✔ Los cambios fueron guardados correctamente.",
        confirmButtonColor: "#00acdb",
      }).then(() => {
        navigate("/home-paciente");
      });

    } catch (err) {
      console.error(err);
      setError("⚠ Error conectando con el servidor.");
    }
  };

  if (loading) return <p>Cargando datos...</p>;

  return (
    <form onSubmit={handleSubmit} id="registroPacienteForm">
      <label>NOMBRE</label>
      <input
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        type="text"
      />

      <label>APELLIDO</label>
      <input
        value={form.apellido}
        onChange={(e) => setForm({ ...form, apellido: e.target.value })}
        type="text"
      />

      <label>FECHA DE NACIMIENTO</label>
      <input
        value={form.fechaNacimiento}
        onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
        type="date"
      />

      <label>N° DE DOCUMENTO</label>
      <input
        value={form.DNI}
        onChange={(e) => setForm({ ...form, DNI: e.target.value })}
        type="text"
      />

      <label>DOMICILIO</label>
      <input
        value={form.domicilio}
        onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
        type="text"
      />

      <label>CORREO ELECTRÓNICO</label>
      <input
        value={form.correoElectronico}
        onChange={(e) => setForm({ ...form, correoElectronico: e.target.value })}
        type="email"
      />

      <label>N° DE TELÉFONO</label>
      <input
        value={form.nroTelefono}
        onChange={(e) => setForm({ ...form, nroTelefono: e.target.value })}
        type="tel"
      />

      {/* ERROR */}
      {error && <p className="mostrarMensajeError">{error}</p>}

      <button type="submit">GUARDAR CAMBIOS</button>
    </form>
  );
};

export default FormEditarPaciente;

