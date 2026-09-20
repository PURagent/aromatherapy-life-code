export function Icon({ name }: { name: 'arrow' | 'back' | 'lock' | 'download' | 'leaf' | 'check' | 'bag' | 'plus' | 'minus' | 'close' | 'chat' }) {
  const paths = {
    arrow: 'M5 12h14m-5-5 5 5-5 5', back: 'M19 12H5m5-5-5 5 5 5',
    lock: 'M7 10V7a5 5 0 0 1 10 0v3M6 10h12v11H6zM12 14v3',
    download: 'M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5',
    leaf: 'M5 19c-3-12 8-15 15-15 0 9-4 17-13 13M4 21 15 10', check: 'm5 12 4 4 10-10',
    bag: 'M6 8h12l1 13H5L6 8Zm3 0V6a3 3 0 0 1 6 0v2',
    plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', close: 'M6 6l12 12M18 6 6 18',
    chat: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2z',
  }
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
export function BrandMark() {
  return <svg className="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth=".7" />{Array.from({ length: 6 }, (_, index) => <ellipse key={index} cx="24" cy="17" rx="5.5" ry="10" transform={`rotate(${index * 60} 24 24)`} stroke="currentColor" strokeWidth=".7" />)}<circle cx="24" cy="24" r="2" fill="currentColor" /></svg>
}
export function AromaWheel({ compact = false }: { compact?: boolean }) {
  return <div className={`aroma-wheel${compact ? ' compact' : ''}`} aria-hidden="true"><svg viewBox="0 0 420 420" fill="none">
    <circle cx="210" cy="210" r="195" stroke="currentColor" strokeWidth=".45" /><circle cx="210" cy="210" r="181" stroke="currentColor" strokeWidth=".6" /><circle cx="210" cy="210" r="141" stroke="currentColor" strokeWidth=".45" />
    {Array.from({ length: 72 }, (_, index) => <path key={`tick${index}`} d={index % 8 === 0 ? 'M210 19v12' : 'M210 24v5'} transform={`rotate(${index * 5} 210 210)`} stroke="currentColor" strokeWidth={index % 8 === 0 ? 1 : .4} />)}
    <g className="wheel-petals">{Array.from({ length: 9 }, (_, index) => <ellipse key={index} cx="210" cy="161" rx="40" ry="82" transform={`rotate(${index * 40} 210 210)`} stroke="currentColor" strokeWidth=".65" />)}</g>
    {Array.from({ length: 9 }, (_, index) => { const angle = (index * 40 - 90) * Math.PI / 180; return <text key={`number${index}`} x={210 + Math.cos(angle) * 161} y={218 + Math.sin(angle) * 161} fill="currentColor" stroke="none" textAnchor="middle">{index + 1}</text> })}
    <circle cx="210" cy="210" r="38" fill="var(--color-base)" stroke="currentColor" strokeWidth=".6" /><path d="M210 185c-2 11-15 17-15 28a15 15 0 0 0 30 0c0-11-13-17-15-28Z" stroke="currentColor" strokeWidth="1" /><path d="M202 215c0 4 3 7 7 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg></div>
}
