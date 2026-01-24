import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // <-- assure-toi du chemin

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
