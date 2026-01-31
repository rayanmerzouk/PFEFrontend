import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
