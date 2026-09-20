import { useCallback, useSyncExternalStore } from 'react'

/** A partir de este ancho se muestra el lienzo horizontal; por debajo, scroll vertical. */
export const DESKTOP_QUERY = '(min-width: 1200px)'
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', notify)
      return () => mql.removeEventListener('change', notify)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

function subscribeResize(notify: () => void) {
  window.addEventListener('resize', notify)
  return () => window.removeEventListener('resize', notify)
}

export function useWindowWidth(): number {
  return useSyncExternalStore(
    subscribeResize,
    () => window.innerWidth,
    () => 1920,
  )
}

export function useWindowHeight(): number {
  return useSyncExternalStore(
    subscribeResize,
    () => window.innerHeight,
    () => 1080,
  )
}
