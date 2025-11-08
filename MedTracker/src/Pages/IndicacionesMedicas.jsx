import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/carga.css";

export default function IndicacionMedica() {
  const { dniCargado } = useParams(); // obtengo el dni desde la URL
  const [paciente, setPaciente] = useState(null);
  const [indicacion, setIndicacion] = useState("");
  const printRef = useRef(); // referencia para imprimir

  useEffect(() => {
    if (!dniCargado) return;

    const pacientesRaw = localStorage.getItem("pacientesDePrueba");
    if (!pacientesRaw) return;

    const pacientes = JSON.parse(pacientesRaw);
    const encontrado = pacientes.find((p) => p.numeroDocumento === dniCargado);
    if (encontrado) setPaciente(encontrado);
  }, [dniCargado]);

  // Función para imprimir el div
  const imprimirDiv = () => {
    if (!printRef.current) return;

    const ventana = window.open("", "_blank");
    ventana.document.write(`
      <html>
        <head>
          <title>Imprimir</title>
          <link rel="stylesheet" href="../styles/carga.css">
          <style>
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printRef.current.outerHTML}
        </body>
      </html>
    `);
    ventana.document.close();
  };

  // Guardar indicación (puede extenderse para guardarla en localStorage)
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
    <main className="indicacionMedica">
      <div className="contenedorPrincipal2">
        <button onClick={imprimirDiv}>🖨️ Imprimir receta</button>
        <hr />

        <div id="recetario" className="recetario" ref={printRef}>
          {paciente ? (
            <>
              <div className="contenedorDatos2">
                <form id="formularioPacienteCargado2">
                  <label>Nombre y apellido:</label>
                  <input
                    type="text"
                    value={`${paciente.nombre} ${paciente.apellido}`}
                    readOnly
                  />

                  <label>DNI:</label>
                  <input type="text" value={paciente.numeroDocumento} readOnly />

                  <label>Domicilio:</label>
                  <input type="text" value={paciente.domicilio} readOnly />
                </form>
              </div>

              <div className="contenedorIndicacion2">
                <textarea
                  id="indicacion"
                  placeholder="Ingrese indicación"
                  value={indicacion}
                  onChange={(e) => setIndicacion(e.target.value)}
                />
              </div>
            </>
          ) : (
            <p>No se encontró el paciente.</p>
          )}
        </div>

        <button onClick={guardarIndicacion}>💾 GUARDAR INDICACIÓN</button>
      </div>
    </main>
  );
}
