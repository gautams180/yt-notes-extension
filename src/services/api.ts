// API client for 3rd party integrations
// This runs in the background script to avoid CORS issues

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

interface ApiConfig {
  baseUrl?: string;
  apiKey?: string;
}

// Default configuration - override with environment variables
const defaultConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  apiKey: import.meta.env.VITE_API_KEY || '',
};

// Generic fetch wrapper with error handling
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
  config: ApiConfig = defaultConfig
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const { baseUrl, apiKey } = config;

  const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (apiKey) {
    requestHeaders['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, config?: ApiConfig) => 
    apiFetch<T>(endpoint, { method: 'GET' }, config),
  
  post: <T>(endpoint: string, body: unknown, config?: ApiConfig) => 
    apiFetch<T>(endpoint, { method: 'POST', body }, config),
  
  put: <T>(endpoint: string, body: unknown, config?: ApiConfig) => 
    apiFetch<T>(endpoint, { method: 'PUT', body }, config),
  
  delete: <T>(endpoint: string, config?: ApiConfig) => 
    apiFetch<T>(endpoint, { method: 'DELETE' }, config),
};
