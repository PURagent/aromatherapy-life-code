import { useEffect, useState } from 'react'

const posters = [
  'โปสเตอร์ต้นฉบับหมอเน่ — Aromatherapy Life Code และกลิ่นหอมสามขวด',
  'โปสเตอร์ต้นฉบับหมอเน่ — พลังของกลิ่นและความหมายเก้าตัวเลข',
  'โปสเตอร์ต้นฉบับหมอเน่ — รายการกลิ่นและคอลเลกชันสินค้า',
  'โปสเตอร์ต้นฉบับหมอเน่ — แนวคิดกลิ่นหอมและเครื่องกระจายกลิ่น',
]

export function StorySlideshow({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set())
  const playing = loaded.size === posters.length && !paused && !hovered && !focused && !hidden && !reducedMotion

  useEffect(() => {
    const update = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setIndex(value => (value + 1) % posters.length), 5000)
    return () => window.clearInterval(timer)
  }, [playing, index])

  function select(next: number) {
    setIndex((next + posters.length) % posters.length)
  }

  return <figure className="story-slideshow" aria-label="ภาพเรื่องราว Aromatherapy Life Code" aria-roledescription="สไลด์โชว์"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div className="story-slideshow__stage" aria-live={playing ? 'off' : 'polite'}>
      {posters.map((alt, position) => <div key={alt} className="story-slideshow__slide" data-active={index === position} aria-hidden={index !== position} role="group" aria-roledescription="สไลด์" aria-label={`${position + 1} จาก ${posters.length}`}>
        <img src={`${import.meta.env.BASE_URL}images/story/poster-padded-${position + 1}.svg`} width="1200" height="2000" alt={alt} decoding="async" onLoad={() => setLoaded(previous => new Set(previous).add(position))} />
      </div>)}
    </div>
    <div className="story-slideshow__controls">
      <button type="button" onClick={() => select(index - 1)} aria-label="ภาพก่อนหน้า">←</button>
      <div className="story-slideshow__dots" role="group" aria-label="เลือกภาพ">{posters.map((alt, position) => <button key={alt} type="button" aria-label={`ดูภาพที่ ${position + 1}`} aria-pressed={index === position} onClick={() => select(position)}><span /></button>)}</div>
      <button type="button" onClick={() => select(index + 1)} aria-label="ภาพถัดไป">→</button>
      <button className="story-slideshow__pause" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} disabled={reducedMotion}>{reducedMotion ? 'เลื่อนด้วยปุ่ม' : paused ? 'เล่นต่อ' : 'หยุดสไลด์'}</button>
    </div>
    <figcaption><span>The Celestial Sanctuary</span><span>{String(index + 1).padStart(2, '0')} / 04 · BY MORNAENAE</span></figcaption>
    <a className="text-link" href={`${import.meta.env.BASE_URL}images/story/poster-${index + 1}.png`} target="_blank" rel="noopener noreferrer">เปิดอ่านภาพต้นฉบับ ↗</a>
  </figure>
}
