import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { LocalLink } from '../App'
import type { Navigate } from '../App'
import { BrandMark, Icon } from '../components/Visuals'
import { StorySlideshow } from '../components/StorySlideshow'
const AmberScene = lazy(() => import('../scene/AmberScene'))
const moods = [
  { name: 'ม่วงจันทรา', color: '#c29aff' },
  { name: 'ครามดารา', color: '#83d9fa' },
  { name: 'กุหลาบราตรี', color: '#f3a5cd' },
]
function Spark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 2c0 10-4 14-14 14 10 0 14 4 14 14 0-10 4-14 14-14-10 0-14-4-14-14Z" stroke="currentColor" strokeWidth="1.1" /><path d="m5 5 4 4m14 14 4 4M5 27l4-4M23 9l4-4" stroke="currentColor" /></svg>
}
export function HomePage({ children, navigate }: { children: ReactNode; navigate: Navigate }) {
  const [paused, setPaused] = useState(false)
  const [mood, setMood] = useState(0)
  const [burst, setBurst] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const homeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const nodes = homeRef.current?.querySelectorAll('[data-reveal]')
    if (!nodes) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-entered', 'true')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.16 })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
  return <div className="sanctuary" ref={homeRef} data-motion-paused={paused || reducedMotion} data-mood={mood} style={{ '--mood-light': moods[mood].color } as CSSProperties}>
    <section className="portal-hero" aria-labelledby="portal-title">
      <div className="celestial-dust" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ '--star-x': `${(i * 37.7 + 3) % 100}%`, '--star-y': `${(i * 23.3 + 8) % 100}%`, '--star-delay': `${(i % 7) * -0.8}s`, '--star-size': `${i % 4 === 0 ? 3 : 1.5}px` } as CSSProperties} />)}</div>
      <div className="portal-heading"><h1 id="portal-title">Aromatherapy <em>Life Code</em></h1><p className="portal-thai">เปิดประตูสู่จักรวาลแห่งกลิ่น</p><p className="portal-description">เรื่องราวของตัวเลข ความหอม และช่วงเวลาที่ได้กลับมาหาตัวเอง</p></div>
      <div className="portal-stage">
        <div className="portal-annotation portal-annotation--left" aria-hidden="true"><Spark /><span>The art<br /><em>of connection.</em></span><i /></div>
        <div className="hero-scene-shell"><Suspense fallback={<div className="scene-loading" aria-hidden="true"><BrandMark /><span>กำลังเปิดจักรวาลแห่งกลิ่น</span></div>}><AmberScene paused={paused} mood={mood} burst={burst} /></Suspense></div>
        <div className="portal-annotation portal-annotation--right" aria-hidden="true"><i /><span>A little<br /><em>inner universe.</em></span><Spark /></div>
        <p className="scene-caption">ลากเพื่อหมุนชม · ขยับเพื่อเปลี่ยนมุมมอง</p>
      </div>
      <div className="portal-actions"><LocalLink to="/#begin" navigate={navigate} className="button primary hero-cta"><Spark />เริ่มสำรวจรหัสของคุณ<Icon name="arrow" /></LocalLink><p className="hero-disclosure">ต้นแบบประสบการณ์ · รอการยืนยันสูตรคำนวณ</p></div>
      <div className="scene-console">
        <div className="mood-switch" role="group" aria-label="เลือกบรรยากาศของฉาก">{moods.map((item, index) => <button type="button" key={item.name} aria-pressed={mood === index} onClick={() => { setMood(index); setBurst((value) => value + 1) }} style={{ '--swatch': item.color } as CSSProperties}><i aria-hidden="true" /><span>{item.name}</span></button>)}</div>
        <div className="scene-tools"><button type="button" className="spark-control" onClick={() => setBurst((value) => value + 1)} disabled={paused || reducedMotion}><Spark /><span>ปลุกประกาย</span></button><button type="button" className="motion-control" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'เปิดการเคลื่อนไหว 3D' : 'หยุดการเคลื่อนไหว 3D'}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{paused ? <path d="m9 5 10 7-10 7V5Z" fill="currentColor" /> : <path d="M8 6v12M16 6v12" stroke="currentColor" strokeWidth="1.5" />}</svg><span>{paused ? 'เล่นต่อ' : 'หยุดภาพ'}</span></button></div>
      </div>
      <div className="hero-bottom"><span>ART · AROMA · IMAGINATION</span><a href="#scent-story">เดินทางต่อ <Icon name="arrow" /></a><span>BY MORNAENAE</span></div>
    </section>
    <section className="scent-story" id="scent-story" aria-labelledby="story-heading" data-reveal>
      <div className="story-heading"><Spark /><h2 id="story-heading">หนึ่งตัวเลข<br />หลายเรื่องราว<span>ความหอมในแบบคุณ</span></h2><p>เปิดโลกของตัวเลขผ่านเสน่ห์แห่งกลิ่น<br />ทำความรู้จักคอลเลกชันของ หมอเน่ mornaenae<br />แล้วเลือกกลิ่นที่อยากให้เป็นส่วนหนึ่งของวัน</p><LocalLink to="/scents" navigate={navigate} className="text-link">เปิดโลกความหอมทั้ง 9 <Icon name="arrow" /></LocalLink></div>
      <StorySlideshow reducedMotion={reducedMotion} />
    </section>
    <div className="ritual-divider" aria-hidden="true"><i /><Spark /><span>YOUR STORY IS A UNIVERSE</span><Spark /><i /></div>
    {children}
  </div>
}
