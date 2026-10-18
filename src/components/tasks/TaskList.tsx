import { ListTodo } from 'lucide-react'
import type { Task } from '../../types/task.ts'
import { TaskCard } from './TaskCard.tsx'

interface TaskListProps {
  tasks: Task[]
  today: string
  emptyTitle: string
  emptyMessage: string
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onCreate?: () => void
}

export function TaskList({
  tasks,
  today,
  emptyTitle,
  emptyMessage,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-line bg-surface px-5 py-10 text-center">
        <span className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
          <ListTodo size={20} aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold text-ink">{emptyTitle}</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted">{emptyMessage}</p>
        {onCreate ? (
          <button
            type="button"
            onClick={onCreate}
            className="mt-4 inline-flex min-h-11 items-center rounded-[10px] bg-accent px-4 text-sm font-medium text-white hover:bg-accent-strong"
          >
            Add a task
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            today={today}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  )
}
