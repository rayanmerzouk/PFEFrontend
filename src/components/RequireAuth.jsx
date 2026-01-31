import { Navigate } from "react-router-dom";
import { getTokenPayload } from "../lib/auth";

const RequireAuth = ({ children }) => {
  const payload = getTokenPayload();
  if (!payload) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default RequireAuth;
