import axios, { AxiosError, AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('estele_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export function describeError(err: unknown): ApiError {
  const ax = err as AxiosError<{ success?: boolean; message?: string; errors?: Record<string, string[]> }>;
  if (ax?.isAxiosError) {
    const status = ax.response?.status ?? 0;
    const data = ax.response?.data;
    const message =
      status === 401
        ? 'Please sign in to continue.'
        : (data?.message ??
           (status === 0 ? 'Network error. Check your connection.' :
            status === 403 ? 'Not authorized.' :
            status === 404 ? 'Not found.' :
            status === 422 ? 'Validation failed.' :
            status >= 500 ? 'Server error. Try again shortly.' :
            'Something went wrong.'));
    return { success: false, message, errors: data?.errors, status };
  }
  return { success: false, message: 'Unexpected error.', status: 0 };
}

export default api;
