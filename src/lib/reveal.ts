import { createContext, useContext, type CSSProperties } from 'react'

export interface RevealState {
  /** true cuando la sección ya entró en pantalla */
  shown: boolean
  /** retraso (ms) de la sección, para escalonar la aparición en desktop */
  delay: number
}

export const RevealContext = createContext<RevealState>({ shown: false, delay: 0 })

export function useReveal(): RevealState {
  return useContext(RevealContext)
}

/** Atajo para pasar variables CSS (--i, --w, --k...) desde JSX sin castear cada vez. */
export function vars(values: Record<string, string | number>): CSSProperties {
  return values as CSSProperties
}
