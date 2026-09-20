import { useEffect, useState } from 'react'
import { REDUCED_MOTION_QUERY, useMediaQuery } from '../lib/media'
import { useReveal } from '../lib/reveal'

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
const format = new Intl.NumberFormat('es-AR')

interface Props {
  to: number
  /** duración de la cuenta (ms); coincide con la transición CSS de las barras */
  duration?: number
  /** retraso extra (ms) sobre el de la sección */
  extra?: number
}

/** Cuenta rápida de 0 al valor real, arrancando cuando la sección entra en pantalla. */
export function CountUp({ to, duration = 1500, extra = 0 }: Props) {
  const { shown, delay } = useReveal()
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!shown || reduced) return
    let raf = 0
    const timer = window.setTimeout(() => {
      const t0 = performance.now()
      const tick = (now: number) => {
        // el timestamp del primer frame puede ser anterior a t0: sin el max, t arranca negativo
        const t = Math.min(1, Math.max(0, (now - t0) / duration))
        setValue(Math.round(easeOutQuart(t) * to))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay + extra)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [shown, reduced, to, duration, delay, extra])

  return (
    <>
      <span className="sr-only">{format.format(to)}</span>
      <span aria-hidden="true">{format.format(reduced ? to : value)}</span>
    </>
  )
}
