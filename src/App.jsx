import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import RootRedirect from "./pages/RootRedirect";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardCandidat from "./pages/DashboardCandidat";
import DashboardEntreprise from "./pages/DashboardEntreprise";
import Cvs from "./pages/Cvs";
import Offers from "./pages/Offers";
import OfferDetail from "./pages/OfferDetail";
import Candidatures from "./pages/Candidatures";
import EntrepriseOffres from "./pages/EntrepriseOffres";
import EntrepriseCandidatures from "./pages/EntrepriseCandidatures";
import Profile from "./pages/Profile";
import Envoi from "./pages/Envoi.jsx";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard-candidat"
        element={
          <RequireAuth>
            <RequireRole roles={["candidat"]}>
              <DashboardCandidat />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard-entreprise"
        element={
          <RequireAuth>
            <RequireRole roles={["entreprise"]}>
              <DashboardEntreprise />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/cvs"
        element={
          <RequireAuth>
            <RequireRole roles={["candidat"]}>
              <Cvs />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/offres"
        element={
          <RequireAuth>
            <RequireRole roles={["candidat"]}>
              <Offers />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/offres/:id"
        element={
          <RequireAuth>
            <RequireRole roles={["candidat"]}>
              <OfferDetail />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/candidatures"
        element={
          <RequireAuth>
            <RequireRole roles={["candidat"]}>
              <Candidatures />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/entreprise/offres"
        element={
          <RequireAuth>
            <RequireRole roles={["entreprise"]}>
              <EntrepriseOffres />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/entreprise/candidatures"
        element={
          <RequireAuth>
            <RequireRole roles={["entreprise"]}>
              <EntrepriseCandidatures />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/profil"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/envoi"
        element={
          <RequireAuth>
            <RequireRole roles={["candidat"]}>
              <Envoi />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
