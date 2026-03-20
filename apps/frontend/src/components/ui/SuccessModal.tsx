interface SuccessModalProps {
  open: boolean
  message: string
  description?: string
  onClose: () => void
}

export function SuccessModal({
  open,
  message,
  description,
  onClose,
}: SuccessModalProps) {
  if (!open) return null

  return (
    <div className="fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
      <div className="rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-700">
            ✓
          </div>

          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-600">
              Success
            </p>
            <div className="mt-1 text-base font-semibold text-zinc-950">{message}</div>
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {description}
              </p>
            )}
          </div>

          <div className="ml-2">
            <button
              type="button"
              aria-label="Close success message"
              onClick={onClose}
              className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
