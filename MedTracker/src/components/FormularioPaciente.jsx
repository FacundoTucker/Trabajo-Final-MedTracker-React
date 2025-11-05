import "../styles/carga.css";

export default function FormularioPaciente({ paciente = {}, editable = false }) {
  return (
    <form className="formularioPaciente">
      <label htmlFor="nombreCargado">Nombre:</label>
      <input
        type="text"
        id="nombreCargado"
        value={paciente.nombre || ""}
        readOnly={!editable}
      />

      <label htmlFor="apellidoCargado">Apellido:</label>
      <input
        type="text"
        id="apellidoCargado"
        value={paciente.apellido || ""}
        readOnly={!editable}
      />

      <label htmlFor="dniCargado">DNI:</label>
      <input
        type="text"
        id="dniCargado"
        value={paciente.numeroDocumento || ""}
        readOnly={!editable}
      />

      <label htmlFor="fechaNacimientoCargada">Fecha de Nacimiento:</label>
      <input
        type="date"
        id="fechaNacimientoCargada"
        value={paciente.fechaNacimiento || ""}
        readOnly={!editable}
      />

      <label htmlFor="telefonoCargado">Teléfono:</label>
      <input
        type="tel"
        id="telefonoCargado"
        value={paciente.telefono || ""}
        readOnly={!editable}
      />

      <label htmlFor="domicilioCargado">Domicilio:</label>
      <input
        type="text"
        id="domicilioCargado"
        value={paciente.domicilio || ""}
        readOnly={!editable}
      />
      
    </form>
    
  );
}
