import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import DashboardCandidat from "./pages/DashboardCandidat";
import DashboardEntreprise from "./pages/DashboardEntreprise";
import { Routes, Route } from "react-router-dom"; // import nécessaire
import Envoi from "./pages/Envoi.jsx"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={< Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard-candidat" element={<DashboardCandidat />} />
        <Route path="/dashboard-entreprise" element={<DashboardEntreprise />} />
        <Route path="/envoi" element={<Envoi/>}></Route>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
