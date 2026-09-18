export interface RuntimeConfig {
  task2ApiBaseUrl?: string;
}

declare global {
  interface Window {
    __DDAC_RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

function normalizeBaseUrl(value: string | undefined): string {
  return value?.replace(/\/$/, "") ?? "";
}

export function getTask2ApiBaseUrl(): string {
  return normalizeBaseUrl(
    window.__DDAC_RUNTIME_CONFIG__?.task2ApiBaseUrl ?? import.meta.env.VITE_TASK2_API_BASE_URL
  );
}
