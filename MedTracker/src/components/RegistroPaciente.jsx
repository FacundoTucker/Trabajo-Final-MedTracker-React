import "../styles/registro.css";
import FormPaciente from "./FormPaciente";
import registroImg from "../img/registroPaciente.avif";

const RegistroPaciente = () => {
  return (
    <div className="contenedorRegistro">
        <div className="imagenLateralRegistro">
            <img src={registroImg} alt="Imagen especialista" />
        </div>
      <div className="contenedorFormRegistro">
        <h2>REGISTRO DE PACIENTE</h2>
        <FormPaciente/>
      </div>
    </div>
  );
};

export default RegistroPaciente;