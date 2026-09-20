import { useEffect, useRef, useState, type RefObject } from 'react'

/** Devuelve [ref, visto]: `visto` pasa a true la primera vez que el elemento entra en pantalla. */
export function useInView<T extends Element>(
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin])

  return [ref, seen]
}
