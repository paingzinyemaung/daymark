import type { Priority } from '../../types/task.ts'

const styles: Record<Priority, string> = {
  high: 'bg-danger-soft text-high',
  medium: 'bg-warning-soft text-medium',
  low: 'bg-accent-soft text-low',
}

const labels: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

interface PriorityBadgeProps {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${styles[priority]}`}
    >
      {labels[priority]} priority
    </span>
  )
}
