import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegistroEspecialista from "./components/RegistroEspecialista";
import Login from "./components/Login";
import RegistroPaciente from "./components/RegistroPaciente";
import CargaEvolutivo from "./Pages/CargaEvolutivo";
import VerHC from "./Pages/VerHc";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro-especialista" element={<RegistroEspecialista />} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />
          <Route path="/carga-evolutivo" element={<CargaEvolutivo />} />
          <Route path="/verhc/:dniCargado" element={<VerHC />} />

        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

