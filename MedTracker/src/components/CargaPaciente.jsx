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
      setMensaje({
        texto: "Por favor, ingrese un número de DNI para buscar.",
        tipo: "error"
      });
      setPaciente(null);
      onPacienteEncontrado?.(null);
      return;
    }

    fetch(`http://localhost:3000/paciente/dni/${dni}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setPaciente(data);
        onPacienteEncontrado?.(data);

        localStorage.setItem("pacienteActual", JSON.stringify(data));

        setMensaje({
          texto: `Datos de "${data.nombre} ${data.apellido}" cargados.`,
          tipo: "exito"
        });
      })
      .catch(() => {
        setPaciente(null);
        onPacienteEncontrado?.(null);

        setMensaje({
          texto: `No se encontró ningún paciente con DNI: ${dni}`,
          tipo: "error"
        });
      });
  };

  return (
    <div className="contenedorPrincipalCargaEvolutivo">
      <div className="dniBusqueda">
        <h2 className="tituloCarga">Carga de Paciente</h2>
        <label className="labelCarga">Ingresa un DNI registrado.</label>
        <input
          className="variosCarga"
          type="text"
          value={dniBusqueda}
          onChange={(e) => setDniBusqueda(e.target.value)}
          placeholder="Ej: 12345678"
        />
        <button className="btnChico" onClick={handleBuscar}>
          Cargar Datos
        </button>

        {mensaje.texto && (
          <div className={`mensajeEstado ${mensaje.tipo}`}>{mensaje.texto}</div>
        )}
      </div>

      <hr />

      {paciente && <FormularioPaciente paciente={paciente} editable={false} />}

    </div>
  );
}
