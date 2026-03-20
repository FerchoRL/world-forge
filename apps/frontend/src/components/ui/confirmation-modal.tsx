import { Button } from '@/components/ui/button'

interface ConfirmationModalProps {
  open: boolean
  title: string
  message: string
  eyebrow?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  confirmDisabled?: boolean
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  showCancel?: boolean
}

export function ConfirmationModal({
  open,
  title,
  message,
  eyebrow = 'Confirmation',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmDisabled = false,
  confirmVariant = 'default',
  showCancel = true,
}: ConfirmationModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/10 backdrop-blur-[8px]">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xl shadow-zinc-950/10">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            {eyebrow}
          </p>
          <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
          <p className="text-sm leading-relaxed text-zinc-600">{message}</p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {showCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
