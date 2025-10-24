import "../styles/registroEspecialista.css";
import FormEspecialista from "./FormEspecialista";
import registroImg from "../img/registroEspecialista.avif";

const RegistroEspecialista = () => {
  return (
    <div className="contenedorRegistro">
      <div className="contenedorForm">
        <h2>REGISTRO DE ESPECIALISTA</h2>
        <FormEspecialista/>
      </div>

      <div className="imagenLateral">
        <img src={registroImg} alt="Imagen especialista" />
      </div>
    </div>
  );
};

export default RegistroEspecialista;

