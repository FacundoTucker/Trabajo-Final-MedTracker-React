import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FormularioPaciente from "../components/FormularioPaciente";
import "../styles/carga.css";

export default function VerHC() {
  const [paciente, setPaciente] = useState(null);
  const { dniCargado } = useParams(); // obtenemos el parámetro de la URL

  useEffect(() => {
  if (!dniCargado) return;

  fetch(`http://localhost:3000/paciente/dni/${dniCargado}`) .then(r => {
  if (!r.ok) throw new Error();
  return r.json();
  })
  .then(data => setPaciente(data))
  .catch(() => setPaciente(null));

  }, [dniCargado]);

  return (
      <div className="contenedorPrincipalVerHC">
        <div className="contenedorDatosVerHC">
          {paciente ? (
            <FormularioPaciente paciente={paciente} editable={false} />
          ) : (
            <p>No se encontró información del paciente.</p>
          )}
        </div>

        <hr />

        {/* Datos simulados de evolutivos */}
        <div className="evolutivoVerHC">
          <div className="fechaHora">📅 2025-06-18 | 🕐 10:30</div>
          <p className="texto">
            Paciente con omalgia postraumática. Se indica RNM, FKT, reposo y AINES.
          </p>
        </div>

        <div className="evolutivoVerHC">
          <div className="fechaHora">📅 2025-06-15 | 🕐 14:10</div>
          <p className="texto">
            Control POP ok, herida seca. Buena evolución.
          </p>
        </div>
      </div>
  );
}
