// src/app/api/httpClient.ts
import { env } from '@/shared/config/env'

const BASE_URL = env.apiBaseUrl

if (!BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined')
}

/**
 * Métodos HTTP soportados
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Opciones para una request
 */
interface RequestOptions {
  method: HttpMethod
  body?: unknown
  headers?: HeadersInit
  // Permite cancelar requests en curso (búsquedas, navegación rápida, etc.).
  signal?: AbortSignal
}

/**
 * Error HTTP normalizado
 */
export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Unexpected error occurred'
): string {
  if (error instanceof HttpError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return fallbackMessage
}

/**
 * Request genérico
 * NO conoce endpoints
 * NO conoce dominio
 */
async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  if (!response.ok) {
    const rawMessage = await response.text()
    let message = rawMessage || response.statusText

    try {
      const parsed = JSON.parse(rawMessage) as { error?: string; message?: string }
      message = parsed.error ?? parsed.message ?? message
    } catch {
      // El backend no siempre responde JSON; si no se puede parsear, se usa el texto crudo.
    }

    throw new HttpError(response.status, message)
  }

  // Algunos endpoints pueden no devolver body
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

/**
 * Cliente HTTP público
 * Infraestructura pura
 */
export const httpClient = {
  get<T>(path: string, options?: { signal?: AbortSignal }) {
    return request<T>(path, { method: 'GET', signal: options?.signal })
  },

  post<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'POST', body })
  },

  put<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'PUT', body })
  },

  patch<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'PATCH', body })
  },

  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' })
  },
}
