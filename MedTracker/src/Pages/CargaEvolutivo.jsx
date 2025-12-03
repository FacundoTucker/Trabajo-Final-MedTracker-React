//carga evolutivo
import CargarPaciente from "../components/CargaPaciente";
import "../styles/carga.css";
import { useState } from "react";



const CargaEvolutivo = () => {

  const [paciente, setPaciente] = useState(null);

  return (
    <>
           <div className="contenedorEvolutivoPrincipal">
            <CargarPaciente onPacienteEncontrado={setPaciente} />
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