import { httpClient } from '@/app/api/httpClient'

interface HealthApiResponse {
  status: string
  service: string
}

export const healthService = {
  async get() {
    const response = await httpClient.get<HealthApiResponse>('/health')

    const isOk = response.status?.toLowerCase() === 'ok'

    return {
      ok: isOk,
      service: response.service,
    }
  },
}
