import { useEffect, useState } from 'react'
import { Activity, Zap, CheckCircle, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { healthService } from '@/app/services/healthService'

type HealthStatus = 'loading' | 'ok' | 'error'

export function HealthPage() {
  const [status, setStatus] = useState<HealthStatus>('loading')
  const [serviceName, setServiceName] = useState<string>('world-forge-backend')
  const [lastCheck, setLastCheck] = useState<string>('—')

  useEffect(() => {
    healthService
      .get()
      .then((response) => {
        // backend esperado: { status: "ok", service: "world-forge-backend" }
        setStatus(response.ok ? 'ok' : 'error')
        setServiceName(response.service)

        setLastCheck(
          new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        )
      })
      .catch(() => {
        setStatus('error')
      })
  }, [])

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl flex items-center gap-2">
          <Activity className="w-6 h-6" />
          System Health
        </h1>
        <p className="text-zinc-600 mt-1">
          Monitoring the status of the World-Forge backend services
        </p>
      </div>

      {/* Main Status Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 max-w-3xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-zinc-100">
            <Zap className="w-6 h-6 text-zinc-700" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-lg font-medium">Forge Status</h2>
              <p className="text-sm text-zinc-500">
                {serviceName}
              </p>
            </div>

            {/* STATUS */}
            {status === 'loading' && (
              <Badge variant="secondary">
                Checking system status…
              </Badge>
            )}

            {status === 'ok' && (
              <Badge className="inline-flex items-center gap-2 bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4" />
                Core Systems Online
              </Badge>
            )}

            {status === 'error' && (
              <Badge className="inline-flex items-center gap-2 bg-red-100 text-red-800">
                <XCircle className="w-4 h-4" />
                Forge Offline
              </Badge>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 mt-4">
              <div>
                <p className="text-xs text-zinc-500">Last Check</p>
                <p className="text-sm">{lastCheck}</p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Environment</p>
                <p className="text-sm">Development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
