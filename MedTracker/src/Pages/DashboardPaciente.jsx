import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/DashboardPaciente.css";
import Navbar from "../components/Navbar";

export default function DashboardPaciente() {
  const [nombre, setNombre] = useState("");
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    // Obtener datos del usuario logueado
    const user = JSON.parse(localStorage.getItem("usuarioActivo") || "{}");
    setNombre(user.nombre || "Usuario");

    // TURNOS SIMULADOS - Para que no quede vacío
    const turnosSimulados = [
      {
        id: "sim1",
        especialista: "Dra. Sánchez",
        especialidad: "Cardiología",
        fecha: "22/06/2025",
        hora: "10:30",
        estado: "Simulado",
      },
      {
        id: "sim2",
        especialista: "Dr. Gómez",
        especialidad: "Clínica",
        fecha: "30/06/2025",
        hora: "15:00",
        estado: "Simulado",
      },
    ];

    // Cargamos primero los simulados
    setTurnos(turnosSimulados);

    if (!user?.id) return;

    
    // TRAER TURNOS REALES DESDE EL BACKEND
    fetch(`https://trabajo-final-medtracker.onrender.com/turno/paciente/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const turnosFormateados = data.map(t => ({
            id: t.idTurno,
            especialista: `${t.especialista?.nombre} ${t.especialista?.apellido}`,
            especialidad: t.especialista?.especialidad || "No asignada",
            fecha: new Date(t.fechaTurno).toLocaleDateString(),
            hora: new Date(t.fechaTurno).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            estado: t.estado
          }));
            // Combinar los simulados con los reales
          setTurnos(prev => [...prev, ...turnosFormateados]); // concatenar con simulados
        }
      })
      .catch(err => console.error("Error al traer turnos reales:", err));
  }, []);

  // TURNOS PASADOS
   const fechaAhora = new Date();

  const turnosPasados = turnos.filter(t => {
    if (!t.fecha || !t.hora) return false;
    const [dia, mes, anio] = t.fecha.split("/");
    const fechaCompleta = new Date(`${anio}-${mes}-${dia}T${t.hora}`);

    return fechaCompleta < fechaAhora;
  });

  return (
      <div className="dashboard-container">

        {/* PROXIMOS TURNOS */}
        <section className="section">
          <h3>📅 Próximos turnos</h3>

          <div className="turnos-grid">
            {turnos.map((turno) => (
              <div className="turno-card" key={turno.id}>
                <h4>{turno.especialista}</h4>
                <p>{turno.especialidad}</p>
                <p>📆 {turno.fecha}</p>
                <p>🕒 {turno.hora}</p>
                <span className={`estado ${turno.estado.toLowerCase()}`}>
                  {turno.estado}
                </span>
              </div>
            ))}

            {turnos.length === 0 && (
              <p>No tenés turnos programados.</p>
            )}
          </div>
        </section>


        {/* ACCESOS RAPIDOS */}
<section className="section">
  <h3>⚡ Accesos rápidos</h3>

  <div className="acciones-grid">
    <Link to="/solicitar-turno" className="accion-card">
      <h4>Solicitar turno</h4>
      <p>Elegí especialista y fecha</p>
    </Link>

    <Link to="/mis-turnos" className="accion-card">
      <h4>Mis turnos</h4>
      <p>Ver lista completa</p>
    </Link>

  </div>
</section>


        {/* HISTORIAL */}
        <section className="section">
          <h3>🗂 Últimos turnos</h3>

          <div className="historial">
            {turnosPasados.length === 0 ? (
              <p>No tenés turnos anteriores.</p>
            ) : (
              turnosPasados.map(t => (
                <p key={t.id}>{t.fecha} - {t.especialidad} ({t.especialista})</p>
              ))
            )}
          </div>
        </section>

      </div>
  );
}
