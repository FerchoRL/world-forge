import type { ReactNode } from 'react'
import { Users, HeartPulse } from 'lucide-react'

interface Props {
  children: ReactNode
}

const navItems = [
  { label: 'Characters', icon: Users },
  { label: 'Health', icon: HeartPulse },
]

export function AppShell({ children }: Props) {
  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl tracking-tight">World-Forge</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <li key={item.label}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-6">
          <span className="text-sm text-zinc-500">Layout Preview</span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
