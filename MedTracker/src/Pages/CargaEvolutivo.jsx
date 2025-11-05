import CargarPaciente from "../components/CargaPaciente";
import "../styles/carga.css";
import { useState } from "react";

import { Link } from "react-router-dom";
import VerHC from "./VerHc";



const CargaEvolutivo = () => {

  const [paciente, setPaciente] = useState(null);

  return (
    <>
      <main>
            <CargarPaciente onPacienteEncontrado={setPaciente} />
            {paciente && (

            <div className="historiaGuardada">
              <Link to={`/verhc/${paciente.numeroDocumento}`}>
                📄 Ver Historia Clínica
              </Link>
            </div>
            

          )}
          
      <div className="contenedorEvolutivo">
        <h5>EVOLUTIVO</h5>
        <textarea placeholder="Ingrese el evolutivo del paciente"></textarea>
        <button>GRABAR</button>
      </div>
      </main>
    </>
  );
};
 
export default CargaEvolutivo;