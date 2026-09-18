import * as THREE from 'three'

const TAU = Math.PI * 2

function texture(size: number, paint: (context: CanvasRenderingContext2D, size: number) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas drawing is unavailable')
  paint(context, size)
  const map = new THREE.CanvasTexture(canvas)
  map.colorSpace = THREE.SRGBColorSpace
  return map
}

export function glowTexture() {
  return texture(128, (ctx, size) => {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.12, 'rgba(255,255,255,.72)')
    gradient.addColorStop(0.36, 'rgba(255,255,255,.17)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  })
}

export function starTexture() {
  return texture(128, (ctx) => {
    ctx.translate(64, 64)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 62)
    gradient.addColorStop(0, '#fff9df')
    gradient.addColorStop(.1, 'rgba(255,239,185,.9)')
    gradient.addColorStop(.4, 'rgba(255,223,143,.1)')
    gradient.addColorStop(1, 'rgba(255,220,140,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(-64, -64, 128, 128)
    ctx.fillStyle = '#fffbe9'
    ctx.beginPath()
    ctx.moveTo(0, -55); ctx.quadraticCurveTo(2, -2, 42, 0)
    ctx.quadraticCurveTo(2, 2, 0, 55); ctx.quadraticCurveTo(-2, 2, -42, 0)
    ctx.quadraticCurveTo(-2, -2, 0, -55); ctx.fill()
  })
}

/** Original decorative geometry. Numerals never encode a visitor's result. */
export function mandalaTexture(numbers = false) {
  return texture(1536, (ctx, size) => {
    ctx.translate(size / 2, size / 2)
    ctx.strokeStyle = '#d8b566'
    ctx.fillStyle = '#fce5a7'
    ctx.lineWidth = 1.1
    const circle = (radius: number) => { ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU); ctx.stroke() }
    if (numbers) {
      circle(648); circle(643); circle(558); circle(552)
      for (let index = 0; index < 9; index++) {
        const angle = index / 9 * TAU - Math.PI / 2
        ctx.save(); ctx.rotate(angle)
        ctx.beginPath(); ctx.moveTo(558, 0); ctx.lineTo(643, 0); ctx.stroke()
        ctx.restore()
        const textAngle = angle + Math.PI / 9
        ctx.font = 'italic 52px Georgia, serif'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.shadowBlur = 16; ctx.shadowColor = '#edba56'
        ctx.fillText(String(index + 1), Math.cos(textAngle) * 601, Math.sin(textAngle) * 601)
        ctx.shadowBlur = 0
      }
      for (let index = 0; index < 180; index++) {
        ctx.save(); ctx.rotate(index / 180 * TAU)
        ctx.beginPath(); ctx.moveTo(657, 0); ctx.lineTo(index % 5 ? 663 : 671, 0); ctx.stroke(); ctx.restore()
      }
      return
    }
    circle(532); circle(522); circle(512); circle(486); circle(280); circle(272); circle(132)
    for (let index = 0; index < 72; index++) {
      ctx.save(); ctx.rotate(index / 72 * TAU)
      ctx.beginPath(); ctx.moveTo(489, 0); ctx.lineTo(507, 0); ctx.stroke()
      ctx.beginPath(); ctx.ellipse(464, 0, 38, 8, 0, 0, TAU); ctx.stroke()
      ctx.restore()
    }
    for (let index = 0; index < 24; index++) {
      ctx.save(); ctx.rotate(index / 24 * TAU)
      ctx.beginPath(); ctx.moveTo(137, 0)
      ctx.bezierCurveTo(252, -91, 351, -50, 425, 0)
      ctx.bezierCurveTo(351, 50, 252, 91, 137, 0); ctx.stroke()
      ctx.beginPath(); ctx.arc(450, 0, 3, 0, TAU); ctx.fill()
      ctx.restore()
    }
    for (let layer = 0; layer < 2; layer++) {
      ctx.save(); ctx.rotate(layer * Math.PI / 3)
      ctx.beginPath()
      for (let corner = 0; corner < 3; corner++) {
        const angle = corner / 3 * TAU - Math.PI / 2
        const x = Math.cos(angle) * 246, y = Math.sin(angle) * 246
        if (!corner) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.closePath(); ctx.stroke(); ctx.restore()
    }
    for (let index = 0; index < 12; index++) {
      ctx.save(); ctx.rotate(index / 12 * TAU)
      ctx.beginPath(); ctx.ellipse(66, 0, 64, 20, 0, 0, TAU); ctx.stroke(); ctx.restore()
    }
  })
}

export function lotusTexture(color: string, petals: number) {
  return texture(256, (ctx) => {
    ctx.translate(128, 128)
    ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.shadowColor = color; ctx.shadowBlur = 8
    for (let layer = 0; layer < 2; layer++) {
      for (let index = 0; index < petals; index++) {
        ctx.save(); ctx.rotate(index / petals * TAU + layer * Math.PI / petals)
        ctx.beginPath(); ctx.moveTo(28, 0)
        ctx.bezierCurveTo(48, -29, 88, -26, 103 - layer * 15, 0)
        ctx.bezierCurveTo(88, 26, 48, 29, 28, 0); ctx.stroke(); ctx.restore()
      }
    }
    ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.stroke()
    ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(23, 16); ctx.lineTo(-23, 16); ctx.closePath(); ctx.stroke()
    ctx.rotate(Math.PI)
    ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(23, 16); ctx.lineTo(-23, 16); ctx.closePath(); ctx.stroke()
  })
}

export function bottleLabelTexture(name: string) {
  return texture(512, (ctx) => {
    ctx.fillStyle = '#120c20'; ctx.fillRect(0, 0, 512, 512)
    const gold = ctx.createLinearGradient(0, 0, 512, 512)
    gold.addColorStop(0, '#92703b'); gold.addColorStop(.36, '#f4db99'); gold.addColorStop(.64, '#b08b48'); gold.addColorStop(1, '#f9e5ae')
    ctx.strokeStyle = gold; ctx.fillStyle = gold; ctx.lineWidth = 3
    ctx.strokeRect(19, 19, 474, 474); ctx.strokeRect(28, 28, 456, 456)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.font = '31px Georgia, serif'; ctx.fillText('LIFE CODE', 256, 121)
    ctx.font = 'italic 42px Georgia, serif'; ctx.fillText(name, 256, 350)
    ctx.translate(256, 235)
    for (let index = 0; index < 8; index++) {
      ctx.save(); ctx.rotate(index * TAU / 8)
      ctx.beginPath(); ctx.ellipse(25, 0, 31, 11, 0, 0, TAU); ctx.stroke(); ctx.restore()
    }
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, TAU); ctx.stroke()
  })
}

export function engravingTexture() {
  return texture(512, (ctx) => {
    ctx.fillStyle = '#100c10'; ctx.fillRect(0, 0, 512, 512)
    const gold = ctx.createLinearGradient(0, 0, 0, 512)
    gold.addColorStop(0, '#92703b'); gold.addColorStop(.3, '#e3c889'); gold.addColorStop(.65, '#b78b46'); gold.addColorStop(1, '#f0d597')
    ctx.strokeStyle = gold; ctx.lineWidth = 3.4
    // Repeating acanthus-like fronds are engraved into dark metal, rather than
    // using a wide untextured gold band around the altar and bottle collars.
    for (let index = 0; index < 8; index++) {
      const x = index * 64
      ctx.save(); ctx.translate(x, 256)
      ctx.beginPath(); ctx.moveTo(0, 205); ctx.bezierCurveTo(-54, 87, 56, -87, 0, -205); ctx.stroke()
      for (let leaf = 0; leaf < 5; leaf++) {
        const y = -150 + leaf * 73
        const direction = leaf % 2 ? -1 : 1
        ctx.beginPath(); ctx.moveTo(0, y + 26)
        ctx.bezierCurveTo(direction * 48, y + 14, direction * 41, y - 33, direction * 11, y - 35)
        ctx.bezierCurveTo(direction * 34, y - 5, direction * 19, y + 8, 0, y + 26); ctx.stroke()
      }
      ctx.restore()
    }
    ctx.strokeRect(0, 21, 512, 470); ctx.strokeRect(0, 38, 512, 436)
  })
}
