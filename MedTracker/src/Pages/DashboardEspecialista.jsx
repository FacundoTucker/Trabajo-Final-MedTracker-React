import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/DashboardEspecialista.css";

export default function DashboardEspecialista() {
  const [especialista, setEspecialista] = useState(""); // Nombre del especialista activo
  const [turnos, setTurnos] = useState([]); // Lista de turnos (simulados + reales)


  // useEffect para cargar DATOS
  useEffect(() => {
    // Obtener el usuario activo desde el localStorage
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo") || "{}");
    setEspecialista(usuario.nombre || "Especialista"); // Si no existe nombre, aparece "Especialista"

    // TURNOS SIMULADOS - PARA QUE NO QUEDE VACIO
    const turnosSimulados = [
      { id: "sim1", paciente: "Facundo", fechaTurno: "2026-06-22T10:30", estado: "Confirmado" },
      { id: "sim2", paciente: "Leando", fechaTurno: "2026-06-30T15:00", estado: "Pendiente" },
      { id: "sim3", paciente: "Nacho", fechaTurno: "2026-07-02T09:00", estado: "Confirmado" },
    ];

    // PRIMERO LOS TURNOS SIMULADOS
    setTurnos(turnosSimulados);

   // Si no hay usuario activo, salimos
    if (!usuario?.id) return;

   // TRAEMOS LOS TURNOS REALES
    fetch(`https://trabajo-final-medtracker.onrender.com/especialista/${usuario.id}/turnos`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
// Formateamos los turnos recibidos para que tengan la misma estructura que los simulados 
          const turnosFormateados = data.map(t => ({
            id: t.idTurno,
            paciente: t.paciente
              ? `${t.paciente.nombre} ${t.paciente.apellido}`
              : `${t.paciente_nombre || ""} ${t.paciente_apellido || ""}`,
            fechaTurno: t.fechaTurno,
            estado: t.estado,
          }));

          // QUE APAREZAN AMBOS TIPOS DE TURNOS
          setTurnos(prev => {
            const idsPrevios = new Set(prev.map(t => t.id));
            const nuevos = turnosFormateados.filter(t => !idsPrevios.has(t.id));
            return [...prev, ...nuevos];
          });
        }
      })
      .catch(err => console.error("Error al traer turnos reales:", err));
  }, []);

  const fechaAhora = new Date();
    // Turnos que ya pasaron
  const turnosPasados = turnos.filter(t => new Date(t.fechaTurno) < fechaAhora);

    // Turnos próximos
  const turnosFuturos = turnos.filter(t => new Date(t.fechaTurno) >= fechaAhora);

  return (
    <div className="dashboard-container">
      <h2>Hola, {especialista}</h2>

      {/* Próximos turnos */}
      <section className="section">
        <h3>📅 Próximos turnos</h3>
        <div className="turnos-grid">
          {turnosFuturos.map(t => (
            <div className="turno-card" key={t.id}>
              <h4>{t.paciente}</h4>
              <p>📆 {new Date(t.fechaTurno).toLocaleDateString()}</p>
              <p>🕒 {new Date(t.fechaTurno).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <span className={`estado ${t.estado.toLowerCase()}`}>{t.estado}</span>
            </div>
          ))}
          {turnosFuturos.length === 0 && <p>No hay turnos programados.</p>}
        </div>
      </section>

      {/* Acciones rápidas */}
      <section className="section">
        <h3>⚡ Acciones rápidas</h3>
        <div className="acciones-grid">
          <Link to="/carga-evolutivo" className="accion-card">
            <h4>Cargar evolutivo</h4>
            <p>Registrar evolución del paciente</p>
          </Link>
          <Link to="/verhc/:dniCargado"className="accion-card">
            <h4>Ver historia clínica</h4>
            <p>Acceder a datos del paciente</p>
          </Link>
          <Link to="/indicacion/:dniCargado"className="accion-card">
            <h4>Nueva indicación</h4>
            <p>Prescribir tratamiento</p>
          </Link>
        </div>
      </section>

      {/* Últimos pacientes atendidos */}
      <section className="section">
        <h3>📚 Últimos pacientes atendidos</h3>
        <div className="historial">
          {turnosPasados.length === 0 ? (
            <p>No hay pacientes anteriores.</p>
          ) : (
            turnosPasados.map(t => (
              <p key={t.id}>{new Date(t.fechaTurno).toLocaleDateString()} - {t.paciente} ({t.estado})</p>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
