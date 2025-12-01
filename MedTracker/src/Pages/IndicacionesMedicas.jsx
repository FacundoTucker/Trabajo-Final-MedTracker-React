import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/carga.css";
import fondoRecetario from "../img/recetario.png";
import Swal from "sweetalert2";

export default function IndicacionMedica() {
  const { dniCargado } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [historia, setHistoria] = useState(null);
  const [indicacion, setIndicacion] = useState("");
  const printRef = useRef();

  useEffect(() => {
    if (!dniCargado) return;

    fetch(`http://localhost:3000/paciente/dni/${dniCargado}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((dataPaciente) => {
        setPaciente(dataPaciente);

        return fetch(
          `http://localhost:3000/historia-clinica/paciente/${dataPaciente.idPaciente}`
        );
      })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((historiaData) => {
        setHistoria(historiaData);
      })
      .catch(() => {
        setPaciente(null);
        setHistoria(null);
      });
  }, [dniCargado]);

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

    const ventana = window.open("", "_blank");
    const fondoBase64 = await convertirImagenABase64(fondoRecetario);

    ventana.document.write(`
      <html>
      <head>
        <title>Imprimir receta</title>
        <style>
          body { margin: 10; padding: 0; }
          #recetaFondo {
            position: absolute;
            border:solid #000000 1px;
            top: 0; left: 0;
            width: 550px; height: 781px;
            z-index: -1;
          }
          .recetarioPrint {
            position: relative;
            width: 550px; height: 781px;
            font-family: Arial, sans-serif;
          }
          .bloqueDatos {
            position: absolute;
            top: 30px; left: 70px;
            width: 420px;
            display: grid;
            grid-template-columns: 1fr;
            font-size: 20px;
            gap: 10px;
          }
          .item { display: flex; flex-direction: column; align-items: flex-end; }
          .item label { font-weight: bold; margin-bottom: 5px; }
          .bloqueIndicacion {
            position: absolute;
            top: 290px; left: 100px;
            width: 430px; height: 350px;
            font-size: 20px; overflow: hidden;
          }
        </style>
      </head>

      <body onload="window.print(); window.close();">
        <div class="recetarioPrint">
          <img id="recetaFondo" src="${fondoBase64}" />

          <div class="bloqueDatos">
            <div class="item"><label>Nombre y Apellido:</label> ${paciente ? `${paciente.nombre} ${paciente.apellido}` : ""}</div>
            <div class="item"><label>DNI:</label> ${paciente ? paciente.DNI : ""}</div>
            <div class="item"><label>Domicilio:</label> ${paciente ? paciente.domicilio : ""}</div>
          </div>

          <div class="bloqueIndicacion">
            ${indicacion ? indicacion.replace(/\n/g, "<br>") : ""}
          </div>
        </div>
      </body>
      </html>
    `);

    ventana.document.close();
  };

  const guardarIndicacion = async () => {
    if (!historia) {
      alert("❌ No hay historia clínica asociada al paciente.");
      return;
    }

    try {
      const resp = await fetch("http://localhost:3000/indicacion-medica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: indicacion,
          idHistoriaClinica: historia.idHistoriaClinica,
          fecha: new Date().toISOString()
        }),
      });

      if (!resp.ok) throw new Error();

      Swal.fire({
      icon: "success",
      title: "Indicación guardada",
      text: "✔ La indicación médica fue registrada correctamente.",
      confirmButtonColor: "#00acdb",
    });
      setIndicacion("");

    } catch (err) {
      Swal.fire({
      icon: "error",
      title: "Error al guardar",
      text: "❌ Ocurrió un error al intentar guardar la indicación. ",
      confirmButtonColor: "#00acdb",
    });
    }
  };

  return (
    <div className="contenedorPrincipal2">
      <button className="botonCarga" onClick={imprimirDiv}>
        🖨️ Imprimir receta
      </button>

      <hr />

      <div
        id="recetario"
        className="recetario"
        ref={printRef}
        style={{ backgroundImage: `url(${fondoRecetario})` }}
      >
        {paciente ? (
          <>
            <label className="labelCarga">Nombre y Apellido:</label>
            <input
              className="campoReceta campoNombre"
              type="text"
              readOnly
              value={`${paciente.nombre} ${paciente.apellido}`}
            />

            <label className="labelCarga">DNI:</label>
            <input
              className="campoReceta campoDni"
              type="text"
              readOnly
              value={paciente.DNI}
            />

            <label className="labelCarga">Domicilio:</label>
            <input
              className="campoReceta campoDomicilio"
              type="text"
              readOnly
              value={paciente.domicilio}
            />

            <textarea
              className="campoReceta campoIndicacion"
              value={indicacion}
              onChange={(e) => setIndicacion(e.target.value)}
            ></textarea>
          </>
        ) : (
          <p>No se encontró el paciente.</p>
        )}
      </div>

      <button className="botonCarga" onClick={guardarIndicacion}>
        💾 GUARDAR INDICACIÓN
      </button>
    </div>
  );
}
