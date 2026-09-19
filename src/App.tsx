import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { lifeCodeEngine } from './engine'
import type { LifeCodeInput, LifeCodeResult } from './engine'
import { FormPage } from './routes/FormPage'
import { HomePage } from './routes/HomePage'
import { emptyDraft } from './components/form-state'
import type { FormDraft } from './components/form-state'
import { ResultPage } from './routes/ResultPage'
import { CataloguePage, NumberPage, PrivacyPage } from './routes/ContentPages'
import { Icon, BrandMark } from './components/Visuals'
import site from './content/site.json'
import { useShop } from './shop/useShop'
import { ShopDrawer } from './shop/ShopDrawer'
import { featureLinks, featureRoute } from './feature-links'

export type Navigate = (path: string) => void
export type SessionResult = { input: LifeCodeInput; result: LifeCodeResult }
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
function appPath(pathname: string) {
  const stripped = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname
  return stripped || '/'
}

export function LocalLink({ to, navigate, children, className, current }: {
  to: string; navigate: Navigate; children: ReactNode; className?: string; current?: boolean
}) {
  function follow(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }
  return <a href={`${basePath}${to}`} onClick={follow} className={className} aria-current={current ? 'page' : undefined}>{children}</a>
}

function App() {
  const { count, openCart, closeCart } = useShop()
  const [location, setLocation] = useState(() => appPath(window.location.pathname) + window.location.hash)
  const route = featureRoute(location)
  const [menuOpen, setMenuOpen] = useState(false)
  const [draft, setDraft] = useState<FormDraft>(emptyDraft)
  const [session, setSession] = useState<SessionResult | null>(null)
  const [notice, setNotice] = useState('')
  const main = useRef<HTMLElement>(null)
  const hasNavigated = useRef(false)
  const navigate = useCallback((path: string) => {
    const fullPath = `${basePath}${path}`
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== fullPath) window.history.pushState(null, '', fullPath)
    hasNavigated.current = true
    setMenuOpen(false)
    closeCart()
    setLocation(path)
    if (path === '/#cart') openCart()
    if (path.includes('#')) {
      requestAnimationFrame(() => {
        const target = document.getElementById(path.split('#')[1])
        target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
        target?.focus({ preventScroll: true })
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    main.current?.focus({ preventScroll: true })
  }, [openCart, closeCart])

  useEffect(() => {
    const onBack = () => { hasNavigated.current = true; setMenuOpen(false); setLocation(appPath(window.location.pathname) + window.location.hash) }
    window.addEventListener('popstate', onBack)
    window.addEventListener('hashchange', onBack)
    return () => { window.removeEventListener('popstate', onBack); window.removeEventListener('hashchange', onBack) }
  }, [])

  useEffect(() => {
    if (location === '/#cart') openCart()
    else closeCart()
    const hash = location.split('#')[1]
    let cancelled = false
    const scroll = () => {
      if (cancelled) return
      const target = hash && document.getElementById(hash)
      if (target) { target.scrollIntoView({ block: 'start', behavior: 'instant' }); target.focus({ preventScroll: true }) }
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }
    const frame = requestAnimationFrame(scroll)
    void document.fonts.ready.then(scroll)
    return () => { cancelled = true; cancelAnimationFrame(frame) }
  }, [location, openCart, closeCart])

  useEffect(() => {
    const title = route === '/result' ? 'สถานะรหัสของคุณ' : route === '/scents' ? 'โลกของกลิ่น' : route === '/privacy' ? 'ความเป็นส่วนตัว' : 'Life Code — The Celestial Sanctuary'
    document.title = `${title} — หมอเน่ mornaenae`
    if (hasNavigated.current) main.current?.focus({ preventScroll: true })
  }, [route])

  function reset() {
    setDraft({ ...emptyDraft })
    setSession(null)
    setNotice('ล้างชื่อ วันเกิด และเวลาเกิดจากหน้านี้แล้ว')
    navigate('/')
  }
  function submit(input: LifeCodeInput) {
    setSession({ input, result: lifeCodeEngine.calculate(input) })
    setNotice('')
    navigate('/result')
  }
  const numberMatch = /^\/numbers\/([1-9])\/?$/.exec(route)
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">ข้ามไปเนื้อหา</a>
      <header className="site-header">
        <LocalLink to="/" navigate={navigate} className="brand"><BrandMark /><span>Life Code<small>by {site.practitioner}</small></span></LocalLink>
        <nav aria-label="เมนูหลัก"><LocalLink to="/#scent-story" navigate={navigate} className="nav-world">โลกของกลิ่น</LocalLink><LocalLink to="/#collection" navigate={navigate} current={route === '/scents'}>สินค้า</LocalLink><LocalLink to="/#begin" navigate={navigate} className="nav-start">สำรวจรหัส <Icon name="arrow" /></LocalLink><button type="button" className="feature-menu-toggle" aria-expanded={menuOpen} aria-controls="feature-menu" onClick={() => setMenuOpen(value => !value)}>เมนู</button><button type="button" className="nav-cart" onClick={() => navigate('/#cart')} aria-label={`เปิดตะกร้า มี ${count} รายการ`}><Icon name="bag" /><span>{count}</span></button></nav>
        {menuOpen && <nav className="feature-menu" id="feature-menu" aria-label="ฟีเจอร์ทั้งหมด" onKeyDown={event => { if (event.key === 'Escape') { setMenuOpen(false); document.querySelector<HTMLButtonElement>('.feature-menu-toggle')?.focus() } }}>{featureLinks.map(link => <LocalLink key={link.path} to={link.path} navigate={navigate}>{link.label}<span aria-hidden="true">↗</span></LocalLink>)}</nav>}
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        {route === '/' ? <HomePage navigate={navigate}><FormPage draft={draft} setDraft={setDraft} onSubmit={submit} onReset={reset} notice={notice} navigate={navigate} /></HomePage>
          : route === '/result' ? <ResultPage session={session} navigate={navigate} onReset={reset} />
          : route === '/scents' ? <CataloguePage navigate={navigate} />
          : route === '/privacy' ? <PrivacyPage navigate={navigate} />
          : numberMatch ? <NumberPage number={Number(numberMatch[1])} navigate={navigate} />
          : <section className="empty-page"><h1>ไม่พบหน้านี้</h1><p>กลับไปเริ่มต้น หรือเลือกสำรวจกลิ่นจากเมนูด้านบนได้เลย</p><LocalLink to="/" navigate={navigate} className="button primary">กลับหน้าเริ่มต้น <Icon name="arrow" /></LocalLink></section>}
      </main>
      <footer className="site-footer"><div className="footer-signature">Life Code<span>Every soul, a universe.</span></div><p>{site.disclaimer}</p><div><span>Aromatherapy Life Code <span aria-hidden="true">·</span> {site.practitioner}</span><LocalLink to="/privacy" navigate={navigate}>ความเป็นส่วนตัว</LocalLink></div></footer>
      <ShopDrawer />
    </div>
  )
}
export default App
