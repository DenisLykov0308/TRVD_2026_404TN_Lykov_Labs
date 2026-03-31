import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL } from '@/lib/config';
import {
  clearAuthSession,
  getAccessToken,
  notifyUnauthorizedSession,
} from '@/lib/storage';

type BackendErrorPayload = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function resolveErrorMessage(payload?: BackendErrorPayload): string {
  if (!payload) {
    return 'API request failed.';
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join(', ');
  }

  return payload.message || payload.error || 'API request failed.';
}

function toApiClientError(error: unknown): ApiClientError {
  if (axios.isAxiosError<BackendErrorPayload>(error)) {
    const status = error.response?.status ?? null;
    const details = error.response?.data;
    return new ApiClientError(resolveErrorMessage(details), status, details);
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message, null, error);
  }

  return new ApiClientError('Unexpected API request error.', null, error);
}

function withAuthHeader(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getAccessToken();

  if (!token) {
    return config;
  }

  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;

  return config;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(withAuthHeader);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorPayload>) => {
    const hasStoredSession = Boolean(getAccessToken());

    if (error.response?.status === 401 && hasStoredSession) {
      clearAuthSession();
      notifyUnauthorizedSession();
    }

    return Promise.reject(toApiClientError(error));
  },
);

export default apiClient;
