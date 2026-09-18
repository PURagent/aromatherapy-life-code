# ThreeUI source provenance

Reference requested by the owner: https://threeui.com/landing-pages

Source repository: https://github.com/MengTo/threeui

Inspected local Community commit: `68802d5428071ada5c20db8094b1649e6bb770ed`.
The Community repository excludes Pro and Beta implementations. Only its MIT
Community source was used; no paid source, catalogue preview media, thumbnails,
remote models or remote textures were copied.

## Adapted source

- `src/shaders/orbital-sphere/orbitalSphereRenderer.ts`: scene/camera/group
  arrangement, multiple tilted orbits, satellite placement and renderer
  resize/render/dispose contract. The original particle sphere is replaced by
  original glass ribbon geometry and a suspended oil drop. Original purple
  additive materials and 15,000 source particles are not included.
- `src/shaders/orbital-sphere/OrbitalSphereBackground.tsx`: React canvas lifecycle
  with ResizeObserver and IntersectionObserver. The adaptation adds explicit
  pause, reduced motion, visibility restart and context-loss handling.
- `public/landing-pages/kage.html`, section 9 (`measure`/`progressFor`) and section
  13 (`frame`): normalized section scroll progress, damped camera input, capped
  delta time. The adaptation uses one hero section rather than the original
  multi-chapter temple scene. Frame-independent damping is used throughout.

## This app's implementation

- `src/scene/AmberScene.tsx`: lazy-loadable React scene, user pause contract,
  reduced-motion handling, offscreen/hidden-tab pause and restart, image fallback,
  context restoration, event cleanup and development frame diagnostics.
- `src/scene/amberRenderer.ts`: original amber ribbon/drop mesh construction,
  three small satellite drops, three fine orbit arcs, reflective standard materials,
  procedural studio environment and animated camera/geometry transforms.
- `src/scene/scene.css`: component-contained canvas/fallback presentation.

The renderer imports one installed `three` library. It does not import the
ThreeUI package or its historical `three128` dependency. `RoomEnvironment` from
the same Three.js installation supplies studio reflection panels without an
HDRI download. All geometry and environment lighting are generated locally.

Higgsfield's generated `public/images/amber-study.webp` informed the amber
material and open ribbon silhouette. It is not loaded into the WebGL renderer;
the locally hosted image also supplies the static loading/context-loss fallback.

## Motion and performance contract

The host must have an explicit size; the scene fills its parent. DPR is capped
at 1 with a maximum 300,000 backing-buffer pixels. Continuous animation is
capped at 30 fps. There are no particle clouds, postprocessing
passes, video textures, runtime API calls, or personal-data inputs. The mesh
renderer is decorative and does not represent a measured health state.

The drawing buffer is retained (`preserveDrawingBuffer: true`) because paused
and reduced-motion scenes render once rather than running a continuous loop.
This prevents a blank canvas after a scroll, compositor repaint or screenshot.
The retained buffer stays within the same 300,000-pixel rendering limit.
Resize is idempotent when backing dimensions have not changed. After a real
resize the current pose is redrawn synchronously, before any queued animation
frame, so paused/reduced-motion capture and compositor work cannot expose a
freshly cleared buffer. Neither resize path advances or resets scene time.

Browser integration exposed a very low frame rate on the available ANGLE
renderer with physical transmission. The final materials approximate amber
glass with transparent MeshStandardMaterial and procedural reflections, avoiding
the extra scene render target and refraction shader. Mesh tessellation is also
bounded. This trades physically accurate refraction for responsive motion.

`paused` freezes continuous motion, pointer response and scroll response. An OS
reduced-motion preference automatically renders a stationary scene. Hidden tabs
and offscreen scenes stop their animation loop and restart when visible.
Context loss shows the Higgsfield still image; restoration rebuilds the renderer. Every
geometry, material, environment render target, observer and listener is disposed
on unmount. In development the canvas `data-frames` attribute exposes rendered
frame counts; the host `data-scene-state` exposes lifecycle status.

Validation at implementation: `npx tsc -p tsconfig.app.json --noEmit` passed with
`three` 0.186.0 and `@types/three` 0.185.4. Visual integration and browser lifecycle
checks are recorded in the root handoff/review evidence.

Full retained notices are in `THIRD_PARTY_NOTICES.md`.

## Celestial Sanctuary revision — 9 September 2026

The user superseded the abstract Amber ribbon with the supplied poster world.
The current `amberRenderer.ts` retains the audited lifecycle/interface lineage
but draws original sacred-geometric textures, lotus seals, faceted bottles,
botanical gold engraving and a layered altar. No additional Framer template
code was copied. The renderer now caps backing pixels at 650,000, DPR at 1.5,
and schedules at most 30 frames per second; these are limits, not measured FPS.
The new artwork, visual authority and checks live in `docs/fantasy/`.
