import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { quickActions, statCards } from '@/app/config/dashboard-entities'

export function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">
          Manage your narrative elements and world-building data
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <article
              key={card.title}
              className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${card.color}`}
                >
                  <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <span className="text-3xl font-medium text-zinc-900 sm:text-4xl">{card.count}</span>
              </div>

              <h2 className="mt-4 text-xl font-semibold text-zinc-900 sm:text-2xl">{card.title}</h2>
              {card.to ? (
                <Link to={card.to} className="mt-2 inline-block text-sm text-zinc-500 sm:text-base">
                  View all →
                </Link>
              ) : (
                <span className="mt-2 inline-block text-sm text-zinc-500 sm:text-base">View all →</span>
              )}
            </article>
          )
        })}
      </section>

      <section className="mt-5 rounded-xl border border-zinc-200 bg-white p-4 sm:mt-6 sm:p-5">
        <h3 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Quick Actions</h3>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {quickActions.map((action) => (
            <button
              key={action.key}
              type="button"
              className="flex min-h-16 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-600 sm:gap-3 sm:px-4"
            >
              <Plus className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <span className="text-sm leading-tight sm:text-base">
                {action.lineOne}
                <br />
                {action.lineTwo}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}