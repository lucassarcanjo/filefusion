import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import {
  ReactPlugin,
  AppInsightsContext,
} from "@microsoft/applicationinsights-react-js";

const connectionString = import.meta.env.VITE_APP_INSIGHTS_CONNECTION_STRING;

if (!connectionString) {
  throw new Error(
    "VITE_APP_INSIGHTS_CONNECTION_STRING environment variable is not set"
  );
}

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString,
    extensions: [reactPlugin],
  },
});

appInsights.loadAppInsights();

interface TelemetryProviderProps {
  children: React.ReactNode;
}

export const TelemetryProvider = ({ children }: TelemetryProviderProps) => (
  <AppInsightsContext.Provider value={reactPlugin}>
    {children}
  </AppInsightsContext.Provider>
);
