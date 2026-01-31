import { Navigate } from "react-router-dom";
import { getUserRole } from "../lib/auth";

const RequireRole = ({ roles, children }) => {
  const role = getUserRole();
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequireRole;
