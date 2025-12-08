import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FormularioPaciente from "../components/FormularioPaciente";
import "../styles/carga.css";

export default function VerHC() {
  const [paciente, setPaciente] = useState(null);
  const [historia, setHistoria] = useState(null);
  const [evolutivos, setEvolutivos] = useState([]);
  const [indicaciones, setIndicaciones] = useState([]);
  const { dniCargado } = useParams();

  useEffect(() => {
    if (!dniCargado) return;

    fetch(`http://localhost:3000/paciente/dni/${dniCargado}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setPaciente(data);

        return fetch(
          `http://localhost:3000/historia-clinica/paciente/${data.idPaciente}`
        );
      })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((dataHistoria) => {
        setHistoria(dataHistoria);
        setIndicaciones(dataHistoria.indicaciones || []);
         fetch("http://localhost:3000/evolutivo")
      .then((r) => r.json())
      .then((todos) => {
        const filtrados = todos.filter(
          (e) => e.idHistoriaClinica === dataHistoria.idHistoriaClinica
        );

        filtrados.sort((a, b) => b.idEvolutivo - a.idEvolutivo);

        setEvolutivos(filtrados);
      });
      })
      .catch(() => {
        setPaciente(null);
        setHistoria(null);
        setIndicaciones([]);
      });
  }, [dniCargado]);

  return (
    <div className="contenedorPrincipalVerHC">
      <h2 className="tituloCarga">Historia Clínica</h2>
      <hr />
      <div className="contenedorDatosVerHC">
        {paciente ? (
          <FormularioPaciente paciente={paciente} editable={false} />
        ) : (
          <p>No se encontró información del paciente.</p>
        )}
      </div>

      <hr />
      <hr />

      <h2 className="tituloCarga">Evolutivos</h2>

      {evolutivos.length === 0 ? (
        <p>No hay evolutivos cargados aún.</p>
      ) : (
        evolutivos.map((evo) => (
          <div key={evo.idEvolutivo} className="evolutivoVerHC">
            <div className="fechaHora">
              🕒 Cargado: {new Date(evo.fecha).toLocaleDateString("es-AR")}
            </div>

            <p className="texto">
              Evolucionado: {evo.descripcion}
            </p>

          </div>
        ))
      )}
      <hr />
      <hr />  

      <h2 className="tituloCarga">Indicaciones médicas</h2>

      {indicaciones.length === 0 ? (
        <p>No hay indicaciones médicas cargadas aún.</p>
      ) : (
        indicaciones.map((indi) => (
          <div key={indi.idIndicacionMedica} className="evolutivoVerHC">
            <div className="fechaHora">
              📅 {indi.fecha?.slice(0, 10)}
            </div>
            <p className="texto">{indi.descripcion}</p>
          </div>
        ))
      )}
    </div>
  );
}
