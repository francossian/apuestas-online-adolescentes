import { useEffect, useRef, useState } from 'react'
import { vars } from '../lib/reveal'

interface Props {
  /** ids de las secciones, en orden */
  ids: string[]
}

/**
 * Versión mobile del "riel" del encabezado: barra fija arriba con un nodo por
 * sección, que se va llenando a medida que el usuario scrollea.
 */
export function ProgressRail({ ids }: Props) {
  const railRef = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let ticking = false

    const update = () => {
      ticking = false
      const probe = window.scrollY + window.innerHeight * 0.5
      const tops = ids.map((id) => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity
      })

      // posición fraccionaria entre secciones: 0 = primera, ids.length-1 = última
      let f = 0
      for (let i = 0; i < ids.length; i++) {
        if (probe < tops[i]) break
        const next = tops[i + 1] ?? Infinity
        f = i + (Number.isFinite(next) ? Math.min(1, (probe - tops[i]) / (next - tops[i])) : 0)
      }
      rail.style.setProperty('--p', String(f / (ids.length - 1)))
      setCurrent(Math.min(ids.length - 1, Math.floor(f + 0.001)))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    const first = requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(first)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <nav ref={railRef} className="progreso" aria-label="Secciones de la infografía">
      <span className="progreso-nro" aria-hidden="true">
        {pad(current + 1)} / {pad(ids.length)}
      </span>
      <div className="progreso-linea">
        <span className="progreso-fill" />
        {ids.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            className={i <= current ? 'pnodo on' : 'pnodo'}
            style={vars({ '--x': `${(i / (ids.length - 1)) * 100}%` })}
            aria-label={`Ir a la sección ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
          />
        ))}
      </div>
    </nav>
  )
}
