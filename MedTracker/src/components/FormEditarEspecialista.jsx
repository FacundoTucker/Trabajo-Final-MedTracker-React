import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/registro.css";

const FormEditarEspecialista = () => {
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
    especialidad: "",
    nroMatricula: "",
  });

  const [error, setError] = useState("");

  // 🔥 GET al especialista para autorrellenar
  useEffect(() => {
    const fetchEspecialista = async () => {
      try {
        const res = await fetch(`https://trabajo-final-medtracker.onrender.com/especialista/${id}`);
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
          especialidad: data.especialidad || "",
          nroMatricula: data.nroMatricula || "",
        });
      } catch (err) {
        setError("Error cargando los datos del especialista.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEspecialista();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación campos vacíos
    for (let key in form) {
      if (!form[key]) {
        setError("⚠ Debes completar todos los campos.");
        return;
      }
    }

    const especialistaParaBack = {
      nombre: form.nombre,
      apellido: form.apellido,
      fechaNacimiento: form.fechaNacimiento,
      DNI: Number(form.DNI),
      domicilio: form.domicilio,
      correoElectronico: form.correoElectronico,
      nroTelefono: Number(form.nroTelefono),
      especialidad: form.especialidad,
      nroMatricula: form.nroMatricula,
    };

    try {
      const response = await fetch(`https://trabajo-final-medtracker.onrender.com/especialista/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(especialistaParaBack),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message || "Error al actualizar el perfil.");
        return;
      }

      // 🔥 Actualizar localStorage con los nuevos datos
      localStorage.setItem(
        "usuarioActivo",
        JSON.stringify({
          ...usuarioActivo,
          ...especialistaParaBack,
        })
      );

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "✔ Los cambios fueron guardados correctamente.",
        confirmButtonColor: "#00acdb",
      }).then(() => {
        navigate("/home-especialista");
      });

    } catch (err) {
      console.error(err);
      setError("⚠ Error conectando con el servidor.");
    }
  };

  if (loading) return <p>Cargando datos...</p>;

  return (
    <form onSubmit={handleSubmit} id="registroEspecialistaForm">
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
        onChange={(e) =>
          setForm({ ...form, correoElectronico: e.target.value })
        }
        type="email"
      />

      <label>N° DE TELÉFONO</label>
      <input
        value={form.nroTelefono}
        onChange={(e) => setForm({ ...form, nroTelefono: e.target.value })}
        type="tel"
      />

      <label>ESPECIALIDAD</label>
      <input
        value={form.especialidad}
        onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
        type="text"
      />

      <label>N° DE MATRÍCULA</label>
      <input
        value={form.nroMatricula}
        onChange={(e) => setForm({ ...form, nroMatricula: e.target.value })}
        type="text"
      />

      {/* ERROR */}
      {error && <p className="mostrarMensajeError">{error}</p>}

      <button type="submit">GUARDAR CAMBIOS</button>
    </form>
  );
};

export default FormEditarEspecialista;

