/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MONA_APP_ID: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
