import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import "./styles/index.css";
import NotFound from "./pages/NotFound.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallback={<NotFound />}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
