import { useMemo, type ReactNode } from 'react'
import { RevealContext, vars } from '../lib/reveal'
import { useInView } from '../lib/useInView'

interface Props {
  as?: 'section' | 'header'
  id?: string
  className?: string
  /** retraso base (ms) de todo lo que cuelga de esta sección */
  delay?: number
  children: ReactNode
}

/**
 * Contenedor que detecta cuándo entra en pantalla y lo expone (clase `is-shown`
 * + contexto) para disparar las animaciones de sus hijos una sola vez.
 */
export function Reveal({ as: Tag = 'section', id, className = '', delay = 0, children }: Props) {
  const [ref, shown] = useInView<HTMLElement>()
  const state = useMemo(() => ({ shown, delay }), [shown, delay])

  return (
    <RevealContext value={state}>
      <Tag
        ref={ref}
        id={id}
        className={shown ? `${className} is-shown` : className}
        style={vars({ '--d': `${delay}ms` })}
      >
        {children}
      </Tag>
    </RevealContext>
  )
}
