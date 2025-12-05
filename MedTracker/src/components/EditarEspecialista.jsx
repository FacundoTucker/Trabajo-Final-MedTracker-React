import "../styles/registro.css";
import FormEditarEspecialista from "./FormEditarEspecialista";
import registroImg from "../img/registroEspecialista.avif";

const EditarEspecialista = () => {
  return (
    <div className="contenedorRegistro">
      <div className="contenedorFormRegistro">
        <h2>EDITAR ESPECIALISTA</h2>
        <FormEditarEspecialista />
      </div>

      <div className="imagenLateralRegistro">
        <img src={registroImg} alt="Imagen especialista" />
      </div>
    </div>
  );
};

export default EditarEspecialista;
