import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RegistroEspecialista from "./components/RegistroEspecialista";
import Login from "./components/Login";
import RegistroPaciente from "./components/RegistroPaciente";
import CargaEvolutivo from "./Pages/CargaEvolutivo";
import VerHC from "./Pages/VerHc";
import IndicacionMedica from "./Pages/IndicacionesMedicas";
import Home from "./components/Home";
import Contacto from "./components/Contacto";
import MisTurnos from "./Pages/MisTurnos";
import SolicitarTurno from "./Pages/SolicitarTurno";
import TurnosEspecialista from "./Pages/TurnosEspecialista";
import EditarPaciente from "./components/EditarPaciente";
import EditarEspecialista from "./components/EditarEspecialista";

import DashboardPaciente from "./Pages/DashboardPaciente";
import DashboardEspecialista from "./Pages/DashboardEspecialista";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar/>
      <main>
        <Routes>
           <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro-especialista" element={<RegistroEspecialista />} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />
          <Route path="/verhc/:dniCargado" element={<VerHC />} />
          <Route path="/editar-paciente" element={<EditarPaciente />} />
          <Route path="/editar-especialista" element={<EditarEspecialista />} />
          <Route path="/indicacion/:dniCargado" element={<IndicacionMedica />} />
          <Route path="/carga-evolutivo" element={<CargaEvolutivo/>} />
          <Route path="/contacto" element={<Contacto />} />

          <Route path="/mis-turnos" element={<MisTurnos/>} />
          <Route path="/solicitar-turno" element={<SolicitarTurno/>} />
          <Route path="/turnos-especialista" element={<TurnosEspecialista/>} />

          <Route path="/dashboard-paciente" element={<DashboardPaciente />} />
          <Route path="/dashboard-especialista" element={<DashboardEspecialista />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
