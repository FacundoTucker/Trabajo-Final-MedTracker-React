import CargarPaciente from "../components/CargaPaciente";
import "../styles/carga.css";
import { useState, useEffect } from "react";

const CargaEvolutivo = () => {
  const [paciente, setPaciente] = useState(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [texto, setTexto] = useState("");
  const [especialista, setEspecialista] = useState(null);

  // usuarioActivo en local
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  const idEspecialista = usuario?.id;

  // datos completos
  useEffect(() => {
    const obtenerEspecialista = async () => {
      if (!idEspecialista) return;

      try {
        const resp = await fetch(`http://localhost:3000/especialista/${idEspecialista}`);
        const datos = await resp.json();
        setEspecialista(datos);
      } catch (error) {
        console.error("Error al obtener especialista:", error);
      }
    };

    obtenerEspecialista();
  }, []);

  const grabarEvolutivo = async () => {
    if (!paciente) {
      alert("Primero buscá un paciente");
      return;
    }

    if (!fecha || !hora || !texto.trim()) {
      alert("Completá fecha, hora y evolutivo");
      return;
    }

    const fechaHora = new Date(`${fecha}T${hora}`);

    const fechaLegible = `${fecha.split("-").reverse().join("/")} ${hora}`;

    const descripcionFinal = `Dr. ${especialista?.apellido} ${especialista?.nombre} - ${fechaLegible} - ${texto}`;

    try {
      const res = await fetch("http://localhost:3000/evolutivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idHistoriaClinica: paciente.idPaciente,
          descripcion: descripcionFinal,
          fecha: fechaHora,
        }),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      alert("Evolutivo guardado");
      setTexto("");
    } catch (err) {
      alert("No se pudo guardar");
      console.error(err);
    }
  };

  return (
    <>
      <div className="contenedorEvolutivoPrincipal">
        <CargarPaciente onPacienteEncontrado={setPaciente} />

      <hr />
      <hr />


        <div className="fechaCarga">
          <h5>FECHA</h5>
          <h5>HORA</h5>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </div>

        <div className="contenedorEvolutivo">
          <h5>EVOLUTIVO</h5>
          <textarea
            placeholder="Ingrese el evolutivo del paciente"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          ></textarea>

          <button className="btnChico" onClick={grabarEvolutivo}>
            Grabar
          </button>
        </div>
      </div>
    </>
  );
};

export default CargaEvolutivo;
