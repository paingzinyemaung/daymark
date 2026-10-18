import type { TaskStats } from '../../types/task.ts'

interface ProgressPanelProps {
  stats: TaskStats
}

export function ProgressPanel({ stats }: ProgressPanelProps) {
  const label =
    stats.total === 0
      ? 'Add a task to start tracking today.'
      : stats.remaining === 0
        ? 'Every task is complete.'
        : `${stats.completed} of ${stats.total} tasks complete.`

  return (
    <section
      aria-label="Daily progress"
      className="mb-8 rounded-[14px] border border-line bg-surface p-4 shadow-card sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">Daily progress</h2>
          <p className="mt-1 text-sm text-muted">{label}</p>
        </div>
        <p className="font-editorial text-2xl font-medium text-ink" aria-hidden={stats.total === 0}>
          {stats.percent}%
        </p>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-canvas"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={stats.percent}
        aria-label={`Daily progress ${stats.percent} percent`}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${stats.percent}%` }}
        />
      </div>
    </section>
  )
}
