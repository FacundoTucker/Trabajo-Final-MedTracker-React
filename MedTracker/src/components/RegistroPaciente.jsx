import "../styles/registroEspecialista.css";
import FormPaciente from "./FormPaciente";
import registroImg from "../img/registroPaciente.avif";

const RegistroPaciente = () => {
  return (
    <div className="contenedorRegistro">
        <div className="imagenLateral">
            <img src={registroImg} alt="Imagen especialista" />
        </div>
      <div className="contenedorForm">
        <h2>REGISTRO DE PACIENTE</h2>
        <FormPaciente/>
      </div>
    </div>
  );
};

export default RegistroPaciente;