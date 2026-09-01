/// <reference types="vite/client" />

declare global {
  interface Window {
    __APP_VERSION__: string
  }
}

export {}