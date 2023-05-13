import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { TelemetryProvider } from "./utils/telemetry.tsx";
import { TooltipProvider } from "./components/Tooltip.tsx";

import "@fontsource/raleway/500.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/700.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TelemetryProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </TelemetryProvider>
  </React.StrictMode>
);
