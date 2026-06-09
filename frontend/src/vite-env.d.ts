/// <reference types="vite/client" />

// Declaração das variáveis de ambiente usadas no projeto
// Adicione aqui qualquer nova VITE_* que for criada
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}