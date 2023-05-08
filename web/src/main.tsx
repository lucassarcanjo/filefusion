import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { TelemetryProvider } from "./utils/telemetry.tsx";
import "./styles/global.css";
// import "@fontsource/roboto";
// import "@fontsource/inter";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/700.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TelemetryProvider>
      <App />
    </TelemetryProvider>
  </React.StrictMode>
);
