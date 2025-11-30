//indicacionesMedicas
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/carga.css";
import fondoRecetario from "../img/recetario.png";

export default function IndicacionMedica() {
  const { dniCargado } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [indicacion, setIndicacion] = useState("");
  const printRef = useRef();

  useEffect(() => {
    if (!dniCargado) return;

    const pacientesRaw = localStorage.getItem("pacientesDePrueba");
    if (!pacientesRaw) return;

    const pacientes = JSON.parse(pacientesRaw);
    const encontrado = pacientes.find(
      (p) => p.numeroDocumento === dniCargado
    );
    if (encontrado) setPaciente(encontrado);
  }, [dniCargado]);

  // IMPRIMIR

  // Convierte la imagen importada a Base64 para que cargue en la impresión
const convertirImagenABase64 = (url) => {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const lector = new FileReader();
          lector.onloadend = () => resolve(lector.result);
          lector.readAsDataURL(blob);
        })
    );
};

  const imprimirDiv = async () => {
  if (!printRef.current) return;

  const contenido = printRef.current.innerHTML;
  const ventana = window.open("", "_blank");

  // Convertimos la imagen importada a Base64
  const fondoBase64 = await convertirImagenABase64(fondoRecetario);

  ventana.document.write(`
    <html>
  <head>
    <title>Imprimir receta</title>
    <style>
      body {
        margin: 10;
        padding: 0;
      }

      /* Fondo fijo */
      #recetaFondo {
        position: absolute;
        border:solid #000000 1px;
        top: 0;
        left: 0;
        width: 550px;
        height: 781px;
        z-index: -1;
      }

      .recetarioPrint {
        position: relative;
        width: 550px;
        height: 781px;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
      }

      /* ==========================
         DATOS DEL PACIENTE
      ========================== */
      .bloqueDatos {
          position: absolute;
          top: 30px; 
          left: 70px; 
          width: 420px; 
          display: grid;
          grid-template-columns: 1fr;
          font-size: 20px;
          color: #000;
          gap: 10px; 
        }

        .bloqueDatos .item {
          display: flex;
          flex-direction: column;
          align-items: flex-end; 
        }

        .bloqueDatos .item label {
          font-weight: bold;
          margin-bottom: 5px;
        }

      /* ==========================
         INDICACIÓN MÉDICA
      ========================== */
      .bloqueIndicacion {
        position: absolute;
        top: 290px; 
        left: 100px; 
        width: 430px;
        height: 350px; 
        font-size: 20px;
        color: #000;
        overflow: hidden;
      }
      .bloqueDatos, .bloqueIndicacion {
        box-sizing: border-box;
}

    </style>
  </head>

  <body onload="window.print(); window.close();">
    <div class="recetarioPrint">
      <img id="recetaFondo" src="${fondoBase64}" />

      <!-- DATOS DEL PACIENTE -->
      <div class="bloqueDatos">
        <div class="item nombre">
        <label>Nombre y Apellido:</label>
          ${paciente ? `${paciente.nombre} ${paciente.apellido}` : ""}
        </div>
        <div class="item dni">
          <label>DNI:</label>
          ${paciente ? paciente.numeroDocumento : ""}
        </div>
        <div class="item domicilio">
          <label>Domicilio:</label>
          ${paciente ? paciente.domicilio : ""}
        </div>
      </div>

      <!-- INDICACIÓN MÉDICA -->
      <div class="bloqueIndicacion">
        ${indicacion ? indicacion.replace(/\n/g, "<br>") : ""}
      </div>
    </div>
  </body>
</html>
  `);

  ventana.document.close();
};


  // GUARDAR
  const guardarIndicacion = () => {
    if (!paciente) return;

    const nuevasIndicaciones = JSON.parse(
      localStorage.getItem("indicacionesMedicas") || "[]"
    );

    nuevasIndicaciones.push({
      dni: paciente.numeroDocumento,
      texto: indicacion,
      fecha: new Date().toLocaleString(),
    });

    localStorage.setItem(
      "indicacionesMedicas",
      JSON.stringify(nuevasIndicaciones)
    );

    alert("✅ Indicación guardada correctamente");
    setIndicacion("");
  };

  return (
    <div className="contenedorPrincipal2">
      <button className="botonCarga" onClick={imprimirDiv}>🖨️ Imprimir receta</button>
      <hr />

      {/* RECETARIO */}
      <div id="recetario" className="recetario" ref={printRef}
        style={{ backgroundImage: `url(${fondoRecetario})` }}> {paciente ? (
      <>
            {/* CAMPOS POSICIONADOS SOBRE EL FONDO */}
      <label className="labelCarga">Nombre y Apellido:</label>
      <input className="campoReceta campoNombre" type="text" readOnly
        value={`${paciente.nombre} ${paciente.apellido}`} />
      <label className="labelCarga">DNI:</label>
       <input className="campoReceta campoDni" type="text" readOnly
        value={paciente.numeroDocumento} />
      <label className="labelCarga">Domicilio:</label>
      <input className="campoReceta campoDomicilio" type="text" readOnly
        value={paciente.domicilio} />

      <textarea className="campoReceta campoIndicacion"
        value={indicacion} onChange={(e) => setIndicacion(e.target.value)} ></textarea>
      </>
        ) : (
          <p>No se encontró el paciente.</p>
        )}
      </div>

      <button className="botonCarga" onClick={guardarIndicacion}>💾 GUARDAR INDICACIÓN</button>
    </div>
  );
}
