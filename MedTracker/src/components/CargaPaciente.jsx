import { useState } from "react";
import FormularioPaciente from "./FormularioPaciente";
import "../styles/carga.css";

export default function CargarPaciente({ onPacienteEncontrado }) {
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const handleBuscar = () => {
    const dni = dniBusqueda.trim();
    if (!dni) {
      setMensaje({ texto: "Por favor, ingrese un número de DNI para buscar.", tipo: "error" });
      setPaciente(null);
      onPacienteEncontrado?.(null);

      return;
    }

    const pacientesGuardadosRaw = localStorage.getItem("pacientesDePrueba");
    if (!pacientesGuardadosRaw) {
      setMensaje({ texto: "No hay datos de pacientes guardados localmente.", tipo: "error" });
      setPaciente(null);
      onPacienteEncontrado?.(null);

      return;
    }

    const pacientes = JSON.parse(pacientesGuardadosRaw);
    const encontrado = pacientes.find((p) => p.numeroDocumento === dni);

    if (encontrado) {
      setPaciente(encontrado);
      onPacienteEncontrado?.(encontrado);

      setMensaje({ texto: `Datos de "${encontrado.nombre} ${encontrado.apellido}" cargados.`, tipo: "exito" });
    } else {
      setPaciente(null);
      onPacienteEncontrado?.(null);

      setMensaje({ texto: `No se encontró ningún paciente con DNI: ${dni}`, tipo: "error" });
    }
  };

  return (
    <div className="contenedorPrincipal">
      <div className="dniBusqueda">
        <h2>Carga evolutivo</h2>
        <label>Ingresa un DNI registrado.</label>
        <input
          type="text"
          value={dniBusqueda}
          onChange={(e) => setDniBusqueda(e.target.value)}
          placeholder="Ej: 12345678"
        />
        <button onClick={handleBuscar}>Cargar Datos</button>

        {mensaje.texto && (
          <div className={`mensajeEstado ${mensaje.tipo}`}>{mensaje.texto}</div>
        )}
      </div>

      <hr />

      {/* Reutilizo datos */}
      {paciente && <FormularioPaciente paciente={paciente} editable={false} />
}

      <hr />
      <div className="fechaCarga">
        <h5>FECHA</h5>
        <input type="date" />
        <h5>HORA</h5>
        <input type="time" />
      </div>
    </div>
  );
}