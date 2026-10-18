import { Calendar, Check, Pencil, Trash2 } from 'lucide-react'
import { formatDueDate } from '../../lib/dates.ts'
import { isOverdue } from '../../lib/tasks.ts'
import type { Task } from '../../types/task.ts'
import { PriorityBadge } from '../ui/Badge.tsx'

interface TaskCardProps {
  task: Task
  today: string
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, today, onToggle, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task, today)
  const dueLabel = formatDueDate(task.dueDate, today)

  return (
    <article
      className={`rounded-[14px] border bg-surface p-4 shadow-card ${
        overdue ? 'border-danger/30' : 'border-line'
      }`}
    >
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-pressed={task.completed}
          aria-label={task.completed ? `Mark “${task.title}” as active` : `Mark “${task.title}” as complete`}
          className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border transition-colors duration-150 ${
            task.completed
              ? 'border-accent bg-accent text-white'
              : 'border-line bg-canvas text-transparent hover:border-accent hover:text-accent'
          }`}
        >
          <Check size={16} strokeWidth={2.25} aria-hidden="true" className={task.completed ? 'text-white' : ''} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              className={`text-base leading-6 font-semibold break-words ${
                task.completed ? 'text-muted line-through' : 'text-ink'
              }`}
            >
              {task.title}
            </h3>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description ? (
            <p className="mt-1 text-sm leading-6 break-words text-muted">{task.description}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className={`inline-flex items-center gap-1.5 text-sm ${overdue ? 'font-medium text-danger' : 'text-muted'}`}>
              <Calendar size={14} aria-hidden="true" />
              <span>
                {dueLabel}
                {overdue ? <span className="ml-2 rounded-md bg-danger-soft px-1.5 py-0.5 text-xs font-semibold tracking-wide uppercase">Overdue</span> : null}
              </span>
            </p>
            {task.completed ? (
              <p className="text-sm text-muted">Completed</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-1 border-t border-line pt-3">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink hover:bg-canvas"
        >
          <Pencil size={14} aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-danger hover:bg-danger-soft"
        >
          <Trash2 size={14} aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  )
}
