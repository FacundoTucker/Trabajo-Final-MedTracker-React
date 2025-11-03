export default function FormularioPaciente({ paciente }) {
  return (
    <div className="contenedorDatos">
      <h3>Información del Paciente</h3>
      <form>
        <label>Nombre:</label>
        <input type="text" value={paciente.nombre} readOnly />

        <label>Apellido:</label>
        <input type="text" value={paciente.apellido} readOnly />

        <label>DNI:</label>
        <input type="text" value={paciente.numeroDocumento} readOnly />

        <label>Fecha de Nacimiento:</label>
        <input type="date" value={paciente.fechaNacimiento} readOnly />

        <label>N° de Teléfono:</label>
        <input type="tel" value={paciente.telefono} readOnly />

        <label>Domicilio:</label>
        <input type="text" value={paciente.domicilio} readOnly />

        <div className="historiaGuardada">
          <a
            href={`../pages/indicacionMedica.html?dniCargado=${paciente.numeroDocumento}`}
          >
            📝 Indicaciones médicas
          </a>
          <a
            href={`../pages/verHC.html?dniCargado=${paciente.numeroDocumento}`}
          >
            📝 Ver evolutivos previos
          </a>
        </div>
      </form>
    </div>
  );
}