import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles/SolicitarTurno.css";

const SolicitarTurno = () => {
  // Obtener el usuario logueado desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  const [especialistas, setEspecialistas] = useState([]);
  const [idEspecialista, setIdEspecialista] = useState("");
  const [fechaTurno, setFechaTurno] = useState("");

  // Cargar especialistas al montar el componente
  useEffect(() => {
    fetch("http://localhost:3000/especialista")
      .then(res => res.json())
      .then(data => setEspecialistas(data))
      .catch(err => console.error("Error cargando especialistas:", err));
  }, []);

  const solicitarTurno = async (e) => {
    e.preventDefault();

    // Validar campos
    if (!idEspecialista || !fechaTurno) {
      Swal.fire("Error", "Completa todos los campos", "error");
      return;
    }

    // Verificar que haya un usuario logueado
    if (!usuario || !usuario.id) {
      Swal.fire("Error", "Debes iniciar sesión para sacar un turno", "error");
      return;
    }

    // Convertir fecha al formato MySQL DATETIME
    const fechaFormateada = fechaTurno.replace("T", " ") + ":00";

    const body = {
      idPaciente: usuario.id,
      idEspecialista: Number(idEspecialista),
      fechaTurno: fechaFormateada,
      estado: "pendiente"
    };

    // Convertir fecha a objeto Date
const fechaSeleccionada = new Date(fechaTurno);
const ahora = new Date();

// Validar turno en el pasado
if (fechaSeleccionada < ahora) {
  Swal.fire("Error", "Fecha no valida", "error");
  return;
}

// Validar horario de atención 08:00-16:00
const hora = fechaSeleccionada.getHours();
if (hora < 8 || hora >= 16) {
  Swal.fire("Error", "Turno fuera del horario de atención (08:00-16:00)", "error");
  return;
}


    try {
      const res = await fetch("http://localhost:3000/turno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (!res.ok) {
        Swal.fire("Error", "No se pudo registrar el turno", "error");
        return;
      }

      Swal.fire("Éxito", "¡Turno solicitado correctamente!", "success");
      setIdEspecialista("");
      setFechaTurno("");

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Fallo al conectar con el servidor", "error");
    }
  };

  return (
    <div className="contenedor-solicitar">
      <h2>Solicitar Turno</h2>

      <form onSubmit={solicitarTurno}>
        <label>Especialista</label>
        <select
          value={idEspecialista}
          onChange={(e) => setIdEspecialista(e.target.value)}
        >
          <option value="">Seleccione</option>
          {especialistas.map(e => (
            <option key={e.idEspecialista} value={e.idEspecialista}>
              {e.nombre} {e.apellido} – ({e.especialidad})
            </option>
          ))}
        </select>

        <label>Fecha y hora</label>
        <input
          type="datetime-local"
          value={fechaTurno}
          onChange={(e) => setFechaTurno(e.target.value)}
        />

        <button type="submit">Confirmar Turno</button>
      </form>
    </div>
  );
};

// Export por defecto para que App.jsx lo importe correctamente
export default SolicitarTurno;

/*
const SolicitarTurno = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  const [especialistas, setEspecialistas] = useState([]);
  const [idEspecialista, setIdEspecialista] = useState("");
  const [fechaTurno, setFechaTurno] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/especialista")
      .then(res => res.json())
      .then(data => setEspecialistas(data))
      .catch(err => console.error("Error cargando especialistas:", err));
  }, []);

  const solicitarTurno = async (e) => {
    e.preventDefault();

    if (!idEspecialista || !fechaTurno) {
      Swal.fire("Error", "Completa todos los campos", "error");
      return;
    }

    const fechaFormateada = fechaTurno.replace("T", " ") + ":00";

    const body = {
      idPaciente: usuario.id,
      idEspecialista: Number(idEspecialista),
      fechaTurno,
      estado: "pendiente"
    };

    try {
      const res = await fetch("http://localhost:3000/turno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        Swal.fire("Error", "No se pudo registrar el turno", "error");
        return;
      }

      Swal.fire("Éxito", "¡Turno solicitado correctamente!", "success");
      setIdEspecialista("");
      setFechaTurno("");

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Fallo al conectar con el servidor", "error");
    }
  };

  return (
    <div className="contenedor-solicitar">
      <h2>Solicitar Turno</h2>

      <form onSubmit={solicitarTurno}>
        <label>Especialista</label>
        <select
          value={idEspecialista}
          onChange={(e) => setIdEspecialista(e.target.value)}
        >
          <option value="">Seleccione</option>
          {especialistas.map(e => (
            <option key={e.idEspecialista} value={e.idEspecialista}>
              {e.nombre} {e.apellido} – ({e.especialidad})
            </option>
          ))}
        </select>

        <label>Fecha y hora</label>
        <input
          type="datetime-local"
          value={fechaTurno}
          onChange={(e) => setFechaTurno(e.target.value)}
        />

        <button type="submit">Confirmar Turno</button>
      </form>
    </div>
  );
};

export default SolicitarTurno;
*/