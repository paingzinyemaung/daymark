import type { Priority, Task, TaskFilter, TaskStats } from '../types/task.ts'

const PRIORITY_RANK: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export function isOverdue(task: Task, today: string): boolean {
  return !task.completed && task.dueDate < today
}

export function getTaskStats(tasks: readonly Task[]): TaskStats {
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const remaining = total - completed
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { total, completed, remaining, percent }
}

function compareActive(a: Task, b: Task): number {
  const priorityDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  if (priorityDiff !== 0) {
    return priorityDiff
  }

  if (a.dueDate !== b.dueDate) {
    return a.dueDate.localeCompare(b.dueDate)
  }

  return a.createdAt.localeCompare(b.createdAt)
}

export function sortActiveTasks(tasks: readonly Task[]): Task[] {
  return [...tasks].sort(compareActive)
}

export function getTodayFocus(tasks: readonly Task[], today: string): Task[] {
  return sortActiveTasks(
    tasks.filter((task) => !task.completed && task.dueDate <= today),
  )
}

export function getVisibleTasks(
  tasks: readonly Task[],
  filter: TaskFilter,
  query: string,
): Task[] {
  const needle = query.trim().toLowerCase()
  const filtered = tasks.filter((task) => {
    if (filter === 'active' && task.completed) {
      return false
    }
    if (filter === 'completed' && !task.completed) {
      return false
    }
    if (needle && !task.title.toLowerCase().includes(needle)) {
      return false
    }
    return true
  })

  const active = sortActiveTasks(filtered.filter((task) => !task.completed))
  const completed = filtered
    .filter((task) => task.completed)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  if (filter === 'completed') {
    return completed
  }
  if (filter === 'active') {
    return active
  }

  return [...active, ...completed]
}

export function emptyFilterMessage(filter: TaskFilter, hasQuery: boolean): string {
  if (hasQuery) {
    return 'No tasks match that search. Try a different title or clear the search.'
  }
  if (filter === 'completed') {
    return 'Completed tasks will appear here after you finish them.'
  }
  if (filter === 'active') {
    return 'You have no active tasks. Add one to start the day.'
  }
  return 'No tasks yet. Add your first task to make today count.'
}
