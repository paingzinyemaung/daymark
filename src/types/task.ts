export type Priority = 'high' | 'medium' | 'low'

export type TaskFilter = 'all' | 'active' | 'completed'

export type AppView = 'today' | 'all'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  completed: boolean
  createdAt: string
}

export interface TaskDraft {
  title: string
  description: string
  priority: Priority
  dueDate: string
}

export interface TaskStats {
  total: number
  completed: number
  remaining: number
  percent: number
}
