/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_INSIGHTS_CONNECTION_STRING: string | undefined;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
