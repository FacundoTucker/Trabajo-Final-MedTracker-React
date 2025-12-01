//carga evolutivo
import CargarPaciente from "../components/CargaPaciente";
import "../styles/carga.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import VerHC from "./VerHc";



const CargaEvolutivo = () => {

  const [paciente, setPaciente] = useState(null);

  return (
    <>
           <div className="contenedorPrincipalVerHC">

            <CargarPaciente onPacienteEncontrado={setPaciente} />
            {paciente && (

            <div className="historiaGuardada">
              <Link to={`/verhc/${paciente.DNI}`}>
                📄 Ver Historia Clínica
              </Link>
              <Link to={`/indicacion/${paciente.DNI}`}>
                🩺 Nueva indicación médica
              </Link>
            </div>
            

          )}
          <div className="fechaCarga">
            <h5>FECHA</h5>
            <h5>HORA</h5>
              <input type="date" />            
              <input type="time" />
          </div>
          
      <div className="contenedorEvolutivo">
        <h5>EVOLUTIVO</h5>
        <textarea placeholder="Ingrese el evolutivo del paciente"></textarea>
        <button className="btnChico">Grabar</button>
      </div>
      </div>
    </>
  );
};
 
export default CargaEvolutivo;