import { useEffect, useState } from "react";
import "../styles/TurnosEspecialista.css";

const TurnosEspecialista = () => {
  const especialista = JSON.parse(localStorage.getItem("usuarioActivo") ?? "null");

  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("");


  //FUNCIÓN PARA CARGAR TURNOS

  const obtenerTurnos = () => {
    if (!especialista) return;

    fetch(`https://trabajo-final-medtracker.onrender.com/especialista/${especialista.id}/turnos`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Turnos recibidos:", data);
        setTurnos(data);
      })
      .catch((err) => console.error("Error cargando turnos:", err))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    obtenerTurnos();
  }, [especialista]);

  
  //FUNCIÓN PARA ACTUALIZAR EL ESTADO DEL TURNO=
  const actualizarEstado = async (idTurno, nuevoEstado) => {
    try {
      await fetch(`https://trabajo-final-medtracker.onrender.com/turno/${idTurno}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      // Volvemos a cargar la lista de turnos actualizada
      obtenerTurnos();
    } catch (error) {
      console.error("Error al actualizar estado", error);
    }
  };

  // FLTRAR TURNOS
  const turnosFiltrados = filtroEstado
    ? turnos.filter(
        (t) => t.estado.toLowerCase() === filtroEstado.toLowerCase()
      )
    : turnos;

  return (
    <div className="turnos-especialista-container">
      <h2>Mis Turnos</h2>

      {cargando && <p>Cargando turnos...</p>}

      {!cargando && turnos.length === 0 && (
        <p>No tenés turnos asignados.</p>
      )}

      {!cargando && turnos.length > 0 && (
        <>
          {/* FILTRO ARRIBA */}
          <div className="filtros-turnos">
            <label>
              Filtrar por estado:{" "}
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="Reservado">Reservado</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </label>
          </div>

          <ul className="lista-turnos-esp">
            {turnosFiltrados.map((t) => (
              <li
                key={t.idTurno}
                className={`item-turno-esp estado-${t.estado?.toLowerCase()}`}
              >
                <strong>
                  {new Date(t.fechaTurno).toLocaleString("es-AR")}
                </strong>
                <div className="turno-info">
                  <p>
                    Paciente:{" "}
                    {t.paciente
                      ? `${t.paciente.nombre} ${t.paciente.apellido}`
                      : `${t.paciente_nombre || ""} ${t.paciente_apellido || ""}`}
                  </p>
                </div>
                <p>Estado: {t.estado}</p>

                {/* BOTONES CONFIRMAR / RECHAZAR SOLO SI EL TURNO ESTÁ PENDIENTE */}
                {(t.estado === "pendiente" || t.estado === "Reservado") && (
                  <div className="btn-container">
                    <button
                      className="btn-confirmar"
                      onClick={() => actualizarEstado(t.idTurno, "Confirmado")}
                    >
                      Confirmar
                    </button>

                    <button
                      className="btn-rechazar"
                      onClick={() => actualizarEstado(t.idTurno, "Rechazado")}
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TurnosEspecialista;
