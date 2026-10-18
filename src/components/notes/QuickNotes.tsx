import { StickyNote } from 'lucide-react'
import type { NotesStatus } from '../../hooks/useNotes.ts'

interface QuickNotesProps {
  content: string
  status: NotesStatus
  error: string | null
  onChange: (value: string) => void
}

function statusLabel(status: NotesStatus, error: string | null): string {
  if (status === 'saving') {
    return 'Saving…'
  }
  if (status === 'saved') {
    return 'Saved on this device'
  }
  if (status === 'error') {
    return error ?? 'Notes could not be saved.'
  }
  return 'Notes stay on this device'
}

export function QuickNotes({ content, status, error, onChange }: QuickNotesProps) {
  const isError = status === 'error'

  return (
    <section
      aria-labelledby="quick-notes-heading"
      className="rounded-[14px] border border-line bg-surface p-4 shadow-card sm:p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <StickyNote size={16} className="text-accent" aria-hidden="true" />
            <h2 id="quick-notes-heading" className="text-sm font-semibold tracking-wide text-ink uppercase">
              Quick notes
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted">Scratchpad for today. Saved automatically.</p>
        </div>
        <p
          className={`text-xs font-medium ${isError ? 'text-danger' : 'text-muted'}`}
          aria-live="polite"
        >
          {statusLabel(status, error)}
        </p>
      </div>
      <label htmlFor="quick-notes" className="sr-only">
        Daily notes
      </label>
      <textarea
        id="quick-notes"
        value={content}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Capture a thought, a reminder, or the next thing you want to remember."
        className="min-h-48 w-full resize-y rounded-[10px] border border-line bg-canvas px-3 py-3 text-base leading-6 text-ink placeholder:text-muted/80"
      />
    </section>
  )
}
