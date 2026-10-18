import { useCallback, useState } from 'react'
import { todayKey } from '../lib/dates.ts'
import { createId } from '../lib/ids.ts'
import { loadTasks, saveTasks } from '../lib/storage.ts'
import type { Task, TaskDraft } from '../types/task.ts'

export function useTasks() {
  const initial = loadTasks()
  const [tasks, setTasks] = useState<Task[]>(initial.data)
  const [storageWarning, setStorageWarning] = useState<string | null>(initial.warning)

  const persist = useCallback((next: Task[]) => {
    const result = saveTasks(next)
    setStorageWarning(result.ok ? null : result.error)
    return result.ok
  }, [])

  const addTask = useCallback(
    (draft: TaskDraft) => {
      const title = draft.title.trim()
      if (!title) {
        return { ok: false as const, error: 'A task title is required.' }
      }

      const task: Task = {
        id: createId(),
        title,
        description: draft.description.trim(),
        priority: draft.priority,
        dueDate: draft.dueDate || todayKey(),
        completed: false,
        createdAt: new Date().toISOString(),
      }

      let saved = true
      setTasks((current) => {
        const next = [task, ...current]
        saved = persist(next)
        return next
      })

      return saved
        ? { ok: true as const, task }
        : { ok: false as const, error: 'The task was added in this session, but it could not be saved to this device.' }
    },
    [persist],
  )

  const updateTask = useCallback(
    (id: string, draft: TaskDraft) => {
      const title = draft.title.trim()
      if (!title) {
        return { ok: false as const, error: 'A task title is required.' }
      }

      let found = false
      let saved = true
      setTasks((current) => {
        const next = current.map((task) => {
          if (task.id !== id) {
            return task
          }
          found = true
          return {
            ...task,
            title,
            description: draft.description.trim(),
            priority: draft.priority,
            dueDate: draft.dueDate || task.dueDate,
          }
        })
        saved = persist(next)
        return next
      })

      if (!found) {
        return { ok: false as const, error: 'That task could not be found.' }
      }

      return saved
        ? { ok: true as const }
        : { ok: false as const, error: 'The task was updated in this session, but it could not be saved to this device.' }
    },
    [persist],
  )

  const toggleTask = useCallback(
    (id: string) => {
      let saved = true
      setTasks((current) => {
        const next = current.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        )
        saved = persist(next)
        return next
      })
      return saved
    },
    [persist],
  )

  const deleteTask = useCallback(
    (id: string) => {
      let saved = true
      setTasks((current) => {
        const next = current.filter((task) => task.id !== id)
        saved = persist(next)
        return next
      })
      return saved
    },
    [persist],
  )

  return {
    tasks,
    storageWarning,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
  }
}
