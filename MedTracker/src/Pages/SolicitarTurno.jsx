import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../styles/SolicitarTurno.css";

const SolicitarTurno = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  const [especialistas, setEspecialistas] = useState([]);
  const [idEspecialista, setIdEspecialista] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [ocupados, setOcupados] = useState([]);

  // Cargar especialistas
  useEffect(() => {
    fetch("https://trabajo-final-medtracker.onrender.com/especialista")
      .then(r => r.json())
      .then(setEspecialistas)
      .catch(err => console.error(err));
  }, []);

  // Cargar turnos ocupados al cambiar especialista o fecha
  useEffect(() => {
    if (!idEspecialista || !fecha) return;
    fetch(`https://trabajo-final-medtracker.onrender.com/turno/especialista/${idEspecialista}?fecha=${fecha}`)
      .then(r => r.json())
      .then(d => {
        if (!Array.isArray(d)) d = []; // asegurar que d sea array
        const horas = d.map(t =>
          new Date(t.fechaTurno).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
        setOcupados(horas);
      })
      .catch(err => console.error(err));
  }, [idEspecialista, fecha]);

  // Generar horarios disponibles 08:00 a 15:30, cada 30 min
  const generarHorarios = () => {
    const horarios = [];
    for (let h = 8; h <= 15; h++) {
      ["00", "30"].forEach(min => {
        if (h === 15 && min === "30") return; // 15:30 es la última franja permitida
        const hStr = `${h.toString().padStart(2, "0")}:${min}`;
        if (!ocupados.includes(hStr)) horarios.push(hStr);
      });
    }
    return horarios;
  };

  // Manejar selección de fecha evitando sábados y domingos
  const handleFecha = e => {
    const f = e.target.value;
    const [year, month, day] = f.split("-").map(Number);
    const diaSemana = new Date(year, month - 1, day).getDay();

    if (diaSemana === 0 || diaSemana === 6) {
      Swal.fire("Error", "No se pueden seleccionar sábados ni domingos", "error");
      setFecha("");
      return;
    }
    setFecha(f);
  };

  // Enviar turno al backend
  const enviar = async e => {
    e.preventDefault();
    if (!idEspecialista || !fecha || !hora) {
      return Swal.fire("Error", "Completa todos los campos", "error");
    }

    const fechaLocal = new Date(`${fecha}T${hora}:00`);
    const fechaTurno = new Date(fechaLocal.getTime() - fechaLocal.getTimezoneOffset() * 60000).toISOString();


    try {
      const res = await fetch("https://trabajo-final-medtracker.onrender.com/turno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPaciente: usuario.id,
          idEspecialista: Number(idEspecialista),
          fechaTurno, // corregido
          estado: "pendiente"
        })
      });

      if (!res.ok) {
        const err = await res.json();
        return Swal.fire("Error", err.message || "No se pudo registrar", "error");
      }

      Swal.fire("Éxito", "Turno solicitado correctamente", "success");
      setIdEspecialista("");
      setFecha("");
      setHora("");
      setOcupados([]);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Fallo al conectar con el servidor", "error");
    }
  };

  const hoy = new Date().toISOString().split("T")[0];
  const horariosDisponibles = generarHorarios();

  return (
    <div className="contenedor-solicitar">
      <h2>Solicitar Turno</h2>
      <form onSubmit={enviar} className="form-solicitar">
        <label>Especialista</label>
        <select value={idEspecialista} onChange={e => setIdEspecialista(e.target.value)} className="input-select">
          <option value="">Seleccione especialista</option>
          {especialistas.map(e => (
            <option key={e.idEspecialista} value={e.idEspecialista}>
              {e.nombre} {e.apellido} – {e.especialidad}
            </option>
          ))}
        </select>

        <label>Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={handleFecha}
          min={hoy}
          className="input-fecha"
          onKeyDown={(e) => e.preventDefault()} 
        />

        <label>Hora</label>
        <select value={hora} onChange={e => setHora(e.target.value)} className="input-select">
          <option value="">Seleccione hora</option>
          {horariosDisponibles.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <button type="submit" className="btn-confirmar">Confirmar Turno</button>
      </form>
    </div>
  );
};

export default SolicitarTurno;
