import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegistroEspecialista from "./components/RegistroEspecialista";
import Login from "./components/Login";
import RegistroPaciente from "./components/RegistroPaciente";
import CargaEvolutivo from "./Pages/CargaEvolutivo";
import VerHC from "./Pages/VerHc";
import IndicacionMedica from "./Pages/IndicacionesMedicas";
import Home from "./components/Home";
import Contacto from "./components/Contacto";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
           <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro-especialista" element={<RegistroEspecialista />} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />
          <Route path="/verhc/:dniCargado" element={<VerHC />} />
          <Route path="/indicacion/:dniCargado" element={<IndicacionMedica />} />
          <Route path="/carga-evolutivo" element={<CargaEvolutivo/>} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
export default App;

