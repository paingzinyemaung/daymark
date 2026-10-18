import { useCallback, useRef, useState } from 'react'
import { createId } from '../lib/ids.ts'

export interface ToastMessage {
  id: string
  text: string
  tone: 'success' | 'error'
}

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const timerRef = useRef<number | null>(null)

  const dismiss = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setToast(null)
  }, [])

  const show = useCallback(
    (text: string, tone: ToastMessage['tone'] = 'success') => {
      dismiss()
      setToast({ id: createId(), text, tone })
      timerRef.current = window.setTimeout(() => {
        setToast(null)
        timerRef.current = null
      }, 3200)
    },
    [dismiss],
  )

  return { toast, show, dismiss }
}
