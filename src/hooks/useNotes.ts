import { useEffect, useRef, useState } from 'react'
import { loadNotes, saveNotes } from '../lib/storage.ts'

const SAVE_DELAY_MS = 450

export type NotesStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useNotes() {
  const initial = loadNotes()
  const [content, setContent] = useState(initial.data)
  const [status, setStatus] = useState<NotesStatus>(initial.data ? 'saved' : 'idle')
  const [error, setError] = useState<string | null>(initial.warning)
  const latestRef = useRef(initial.data)
  const timerRef = useRef<number | null>(null)
  const skipFirstSave = useRef(true)

  useEffect(() => {
    latestRef.current = content
  }, [content])

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false
      return
    }

    setStatus('saving')
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      const result = saveNotes(latestRef.current)
      if (result.ok) {
        setError(null)
        setStatus('saved')
      } else {
        setError(result.error)
        setStatus('error')
      }
    }, SAVE_DELAY_MS)

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [content])

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
      saveNotes(latestRef.current)
    }
  }, [])

  return {
    content,
    setContent,
    status,
    error,
  }
}
