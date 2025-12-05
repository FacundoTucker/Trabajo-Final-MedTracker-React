import "../styles/registro.css";
import FormEditarPaciente from "./FormEditarPaciente";
import registroImg from "../img/registroPaciente.avif";

const EditarPaciente = () => {
  return (
    <div className="contenedorRegistro">
      <div className="imagenLateralRegistro">
        <img src={registroImg} alt="Editar perfil paciente" />
      </div>

      <div className="contenedorFormRegistro">
        <h2>EDITAR PERFIL</h2>
        <FormEditarPaciente />
      </div>
    </div>
  );
};

export default EditarPaciente;
