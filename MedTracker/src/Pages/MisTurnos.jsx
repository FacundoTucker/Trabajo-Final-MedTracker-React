import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles/MisTurnos.css";

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  const [reprogramando, setReprogramando] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState({ fecha: "", hora: "" });

  // Cargar turnos del paciente
  useEffect(() => {
    if (!usuario) return;

    const obtenerTurnos = async () => {
      try {
        const res = await fetch(`https://trabajo-final-medtracker.onrender.com/turno/paciente/${usuario.id}`);
        const data = await res.json();
        setTurnos(data);
      } catch (err) {
        console.error("Error cargando mis turnos:", err);
      }
    };

    obtenerTurnos();
    const intervalId = setInterval(obtenerTurnos, 5000);
    return () => clearInterval(intervalId);
  }, [usuario]);

  // Cancelar turno
  const cancelarTurno = async (idTurno) => {
    const confirm = await Swal.fire({
      title: "¿Seguro querés cancelar este turno?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`https://trabajo-final-medtracker.onrender.com/turno/${idTurno}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      Swal.fire("Turno cancelado", "", "success");
      setTurnos(turnos.filter(t => t.idTurno !== idTurno));
    } catch (err) {
      Swal.fire("Error", "No se pudo cancelar el turno", "error");
    }
  };

  // Guardar reprogramación
  const guardarReprogramacion = async (idTurno) => {
    if (!nuevaFecha.fecha || !nuevaFecha.hora) {
      Swal.fire("Error", "Seleccioná fecha y hora válidas", "error");
      return;
    }

    // Combinar fecha y hora correctamente
    const [y, m, d] = nuevaFecha.fecha.split("-").map(Number);
    const [h, min] = nuevaFecha.hora.split(":").map(Number);
    const fechaObj = new Date(y, m - 1, d, h, min);
    const fechaTurno = fechaObj.toISOString();

    try {
      const res = await fetch(`https://trabajo-final-medtracker.onrender.com/turno/${idTurno}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fechaTurno }),
      });
      if (!res.ok) throw new Error("Error al reprogramar");

      const updatedTurno = await res.json();
      Swal.fire("Turno reprogramado", "", "success");
      setTurnos(turnos.map(t => t.idTurno === idTurno ? updatedTurno : t));
      setReprogramando(null);
      setNuevaFecha({ fecha: "", hora: "" });
    } catch (err) {
      Swal.fire("Error", "No se pudo reprogramar el turno", "error");
    }
  };

  // Generar bloques de 30 minutos
  const generarHorarios = () => {
    const bloques = [];
    for (let h = 8; h <= 15; h++) {
      ["00", "30"].forEach(min => {
        if (h === 15 && min === "30") return;
        bloques.push(`${h.toString().padStart(2, "0")}:${min}`);
      });
    }
    return bloques;
  };

  const hoy = new Date().toISOString().split("T")[0];
  const bloquesDisponibles = generarHorarios();

  return (
    <div className="mis-turnos-container">
      <div className="mis-turnos-card">
        <h2 className="mis-turnos-title">Mis Turnos</h2>

        {turnos.length === 0 ? (
          <p className="mis-turnos-message">No tenés turnos reservados.</p>
        ) : (
          <table className="mis-turnos-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Especialista</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map(t => (
                <tr key={t.idTurno}>
                  <td>{t.fechaTurno.replace("T", " ").slice(0, 16)}</td>
                  <td>{t.especialista?.nombre} {t.especialista?.apellido}</td>
                  <td>{t.estado}</td>
                  <td>
                    {(t.estado === "pendiente" || t.estado === "confirmado") && (
                      <>
                        <button onClick={() => cancelarTurno(t.idTurno)}>Cancelar</button>

                        {reprogramando === t.idTurno ? (
                          <>
                            <input
                              type="date"
                              value={nuevaFecha.fecha}
                              min={hoy}
                              onChange={e => {
                                const f = e.target.value;
                                const [y, m, d] = f.split("-").map(Number);
                                const dia = new Date(y, m - 1, d).getDay();
                                if (dia === 0 || dia === 6) {
                                  Swal.fire("Error", "No se pueden seleccionar sábados ni domingos", "error");
                                  setNuevaFecha(prev => ({ ...prev, fecha: "" }));
                                } else setNuevaFecha(prev => ({ ...prev, fecha: f }));
                              }}
                            />
                            <select
                              value={nuevaFecha.hora}
                              onChange={e => setNuevaFecha(prev => ({ ...prev, hora: e.target.value }))}
                            >
                              <option value="">Seleccione hora</option>
                              {bloquesDisponibles.map(h => (
                                <option key={h} value={h}>{h}</option>
                              ))}
                            </select>
                            <button onClick={() => guardarReprogramacion(t.idTurno)}>Guardar</button>
                            <button onClick={() => setReprogramando(null)}>Cancelar</button>
                          </>
                        ) : (
                          <button onClick={() => setReprogramando(t.idTurno)}>Reprogramar</button>
                        )}
                      </>
                    )}
                    {(t.estado !== "pendiente" && t.estado !== "confirmado") && <span>No hay acciones disponibles</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MisTurnos;
