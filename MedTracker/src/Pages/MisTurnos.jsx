// Componente MisTurnos: muestra los turnos del paciente en tiempo real.
// Permite cancelar o reprogramar solo si el turno está pendiente o confirmado.
// Se refresca cada 5 segundos para reflejar cambios hechos por el especialista.

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles/MisTurnos.css";

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  const [reprogramando, setReprogramando] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState("");

useEffect(() => {
  if (!usuario) return;

  const obtenerTurnos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/turno/paciente/${usuario.id}`);
        const data = await res.json();
        setTurnos(data);
      } catch (err) {
        console.error("Error cargando mis turnos:", err);
      }
    };

    // Llamada inicial
    obtenerTurnos();

    // Intervalo para refrescar cada 5 segundos
    const intervalId = setInterval(obtenerTurnos, 5000);

    // Cleanup: eliminar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);

  }, [usuario]);

  // -----------------------
  //   CANCELAR TURNO
  // -----------------------
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
      const res = await fetch(`http://localhost:3000/turno/${idTurno}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar");
      }

      Swal.fire("Turno cancelado", "", "success");

      // Eliminarlo de la lista
      setTurnos(turnos.filter(t => t.idTurno !== idTurno));

    } catch (err) {
      Swal.fire("Error", "No se pudo cancelar el turno", "error");
    }
  };

  // -----------------------
  //   REPROGRAMAR
  // -----------------------
  const guardarReprogramacion = async (idTurno) => {
    if (!nuevaFecha) {
      Swal.fire("Error", "Seleccioná una fecha y hora", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/turno/${idTurno}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fechaTurno: nuevaFecha })
      });

      if (!res.ok) throw new Error("Error al reprogramar");

      const updatedTurno = await res.json();

      Swal.fire("Turno reprogramado", "", "success");

      setTurnos(turnos.map(t =>
        t.idTurno === idTurno ? updatedTurno : t
      ));
      setReprogramando(null);
      setNuevaFecha("");

    } catch (err) {
      Swal.fire("Error", "No se pudo reprogramar el turno", "error");
    }
  };

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
                  <td>{new Date(t.fechaTurno).toLocaleString()}</td>
                  <td>{t.especialista?.nombre} {t.especialista?.apellido}</td>
                  <td>{t.estado}</td>
                  <td>
  {t.estado === "pendiente" || t.estado === "confirmado" ? (
    <>
      {/* BOTÓN CANCELAR */}
      <button onClick={() => cancelarTurno(t.idTurno)}>Cancelar</button>

      {/* BOTÓN REPROGRAMAR */}
      {reprogramando === t.idTurno ? (
        <>
          <input
            type="datetime-local"
            value={nuevaFecha}
            onChange={e => setNuevaFecha(e.target.value)}
          />
          <button onClick={() => guardarReprogramacion(t.idTurno)}>Guardar</button>
          <button onClick={() => setReprogramando(null)}>Cancelar</button>
        </>
      ) : (
        <button onClick={() => setReprogramando(t.idTurno)}>Reprogramar</button>
      )}
    </>
  ) : (
    <span>No hay acciones disponibles</span> // opcional
  )}
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
