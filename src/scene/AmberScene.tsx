import { useEffect, useRef, useState } from 'react'
import { createAmberRenderer, type AmberMotion, type AmberRenderer } from './amberRenderer'
import './scene.css'

export type AmberSceneProps = { paused: boolean; mood?: number; burst?: number; onReady?: () => void }

export default function AmberScene({ paused, mood = 0, burst = 0, onReady }: AmberSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pausedRef = useRef(paused)
  const readyRef = useRef(onReady)
  const artRef = useRef({ mood, burst })
  const refreshRef = useRef<(() => void) | null>(null)
  const [contextVersion, setContextVersion] = useState(0)
  useEffect(() => {
    pausedRef.current = paused
    refreshRef.current?.()
  }, [paused])
  useEffect(() => {
    artRef.current = { mood, burst }
    refreshRef.current?.()
  }, [mood, burst])
  useEffect(() => { readyRef.current = onReady }, [onReady])

  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current
    if (!host || !canvas) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let renderer: AmberRenderer | undefined
    let frame = 0, previous = 0, visible = true, contextLost = false, disposed = false, frames = 0
    let dragging = false, dragId = -1, dragX = 0, dragY = 0, dragOrbit = 0
    const frameInterval = 1000 / 30
    const motion: AmberMotion = { pointerX: 0, pointerY: 0, scroll: 0, orbit: 0, ...artRef.current }
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; previous = 0 }
    const active = () => !disposed && !contextLost && visible && !document.hidden && !pausedRef.current && !media.matches
    const updateState = () => {
      host.dataset.sceneState = contextLost || !renderer ? 'fallback' :
        media.matches ? 'reduced-motion' : pausedRef.current ? 'paused' :
          document.hidden ? 'hidden' : !visible ? 'offscreen' : 'ready'
      host.dataset.sceneMood = String(artRef.current.mood)
    }
    const syncArt = () => {
      if (motion.burst !== artRef.current.burst) motion.orbit = 0
      motion.mood = artRef.current.mood
      motion.burst = artRef.current.burst
    }
    const draw = (now: number) => {
      frame = 0
      if (disposed || contextLost || !renderer) return
      if (active() && previous && now - previous < frameInterval - 1) {
        frame = requestAnimationFrame(draw)
        return
      }
      const delta = previous ? (now - previous) / 1000 : 0
      previous = now
      syncArt()
      renderer.render(delta, motion, active())
      frames += 1
      if (import.meta.env.DEV) canvas.dataset.frames = String(frames)
      if (active()) frame = requestAnimationFrame(draw)
    }
    const refresh = () => {
      stop(); updateState()
      if (!disposed && !contextLost && renderer && visible && !document.hidden) frame = requestAnimationFrame(draw)
    }
    const resize = () => {
      const bounds = host.getBoundingClientRect()
      if (renderer && !contextLost) {
        renderer.resize(bounds.width, bounds.height)
        syncArt(); renderer.render(0, motion, false)
      }
      refresh()
    }
    const scroll = () => {
      if (!active()) return
      const hero = host.closest('section') ?? host
      const bounds = hero.getBoundingClientRect()
      motion.scroll = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height * .8)))
    }
    const pointer = (event: PointerEvent) => {
      if (!active()) return
      const bounds = host.getBoundingClientRect()
      if (dragging && event.pointerId === dragId) {
        const distanceX = event.clientX - dragX
        // Vertical touch motion belongs to document scrolling (touch-action: pan-y).
        if (event.pointerType !== 'touch' || Math.abs(distanceX) > Math.abs(event.clientY - dragY)) {
          motion.orbit = Math.max(-.62, Math.min(.62, dragOrbit + distanceX / Math.max(1, bounds.width) * 1.6))
        }
      }
      if (event.pointerType === 'touch') return
      motion.pointerX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1))
      motion.pointerY = Math.max(-1, Math.min(1, -((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2 + 1))
    }
    const pointerDown = (event: PointerEvent) => {
      if (!active() || event.button !== 0) return
      dragging = true; dragId = event.pointerId; dragX = event.clientX; dragY = event.clientY; dragOrbit = motion.orbit
      host.dataset.dragging = 'true'
      canvas.setPointerCapture(event.pointerId)
    }
    const pointerEnd = (event: PointerEvent) => {
      if (dragId !== event.pointerId) return
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      dragging = false; dragId = -1; host.dataset.dragging = 'false'
    }
    const pointerLeave = () => { if (!dragging) { motion.pointerX = 0; motion.pointerY = 0 } }
    const loseContext = (event: Event) => {
      event.preventDefault(); contextLost = true; stop()
      host.dataset.sceneVisible = 'false'; updateState()
    }
    const restoreContext = () => { if (!disposed) setContextVersion((version) => version + 1) }
    try {
      renderer = createAmberRenderer(canvas)
      const bounds = host.getBoundingClientRect()
      renderer.resize(bounds.width, bounds.height); renderer.render(0, motion, false)
      host.dataset.sceneVisible = 'true'
    } catch {
      renderer?.dispose(); renderer = undefined
      host.dataset.sceneVisible = 'false'; updateState(); readyRef.current?.()
      return () => { disposed = true }
    }
    readyRef.current?.()
    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true; refresh()
    }, { rootMargin: '40px' })
    resizeObserver.observe(host); intersectionObserver.observe(host)
    media.addEventListener('change', refresh)
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('scroll', scroll, { passive: true })
    canvas.addEventListener('pointermove', pointer, { passive: true })
    canvas.addEventListener('pointerdown', pointerDown)
    canvas.addEventListener('pointerup', pointerEnd)
    canvas.addEventListener('pointercancel', pointerEnd)
    canvas.addEventListener('pointerleave', pointerLeave, { passive: true })
    canvas.addEventListener('webglcontextlost', loseContext)
    canvas.addEventListener('webglcontextrestored', restoreContext)
    refreshRef.current = refresh; refresh()
    return () => {
      disposed = true; stop(); refreshRef.current = null
      resizeObserver.disconnect(); intersectionObserver.disconnect()
      media.removeEventListener('change', refresh)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('scroll', scroll)
      canvas.removeEventListener('pointermove', pointer)
      canvas.removeEventListener('pointerdown', pointerDown)
      canvas.removeEventListener('pointerup', pointerEnd)
      canvas.removeEventListener('pointercancel', pointerEnd)
      canvas.removeEventListener('pointerleave', pointerLeave)
      canvas.removeEventListener('webglcontextlost', loseContext)
      canvas.removeEventListener('webglcontextrestored', restoreContext)
      renderer?.dispose()
    }
  }, [contextVersion])

  return <div className="amber-scene" ref={hostRef} aria-hidden="true" data-scene-state="loading" data-scene-visible="false">
    <img className="amber-scene__fallback" src="/images/celestial-sanctuary.webp" alt="" width="2200" height="1228" decoding="async" />
    <canvas ref={canvasRef} className="amber-scene__canvas" />
  </div>
}
