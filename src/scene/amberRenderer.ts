/**
 * Fantasy art direction and all bottle/mandala geometry are original.
 * Lifecycle/orbital-group foundation adapted from ThreeUI Community, MIT.
 * Copyright (c) 2026 Meng To. See THIRD_PARTY_NOTICES.md.
 */
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { bottleLabelTexture, engravingTexture, glowTexture, lotusTexture, mandalaTexture, starTexture } from './sacredTextures'

export type AmberMotion = { pointerX: number; pointerY: number; scroll: number; orbit: number; mood: number; burst: number }
export type AmberRenderer = {
  resize: (width: number, height: number) => void
  render: (delta: number, motion: AmberMotion, animate: boolean) => void
  dispose: () => void
}
const TAU = Math.PI * 2
const damp = (value: number, target: number, rate: number, delta: number) => THREE.MathUtils.lerp(value, target, 1 - Math.exp(-rate * delta))
const palette = [0xba82ff, 0x69dcff, 0xfca8c8]
const jewelColors = ['#c48aff', '#6582ff', '#4fdafa', '#8eea84', '#fce585', '#ffb96a', '#ff6d89']

// Reproducible decorative positions; no date, name, or calculation enters art.
function seeded(seed: number) {
  let value = seed
  return () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296 }
}

export function createAmberRenderer(canvas: HTMLCanvasElement): AmberRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: 'default' })
  renderer.setPixelRatio(1)
  renderer.setClearColor(0x090611, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = .99
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40)
  const room = new RoomEnvironment()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(room, .035)
  scene.environment = environment.texture
  scene.environmentIntensity = .65
  room.dispose(); pmrem.dispose()

  const textures: THREE.Texture[] = []
  const materials = new Set<THREE.Material>()
  const geometries = new Set<THREE.BufferGeometry>()
  const material = <T extends THREE.Material>(value: T) => { materials.add(value); return value }
  const geometry = <T extends THREE.BufferGeometry>(value: T) => { geometries.add(value); return value }
  const map = (value: THREE.Texture) => { textures.push(value); return value }
  const glowMap = map(glowTexture()), starMap = map(starTexture())
  const gold = material(new THREE.MeshStandardMaterial({ color: 0xc7a05c, metalness: .92, roughness: .27, envMapIntensity: .92 }))
  const oldGold = material(new THREE.MeshStandardMaterial({ color: 0x705023, metalness: .84, roughness: .38, envMapIntensity: .65 }))
  const ivoryGold = material(new THREE.MeshStandardMaterial({ color: 0xf1d58d, metalness: .73, roughness: .24, emissive: 0x775223, emissiveIntensity: .17 }))
  const obsidian = material(new THREE.MeshStandardMaterial({ color: 0x050307, metalness: .12, roughness: .3, envMapIntensity: .065 }))
  const engraved = material(new THREE.MeshStandardMaterial({ color: 0xd7b981, map: map(engravingTexture()), metalness: .72, roughness: .36, envMapIntensity: .6 }))

  scene.add(new THREE.HemisphereLight(0xebdeff, 0x0a0515, 1.15))
  const key = new THREE.DirectionalLight(0xffe8ba, 2.4); key.position.set(-3, 5, 6); scene.add(key)
  const rim = new THREE.DirectionalLight(0xb88aff, 2.3); rim.position.set(3, 3, -2); scene.add(rim)
  const blueLight = new THREE.DirectionalLight(0x86ddff, 1.6); blueLight.position.set(-4, 1, -1); scene.add(blueLight)
  const warmLight = new THREE.PointLight(0xffd089, 13, 8, 2); warmLight.position.set(0, 2, 2); scene.add(warmLight)
  const pointerLight = new THREE.PointLight(palette[0], 7, 6, 2); pointerLight.position.set(0, 1, 3); scene.add(pointerLight)

  const stage = new THREE.Group(); scene.add(stage)
  const altar = new THREE.Group(); altar.position.y = -1.51; stage.add(altar)
  function cylinder(parent: THREE.Group, radius: number, bottom: number, height: number, y: number, surface: THREE.Material, segments = 96) {
    const mesh = new THREE.Mesh(geometry(new THREE.CylinderGeometry(radius, bottom, height, segments)), surface)
    mesh.position.y = y; parent.add(mesh); return mesh
  }
  function torus(parent: THREE.Group, radius: number, tube: number, surface: THREE.Material, y = 0, horizontal = false, segments = 128) {
    const mesh = new THREE.Mesh(geometry(new THREE.TorusGeometry(radius, tube, 6, segments)), surface)
    mesh.position.y = y
    if (horizontal) mesh.rotation.x = Math.PI / 2
    parent.add(mesh); return mesh
  }
  cylinder(altar, 2.09, 2.25, .17, -.12, oldGold)
  cylinder(altar, 2.24, 2.21, .11, 0, gold)
  cylinder(altar, 2.17, 2.18, .19, .14, engraved)
  cylinder(altar, 2.25, 2.25, .075, .26, gold)
  cylinder(altar, 2.2, 2.19, .07, .325, obsidian)
  torus(altar, 2.15, .018, ivoryGold, .37, true)
  torus(altar, 1.85, .011, gold, .365, true)
  torus(altar, 1.76, .008, oldGold, .367, true)
  // An engraved sun on the altar top, shallow enough to feel inlaid.
  const altarEngraving = new THREE.Mesh(geometry(new THREE.PlaneGeometry(3.5, 3.5)), material(new THREE.MeshBasicMaterial({ map: map(mandalaTexture()), transparent: true, opacity: .34, depthWrite: false, side: THREE.DoubleSide })))
  altarEngraving.rotation.x = -Math.PI / 2; altarEngraving.position.y = .366; altar.add(altarEngraving)
  const beadGeometry = geometry(new THREE.SphereGeometry(.022, 7, 5))
  const beads = new THREE.InstancedMesh(beadGeometry, gold, 96)
  const dummy = new THREE.Object3D()
  for (let index = 0; index < 96; index++) {
    const angle = index / 96 * TAU
    dummy.position.set(Math.cos(angle) * 2.215, .205, Math.sin(angle) * 2.215)
    dummy.updateMatrix(); beads.setMatrixAt(index, dummy.matrix)
  }
  altar.add(beads)

  const glow = (parent: THREE.Object3D, color: THREE.ColorRepresentation, size: number, opacity: number, x: number, y: number, z: number, sparkle = false) => {
    const sprite = new THREE.Sprite(material(new THREE.SpriteMaterial({ map: sparkle ? starMap : glowMap, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })))
    sprite.position.set(x, y, z); sprite.scale.set(size, size, 1); parent.add(sprite); return sprite
  }
  glow(stage, 0x9744dc, 6.5, .25, 0, .5, -1.7)
  glow(stage, 0x586ef0, 4.8, .12, -1.4, .1, -1)
  glow(stage, 0xc5a052, 4.5, .11, 1.4, .8, -1.1)
  const heartGlow = glow(stage, palette[0], 2.7, .23, 0, 1.2, -.75)

  const mandala = new THREE.Group(); mandala.position.set(0, .52, -.9); stage.add(mandala)
  const numericWheel = new THREE.Group(); mandala.add(numericWheel)
  const filigree = new THREE.Group(); mandala.add(filigree)
  const innerPlane = new THREE.Mesh(geometry(new THREE.PlaneGeometry(6.0, 6.0)), material(new THREE.MeshBasicMaterial({ map: map(mandalaTexture()), color: 0xfde2a0, transparent: true, opacity: .67, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })))
  filigree.add(innerPlane)
  const numbersPlane = new THREE.Mesh(geometry(new THREE.PlaneGeometry(6, 6)), material(new THREE.MeshBasicMaterial({ map: map(mandalaTexture(true)), transparent: true, opacity: .87, depthWrite: false, side: THREE.DoubleSide })))
  numericWheel.add(numbersPlane)
  torus(mandala, 2.53, .009, ivoryGold)
  torus(mandala, 2.62, .006, oldGold)
  torus(filigree, 2.06, .007, gold)
  torus(mandala, .49, .007, gold)
  const tiltedRing = torus(mandala, 2.7, .007, gold)
  tiltedRing.rotation.set(.24, .21, -.18)
  // Nine bright stars mark decorative sectors of the supplied poster's wheel.
  const wheelStars: THREE.Sprite[] = []
  for (let index = 0; index < 9; index++) {
    const angle = index / 9 * TAU - Math.PI / 2
    wheelStars.push(glow(numericWheel, index % 2 ? 0xffdc8c : 0xe3c0ff, .28, .83, Math.cos(angle) * 2.53, Math.sin(angle) * 2.53, .04, true))
  }
  const jewels: THREE.Group[] = []
  jewelColors.forEach((color, index) => {
    const angle = Math.PI / 2 + index / 7 * TAU
    const seal = new THREE.Group()
    seal.position.set(Math.cos(angle) * 1.46, Math.sin(angle) * 1.46, .13)
    mandala.add(seal); jewels.push(seal)
    glow(seal, color, 1.04, .36, 0, 0, -.04)
    const lotus = new THREE.Mesh(geometry(new THREE.PlaneGeometry(.87, .87)), material(new THREE.MeshBasicMaterial({ map: map(lotusTexture(color, 6 + index % 3 * 2)), transparent: true, opacity: .97, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })))
    seal.add(lotus)
    const gem = new THREE.Mesh(geometry(new THREE.OctahedronGeometry(.102, 0)), material(new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .55, metalness: .3, roughness: .14 })))
    gem.rotation.z = Math.PI / 4; gem.position.z = .04; seal.add(gem)
    const bezel = torus(seal, .15, .006, ivoryGold); bezel.position.z = .02
  })
  const centralGem = new THREE.Mesh(geometry(new THREE.OctahedronGeometry(.22, 0)), material(new THREE.MeshStandardMaterial({ color: 0xffe5a0, emissive: 0xf5bc65, emissiveIntensity: .85, metalness: .52, roughness: .08 })))
  centralGem.position.z = .08; mandala.add(centralGem)
  glow(mandala, 0xffd48a, .95, .6, 0, 0, .02)

  const bottleMaterials: THREE.MeshPhysicalMaterial[] = []
  const bottles: THREE.Group[] = []
  const profile = [
    [0, 0], [.24, 0], [.325, .025], [.37, .065], [.395, .15], [.411, .3], [.412, .51],
    [.401, .7], [.38, .85], [.346, .94], [.288, 1.025], [.216, 1.085],
    [.166, 1.12], [.145, 1.16], [.145, 1.39], [0, 1.39],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const bodyGeometry = geometry(new THREE.LatheGeometry(profile, 20))
  const bottleSettings = [
    { x: -1.05, z: .23, scale: .94, color: 0x082735, name: 'Celestial', rotation: -.12 },
    { x: 0, z: .6, scale: 1.2, color: 0x280c3c, name: 'Violet', rotation: 0 },
    { x: 1.05, z: .23, scale: .94, color: 0x0c2b1e, name: 'Verdant', rotation: .12 },
  ]
  bottleSettings.forEach((settings) => {
    const bottle = new THREE.Group(); bottle.position.set(settings.x, -1.13, settings.z)
    bottle.scale.setScalar(settings.scale); bottle.rotation.y = settings.rotation; stage.add(bottle); bottles.push(bottle)
    // Single-pass cut-glass approximation: coloured depth with narrow polished
    // highlights. The restrained reflection gain preserves saturated dark cores.
    const glass = material(new THREE.MeshPhysicalMaterial({ color: settings.color, metalness: .3, roughness: .115, clearcoat: .72, clearcoatRoughness: .085, transparent: true, opacity: .8, envMapIntensity: .6, flatShading: true, emissive: settings.color, emissiveIntensity: .035 }))
    bottleMaterials.push(glass)
    const body = new THREE.Mesh(bodyGeometry, glass); bottle.add(body)
    cylinder(bottle, .338, .3, .71, .45, material(new THREE.MeshStandardMaterial({ color: settings.color, metalness: .08, roughness: .23, transparent: true, opacity: .64, envMapIntensity: .12, emissive: settings.color, emissiveIntensity: .025 })), 20)
    // Multi-part collar and domed crown communicate an actual oil vessel.
    cylinder(bottle, .179, .18, .055, 1.15, gold, 48)
    cylinder(bottle, .162, .162, .26, 1.31, engraved, 48)
    cylinder(bottle, .185, .185, .033, 1.455, ivoryGold, 48)
    cylinder(bottle, .164, .18, .07, 1.5, gold, 48)
    cylinder(bottle, .145, .161, .027, 1.548, oldGold, 48)
    torus(bottle, .173, .013, ivoryGold, 1.445, true)
    torus(bottle, .347, .011, gold, .093, true, 48)
    const crest = new THREE.Mesh(geometry(new THREE.OctahedronGeometry(.062)), material(new THREE.MeshStandardMaterial({ color: settings.color, metalness: .28, roughness: .12, emissive: settings.color, emissiveIntensity: .1 })))
    crest.position.y = 1.595; bottle.add(crest)
    // Diagonal gold-cut filigree follows the vessel's faceted shoulders.
    const wirePositions: number[] = []
    for (let index = 0; index < 12; index++) {
      for (let strand = 0; strand < 2; strand++) {
        const points: THREE.Vector3[] = []
        for (let step = 0; step <= 18; step++) {
          const t = step / 18, y = .12 + t * .96
          const radius = y < .72 ? .407 : .407 - ((y - .72) / .36) * .225
          const angle = index / 12 * TAU + (t - .5) * (strand ? -.85 : .85)
          points.push(new THREE.Vector3(Math.sin(angle) * radius, y, Math.cos(angle) * radius))
        }
        for (let step = 1; step < points.length; step++) wirePositions.push(...points[step - 1].toArray(), ...points[step].toArray())
      }
    }
    const wire = new THREE.LineSegments(geometry(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(wirePositions, 3))), material(new THREE.LineBasicMaterial({ color: 0xe2ba73, transparent: true, opacity: .24 })))
    bottle.add(wire)
    const label = new THREE.Mesh(geometry(new THREE.PlaneGeometry(.44, .48)), material(new THREE.MeshStandardMaterial({ map: map(bottleLabelTexture(settings.name)), metalness: .45, roughness: .38 })))
    label.position.set(0, .56, .412); bottle.add(label)
    const labelTop = new THREE.Mesh(geometry(new THREE.BoxGeometry(.46, .012, .016)), gold); labelTop.position.set(0, .806, .409); bottle.add(labelTop)
    const labelBottom = labelTop.clone(); labelBottom.position.y = .314; bottle.add(labelBottom)
    glow(bottle, settings.color, .48, .24, -.25, .83, .1)
  })

  // Weightless vapour: soft additive puffs and curved fine filaments.
  const mist: { sprite: THREE.Sprite; phase: number; x: number }[] = []
  for (let index = 0; index < 12; index++) {
    const phase = index / 12
    const sprite = glow(stage, index % 2 ? 0xcdb8f3 : 0xebcfb0, .55 + phase * .45, .035, Math.sin(index * 2) * 1.6, -.7 + phase * 2.5, .2)
    mist.push({ sprite, phase, x: Math.sin(index * 2) * 1.6 })
  }
  const vapor = new THREE.Group(); stage.add(vapor)
  for (let strand = 0; strand < 4; strand++) {
    const points: THREE.Vector3[] = []
    for (let index = 0; index <= 85; index++) {
      const t = index / 85
      points.push(new THREE.Vector3(Math.sin(t * 8 + strand) * (.13 + t * .4) + (strand % 2 ? 1.13 : -1.13), -.15 + t * 2.4, -.07 + Math.cos(t * 5 + strand) * .14))
    }
    vapor.add(new THREE.Line(geometry(new THREE.BufferGeometry().setFromPoints(points)), material(new THREE.LineBasicMaterial({ color: strand % 2 ? 0xc7a9f4 : 0x8abbcd, transparent: true, opacity: .1 }))))
  }
  const random = seeded(8217)
  const particleCount = 310
  const particlePositions = new Float32Array(particleCount * 3)
  const particleBase = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)
  for (let index = 0; index < particleCount; index++) {
    const angle = random() * TAU, radius = 1.0 + random() * 2.45
    particleBase[index * 3] = Math.cos(angle) * radius
    particleBase[index * 3 + 1] = Math.sin(angle) * radius * .76 + .25
    particleBase[index * 3 + 2] = (random() - .5) * 3.2
    const color = new THREE.Color(index % 4 ? 0xebc37b : jewelColors[index % 7])
    color.toArray(particleColors, index * 3)
  }
  particlePositions.set(particleBase)
  const particleGeometry = geometry(new THREE.BufferGeometry())
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
  const particles = new THREE.Points(particleGeometry, material(new THREE.PointsMaterial({ map: glowMap, size: .049, vertexColors: true, transparent: true, opacity: .78, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })))
  stage.add(particles)
  const fallingStars = Array.from({ length: 12 }, (_, index) => glow(stage, index % 2 ? 0xc9a2ff : 0xffe2a8, .09 + random() * .07, .6, (random() - .5) * 5.7, (random() - .5) * 4.3, random() * 2))
  const pointerGlow = glow(stage, palette[0], .8, .13, 0, 0, 2)

  let elapsed = 0, smoothX = 0, smoothY = 0, smoothScroll = 0, smoothOrbit = 0, disposed = false
  let cameraDistance = 9.3, lastMood = -1, lastBurst = 0, burstAge = 5
  const drawingBuffer = new THREE.Vector2()
  const target = new THREE.Vector3(0, .35, 0)
  return {
    resize(width, height) {
      if (disposed) return
      const w = Math.max(1, width), h = Math.max(1, height)
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(650_000 / (w * h)))
      renderer.getDrawingBufferSize(drawingBuffer)
      if (drawingBuffer.x !== Math.floor(w * ratio) || drawingBuffer.y !== Math.floor(h * ratio)) {
        if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio)
        renderer.setSize(w, h, false)
      }
      camera.aspect = w / h
      cameraDistance = 9.35 * Math.max(1, 1.02 / camera.aspect)
      camera.position.set(0, .64, cameraDistance)
      camera.updateProjectionMatrix()
    },
    render(delta, motion, animate) {
      if (disposed) return
      const dt = Math.min(Math.max(delta, 0), .06)
      const selectedMood = Math.max(0, Math.min(2, Math.round(motion.mood)))
      if (lastMood !== selectedMood) {
        lastMood = selectedMood
        rim.color.setHex(palette[selectedMood]); pointerLight.color.setHex(palette[selectedMood])
        heartGlow.material.color.setHex(palette[selectedMood]); pointerGlow.material.color.setHex(palette[selectedMood])
        bottleMaterials[1].color.setHex([0x280c3c, 0x09223e, 0x400f27][selectedMood])
        bottleMaterials[1].emissive.copy(bottleMaterials[1].color)
      }
      if (motion.burst !== lastBurst) { lastBurst = motion.burst; burstAge = animate ? 0 : 5 }
      if (animate) {
        elapsed += dt; burstAge += dt
        smoothX = damp(smoothX, motion.pointerX, 3.2, dt)
        smoothY = damp(smoothY, motion.pointerY, 3.2, dt)
        smoothScroll = damp(smoothScroll, motion.scroll, 4.5, dt)
        smoothOrbit = damp(smoothOrbit, motion.orbit, 4, dt)
      }
      const bloom = burstAge < 3 ? Math.sin(Math.min(1, burstAge / 3) * Math.PI) : 0
      stage.rotation.y = smoothX * .07 + smoothOrbit
      stage.rotation.x = -smoothY * .035
      stage.position.y = -smoothScroll * .18
      filigree.rotation.z = elapsed * .022
      numericWheel.rotation.z = Math.sin(elapsed * .09) * .025
      tiltedRing.rotation.y = .21 + Math.sin(elapsed * .13) * .13
      centralGem.rotation.y = elapsed * .24
      jewels.forEach((seal, index) => { seal.rotation.z = Math.sin(elapsed * .2 + index) * .065 })
      bottles.forEach((bottle, index) => { bottle.rotation.y = bottleSettings[index].rotation + Math.sin(elapsed * .15 + index) * .018 })
      wheelStars.forEach((sprite, index) => { sprite.material.opacity = .7 + Math.sin(elapsed * .7 + index * 1.3) * .15 })
      fallingStars.forEach((sprite, index) => { sprite.material.opacity = .32 + Math.sin(elapsed * .6 + index) * .25 })
      mist.forEach(({ sprite, phase, x }, index) => {
        const t = (phase + elapsed * .045) % 1
        sprite.position.y = -.6 + t * 2.5
        sprite.position.x = x + Math.sin(t * 7 + index) * .23
        sprite.material.opacity = Math.sin(t * Math.PI) * .043
        sprite.scale.setScalar(.55 + t * .75)
      })
      vapor.rotation.y = Math.sin(elapsed * .11) * .08
      const expand = 1 + bloom * .23
      for (let index = 0; index < particleCount; index++) {
        const offset = index * 3
        particlePositions[offset] = particleBase[offset] * expand + Math.sin(elapsed * .15 + index) * .035
        particlePositions[offset + 1] = particleBase[offset + 1] * expand + Math.sin(elapsed * .12 + index * .4) * .075
        particlePositions[offset + 2] = particleBase[offset + 2] + bloom * .5
      }
      particleGeometry.getAttribute('position').needsUpdate = true
      particles.rotation.z = elapsed * .008
      pointerLight.position.set(smoothX * 2.5, 1 + smoothY * 1.5, 3)
      pointerGlow.position.set(smoothX * 2.5, .3 + smoothY * 1.9, 2)
      heartGlow.material.opacity = .23 + bloom * .1
      camera.position.x = smoothX * .09
      camera.position.y = .64 + smoothY * .08
      camera.position.z = cameraDistance - smoothScroll * .5
      camera.lookAt(target)
      renderer.render(scene, camera)
    },
    dispose() {
      if (disposed) return
      disposed = true
      geometries.forEach((item) => item.dispose())
      materials.forEach((item) => item.dispose())
      textures.forEach((item) => item.dispose())
      environment.dispose()
      scene.clear(); renderer.dispose()
    },
  }
}
