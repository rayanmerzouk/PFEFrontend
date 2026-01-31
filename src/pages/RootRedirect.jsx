import { Navigate } from "react-router-dom";
import { getUserRole } from "../lib/auth";

const RootRedirect = () => {
  const role = getUserRole();
  if (!role) return <Navigate to="/login" replace />;
  if (role === "entreprise") return <Navigate to="/dashboard-entreprise" replace />;
  return <Navigate to="/dashboard-candidat" replace />;
};

export default RootRedirect;
