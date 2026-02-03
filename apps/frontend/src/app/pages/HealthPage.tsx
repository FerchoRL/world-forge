import { Activity, Zap, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function HealthPage() {
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
                world-forge-backend
              </p>
            </div>

            <Badge className="inline-flex items-center gap-1 bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4" />
              Core Systems Online
            </Badge>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 mt-4">
              <div>
                <p className="text-xs text-zinc-500">Last Check</p>
                <p className="text-sm">
                  Feb 3, 2026 · 12:05 AM
                </p>
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
