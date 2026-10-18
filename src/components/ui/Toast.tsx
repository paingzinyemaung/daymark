import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import type { ToastMessage } from '../../hooks/useToast.ts'

interface ToastProps {
  toast: ToastMessage | null
  onDismiss: () => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) {
    return null
  }

  const isError = toast.tone === 'error'

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 bottom-4 left-4 z-[60] mx-auto flex max-w-md items-start gap-3 rounded-[12px] border px-4 py-3 shadow-card sm:right-6 sm:left-auto ${
        isError ? 'border-danger/20 bg-danger-soft text-danger' : 'border-line bg-surface text-ink'
      }`}
    >
      {isError ? (
        <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      ) : (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
      )}
      <p className="flex-1 text-sm leading-5">{toast.text}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-current"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}
