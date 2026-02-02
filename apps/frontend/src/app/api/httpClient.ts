// src/app/api/httpClient.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined')
}

/**
 * Métodos HTTP soportados
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * Opciones para una request
 */
interface RequestOptions {
  method: HttpMethod
  body?: unknown
  headers?: HeadersInit
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
  })

  if (!response.ok) {
    const message = await response.text()
    throw new HttpError(response.status, message || response.statusText)
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
  get<T>(path: string) {
    return request<T>(path, { method: 'GET' })
  },

  post<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'POST', body })
  },

  put<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'PUT', body })
  },

  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' })
  },
}
