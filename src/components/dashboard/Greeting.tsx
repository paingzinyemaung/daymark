import { useState } from 'react'
import { formatLongDate, greetingForHour } from '../../lib/dates.ts'

export function Greeting() {
  const [now] = useState(() => new Date())

  return (
    <section className="mb-6">
      <p className="text-sm tracking-wide text-muted uppercase">{formatLongDate(now)}</p>
      <p className="mt-2 text-sm text-muted">{greetingForHour(now.getHours())}.</p>
      <h1 className="font-editorial mt-1 max-w-xl text-[2rem] leading-tight font-medium tracking-tight text-ink sm:text-[2.35rem]">
        Make today count.
      </h1>
    </section>
  )
}
