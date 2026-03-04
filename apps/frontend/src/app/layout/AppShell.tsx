import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BookOpen,
  GitBranch,
  Globe,
  HeartPulse,
  Home,
  MapPin,
  UserRound,
  Users,
} from 'lucide-react'

interface Props {
  children: ReactNode
}

const navItems = [
  { label: 'Dashboard', icon: Home, to: '/' },
  { label: 'Characters', icon: Users, to: '/characters' },
  { label: 'Character Variants', icon: UserRound, to: undefined },
  { label: 'Stories', icon: BookOpen, to: undefined },
  { label: 'Universes', icon: Globe, to: undefined },
  { label: 'Locations', icon: MapPin, to: undefined },
  { label: 'Arcs', icon: GitBranch, to: undefined },
  { label: 'Healthcheck', icon: HeartPulse, to: '/health' },
]

export function AppShell({ children }: Props) {
  const { pathname } = useLocation()

  const pageLabel =
    navItems.find((item) => {
      if (item.to === '/') {
        return pathname === '/'
      }

      return item.to && pathname.startsWith(item.to)
    })?.label ?? 'Dashboard'

  return (
    <div className="flex h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-3xl font-semibold tracking-tight">World-Forge</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.to === '/'
                  ? pathname === '/'
                  : item.to
                    ? pathname.startsWith(item.to)
                    : false

              const itemClass = isActive
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'

              return (
                <li key={item.label}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${itemClass}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-lg">{item.label}</span>
                    </Link>
                  ) : (
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${itemClass}`}>
                      <Icon className="w-5 h-5" />
                      <span className="text-lg">{item.label}</span>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-zinc-50 border-b border-zinc-200 flex items-center px-8">
          <span className="text-lg text-zinc-500">{pageLabel}</span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
