import "../styles/registro.css";
import FormEspecialista from "./FormEspecialista";
import registroImg from "../img/registroEspecialista.avif";

const RegistroEspecialista = () => {
  return (
    <div className="contenedorRegistro">
      <div className="contenedorFormRegistro">
        <h2>REGISTRO DE ESPECIALISTA</h2> 
        <FormEspecialista/>
      </div>

      <div className="imagenLateralRegistro">
        <img src={registroImg} alt="Imagen especialista" />
      </div>
    </div>
  );
};

export default RegistroEspecialista;

