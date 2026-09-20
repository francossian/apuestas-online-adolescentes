import { useEffect, useRef } from 'react'
import { REDUCED_MOTION_QUERY } from '../lib/media'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  /** velocidad de crucero: a la que vuelve después de que el cursor la empuja */
  bx: number
  by: number
  size: number
  rot: number
  spin: number
  alpha: number
  tone: 0 | 1
  sprite: number
}

const TONES = ['rgb(18,20,22)', 'rgb(232,83,47)'] // tinta y acento de la infografía
const SPRITE_SIZES = [64, 128, 256]
const OFFSCREEN = -9999

const CLEARANCE = 22 // px que siempre quedan entre el cursor y el borde del "$"
const PUSH = 2600 // aceleración máxima de la repulsión (px/s²)
const RELAX = 0.7 // qué tan rápido vuelven a su deriva natural (1/s)
const MAX_SPEED = 650

function makeSprite(px: number, color: string): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = px
  const g = c.getContext('2d')!
  g.fillStyle = color
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `800 ${px * 0.86}px Archivo, "Arial Black", system-ui, sans-serif`
  g.fillText('$', px / 2, px / 2 + px * 0.04)
  return c
}

/**
 * Fondo de símbolos "$" casi invisibles que derivan a velocidad y dirección
 * aleatorias y huyen del cursor: la repulsión los empuja y, además, una
 * restricción dura garantiza que el puntero nunca llegue a tocarlos.
 */
export function DollarField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const particles: Particle[] = []
    const cursor = { x: OFFSCREEN, y: OFFSCREEN }
    let sprites: HTMLCanvasElement[][] = []
    let W = 0
    let H = 0
    let raf = 0
    let last = 0
    let cancelled = false
    let ro: ResizeObserver | undefined

    const spawn = (): Particle => {
      const size = 14 + 78 * Math.random() ** 2.4 // muchos chicos, pocos grandes
      const angle = Math.random() * Math.PI * 2
      const speed = 8 + Math.random() * 26
      const bx = Math.cos(angle) * speed
      const by = Math.sin(angle) * speed
      const need = size * dpr
      const fit = SPRITE_SIZES.findIndex((s) => s >= need)
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: bx,
        vy: by,
        bx,
        by,
        size,
        rot: (Math.random() - 0.5) * 1.2,
        spin: (Math.random() - 0.5) * 0.25,
        alpha: 0.022 + Math.random() * 0.04,
        tone: Math.random() < 0.16 ? 1 : 0,
        sprite: fit < 0 ? SPRITE_SIZES.length - 1 : fit,
      }
    }

    const draw = () => {
      if (!sprites.length) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        const c = Math.cos(p.rot) * dpr
        const s = Math.sin(p.rot) * dpr
        ctx.globalAlpha = p.alpha
        ctx.setTransform(c, s, -s, c, p.x * dpr, p.y * dpr)
        ctx.drawImage(sprites[p.tone][p.sprite], -p.size / 2, -p.size / 2, p.size, p.size)
      }
      ctx.globalAlpha = 1
    }

    const step = (dt: number) => {
      const range = W < 700 ? 120 : 170 // alcance de la repulsión más allá del radio intocable
      const relax = 1 - Math.exp(-dt * RELAX)

      for (const p of particles) {
        const keep = p.size * 0.46 + CLEARANCE
        let dx = p.x - cursor.x
        let dy = p.y - cursor.y
        let d = Math.hypot(dx, dy)

        // repulsión suave: crece al acercarse el cursor
        if (d < keep + range) {
          if (d < 0.001) {
            dx = 1
            dy = 0
            d = 1
          }
          const t = 1 - Math.max(0, d - keep) / range
          const a = PUSH * t * t * dt
          p.vx += (dx / d) * a
          p.vy += (dy / d) * a
        }

        // vuelve de a poco a su deriva original
        p.vx += (p.bx - p.vx) * relax
        p.vy += (p.by - p.vy) * relax
        const speed = Math.hypot(p.vx, p.vy)
        if (speed > MAX_SPEED) {
          p.vx *= MAX_SPEED / speed
          p.vy *= MAX_SPEED / speed
        }

        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt

        // al salir por un borde reaparece por el opuesto
        const m = p.size
        if (p.x < -m) p.x = W + m
        else if (p.x > W + m) p.x = -m
        if (p.y < -m) p.y = H + m
        else if (p.y > H + m) p.y = -m

        // restricción dura (después del wrap): por rápido que se mueva el cursor, nunca entra en el radio
        dx = p.x - cursor.x
        dy = p.y - cursor.y
        d = Math.hypot(dx, dy)
        if (d < keep) {
          const nx = d > 0.001 ? dx / d : 1
          const ny = d > 0.001 ? dy / d : 0
          p.x = cursor.x + nx * keep
          p.y = cursor.y + ny * keep
          const inward = p.vx * nx + p.vy * ny
          if (inward < 0) {
            p.vx -= inward * nx
            p.vy -= inward * ny
          }
        }
      }
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
      last = now
      step(dt)
      draw()
      raf = requestAnimationFrame(frame)
    }

    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w === W && h === H) return
      W = w
      H = h
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      const target = Math.round(Math.min(150, Math.max(40, (W * H) / 14000)))
      while (particles.length < target) particles.push(spawn())
      particles.length = Math.min(particles.length, target)
      if (reduced) draw()
    }

    const onMove = (e: PointerEvent) => {
      cursor.x = e.clientX
      cursor.y = e.clientY
    }
    const onLeave = () => {
      cursor.x = cursor.y = OFFSCREEN
    }
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') onLeave() // el dedo levantado ya no empuja
    }

    const start = () => {
      if (cancelled) return
      sprites = TONES.map((color) => SPRITE_SIZES.map((px) => makeSprite(px, color)))
      ro = new ResizeObserver(resize)
      ro.observe(canvas)
      resize()
      if (reduced) {
        draw()
        return
      }
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    // esperar a Archivo para que los sprites usen la misma tipografía que la infografía
    document.fonts.load('800 64px Archivo', '$').catch(() => {}).then(start)

    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onMove, { passive: true })
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onLeave)
      window.addEventListener('blur', onLeave)
      document.documentElement.addEventListener('pointerleave', onLeave)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      ro?.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onLeave)
      window.removeEventListener('blur', onLeave)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className="campo-dolares" aria-hidden="true" />
}
