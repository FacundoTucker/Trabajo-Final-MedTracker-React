/*FormularioPaciente.jsx*/
import "../styles/carga.css";

export default function FormularioPaciente({ paciente = {}, editable = false }) {
  return (
    <form className="formularioPaciente formDosColumnas">

        {/* Fila 1 */}
        <div>
          <label>Nombre y Apellido:</label>
          <input
            type="text"
            value={`${paciente?.nombre || ""} ${paciente?.apellido || ""}`}
            readOnly={!editable}
          />
        </div>

        <div>
          <label>DNI:</label>
          <input
            type="text"
            value={paciente.DNI || ""}
            readOnly={!editable}
          />
        </div>

        {/* Fila 2 */}
        <div>
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            value={paciente.fechaNacimiento || ""}
            readOnly={!editable}
          />
        </div>

        <div>
          <label>Teléfono:</label>
          <input
            type="tel"
            value={paciente.nroTelefono || ""}
            readOnly={!editable}
          />
        </div>

        {/* Fila 3  */}
        <div className="columnaCompleta">
          <label>Domicilio:</label>
          <input
            type="text"
            value={paciente.domicilio || ""}
            readOnly={!editable}
          />
        </div>

</form>

    
  );
}
