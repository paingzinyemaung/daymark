import { isDateKey, todayKey } from './dates.ts'
import type { Priority, Task } from '../types/task.ts'

const TASKS_KEY = 'daymark.tasks.v1'
const NOTES_KEY = 'daymark.notes.v1'
const TASK_SCHEMA_VERSION = 1
const NOTES_SCHEMA_VERSION = 1

export interface LoadResult<T> {
  data: T
  warning: string | null
}

export interface SaveResult {
  ok: boolean
  error: string | null
}

interface StoredTasks {
  version: number
  tasks: unknown
}

interface StoredNotes {
  version: number
  content: unknown
}

const PRIORITIES: readonly Priority[] = ['high', 'medium', 'low']

export function isStorageAvailable(): boolean {
  try {
    const probe = '__daymark_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

function readRaw(key: string): LoadResult<string | null> {
  try {
    return { data: window.localStorage.getItem(key), warning: null }
  } catch {
    return {
      data: null,
      warning: 'Local storage is unavailable in this browser, so changes will not be saved on this device.',
    }
  }
}

function writeRaw(key: string, value: string): SaveResult {
  try {
    window.localStorage.setItem(key, value)
    return { ok: true, error: null }
  } catch {
    return {
      ok: false,
      error:
        'Your data could not be saved to local storage. This browser may be private, full, or blocking storage.',
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value)
}

function parseJson(raw: string): unknown | undefined {
  try {
    return JSON.parse(raw) as unknown
  } catch {
    return undefined
  }
}

function normalizeTask(value: unknown): Task | null {
  if (!isRecord(value)) {
    return null
  }

  const id = typeof value.id === 'string' ? value.id.trim() : ''
  const title = typeof value.title === 'string' ? value.title.trim() : ''
  if (!id || !title) {
    return null
  }

  const description = typeof value.description === 'string' ? value.description : ''
  const priority = isPriority(value.priority) ? value.priority : 'medium'
  const createdAt =
    typeof value.createdAt === 'string' && !Number.isNaN(Date.parse(value.createdAt))
      ? value.createdAt
      : new Date().toISOString()

  const dueDate =
    typeof value.dueDate === 'string' && isDateKey(value.dueDate)
      ? value.dueDate
      : todayKey()

  return {
    id,
    title,
    description,
    priority,
    dueDate,
    completed: Boolean(value.completed),
    createdAt,
  }
}

export function loadTasks(): LoadResult<Task[]> {
  if (!isStorageAvailable()) {
    return {
      data: [],
      warning: 'Local storage is unavailable in this browser, so changes will not be saved on this device.',
    }
  }

  const raw = readRaw(TASKS_KEY)
  if (raw.warning) {
    return { data: [], warning: raw.warning }
  }
  if (!raw.data) {
    return { data: [], warning: null }
  }

  const parsed = parseJson(raw.data)
  if (parsed === undefined) {
    return {
      data: [],
      warning: 'Saved tasks could not be read and were reset to an empty list.',
    }
  }

  let items: unknown[] = []
  if (Array.isArray(parsed)) {
    items = parsed
  } else if (isRecord(parsed) && Array.isArray(parsed.tasks)) {
    items = parsed.tasks
  } else {
    return {
      data: [],
      warning: 'Saved tasks were in an unexpected format and were reset to an empty list.',
    }
  }

  const tasks: Task[] = []
  const seen = new Set<string>()
  for (const item of items) {
    const task = normalizeTask(item)
    if (task && !seen.has(task.id)) {
      seen.add(task.id)
      tasks.push(task)
    }
  }

  return { data: tasks, warning: null }
}

export function saveTasks(tasks: Task[]): SaveResult {
  const payload: StoredTasks = {
    version: TASK_SCHEMA_VERSION,
    tasks,
  }
  return writeRaw(TASKS_KEY, JSON.stringify(payload))
}

export function loadNotes(): LoadResult<string> {
  if (!isStorageAvailable()) {
    return {
      data: '',
      warning: 'Local storage is unavailable in this browser, so notes will not be saved on this device.',
    }
  }

  const raw = readRaw(NOTES_KEY)
  if (raw.warning) {
    return { data: '', warning: raw.warning }
  }
  if (!raw.data) {
    return { data: '', warning: null }
  }

  const parsed = parseJson(raw.data)
  if (typeof parsed === 'string') {
    return { data: parsed, warning: null }
  }
  if (isRecord(parsed) && typeof parsed.content === 'string') {
    return { data: parsed.content, warning: null }
  }

  return {
    data: '',
    warning: 'Saved notes could not be read and were reset.',
  }
}

export function saveNotes(content: string): SaveResult {
  const payload: StoredNotes = {
    version: NOTES_SCHEMA_VERSION,
    content,
  }
  return writeRaw(NOTES_KEY, JSON.stringify(payload))
}
