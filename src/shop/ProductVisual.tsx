import type { CSSProperties } from 'react'

const hues = ['#b08d39', '#75439c', '#a5464b', '#437b58', '#387f94', '#62599f', '#b77535', '#a68d51', '#68546f']

export function BottleVisual({ index = 0, small = false }: { index?: number; small?: boolean }) {
  return <div className={`cart-bottle-scene${small ? ' cart-bottle-scene--small' : ''}`} aria-hidden="true" style={{ '--bottle-hue': hues[index % hues.length] } as CSSProperties}>
    <span className="cart-bottle-halo" /><span className="cart-bottle-shadow" />
    <div className="cart-bottle"><div className="cart-bottle-cap" /><div className="cart-bottle-glass"><div className="cart-bottle-label"><span>Life Code</span><i>✧</i><small>AROMA COLLECTION</small><b>{String(index + 1).padStart(2, '0')}</b></div></div></div>
  </div>
}

