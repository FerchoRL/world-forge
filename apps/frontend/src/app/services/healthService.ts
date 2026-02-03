import { httpClient } from '@/app/api/httpClient'

interface HealthResponse {
  status: string
  service: string
}

export const healthService = {
  get(): Promise<HealthResponse> {
    return httpClient.get<HealthResponse>('/health')
  },
}
