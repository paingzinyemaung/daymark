import { Bookmark, Plus } from 'lucide-react'
import type { AppView } from '../../types/task.ts'
import { Button } from '../ui/Button.tsx'

interface AppHeaderProps {
  view: AppView
  onViewChange: (view: AppView) => void
  onNewTask: () => void
}

export function AppHeader({ view, onViewChange, onNewTask }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-white">
              <Bookmark size={18} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <p className="font-editorial text-lg leading-none font-medium tracking-tight text-ink">
                Daymark
              </p>
              <p className="mt-0.5 text-xs tracking-wide text-muted uppercase">Your daily focus</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="flex flex-1 rounded-[10px] border border-line bg-surface p-1 sm:flex-initial">
            <NavTab active={view === 'today'} onClick={() => onViewChange('today')}>
              Today
            </NavTab>
            <NavTab active={view === 'all'} onClick={() => onViewChange('all')}>
              All Tasks
            </NavTab>
          </nav>
          <Button onClick={onNewTask}>
            <Plus size={16} aria-hidden="true" />
            New task
          </Button>
        </div>
      </div>
    </header>
  )
}

interface NavTabProps {
  active: boolean
  onClick: () => void
  children: string
}

function NavTab({ active, onClick, children }: NavTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`min-h-10 flex-1 rounded-lg px-3 text-sm font-medium transition-colors duration-150 ${
        active ? 'bg-accent-soft text-accent-strong' : 'text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
