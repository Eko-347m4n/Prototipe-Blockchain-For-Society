/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RBAC_CONTRACT_ADDRESS: string;
  readonly VITE_IDENTITY_CONTRACT_ADDRESS: string;
  readonly VITE_DUKCAPIL_CONTRACT_ADDRESS: string;
  readonly VITE_PENDIDIKAN_CONTRACT_ADDRESS: string;
  readonly VITE_SOSIAL_CONTRACT_ADDRESS: string;
  readonly VITE_KESEHATAN_CONTRACT_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}