import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";
import App from "./App.jsx";
import "./index.css";
import CartProviderWrapper from "./context/CartProviderWrapper.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProviderWrapper>
          <App />
        </CartProviderWrapper>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
