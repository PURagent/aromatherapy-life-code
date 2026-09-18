# Fantasy variant verification — 9 September 2026

Final valid homepage captures are in `.impeccable/review/fantasy/`: desktop (1440px viewport), mobile (390px), and user-1280 (1280 × 720 viewport). Captured PNG widths exclude the native scrollbar. All three were opened by the builder and by an independent reviewer. An intermediate capture retained the previous WebGL instance after HMR; it was replaced after a full reload, so the final files show the dark-glass material revision.

Observed browser behavior:

- Three.js initializes with `data-scene-state=ready` and visible canvas. The final scene contains the gold numeral ring, colored lotus seals, three faceted concept bottles and a dimensional altar.
- Light selectors update both the pressed button and renderer mood: blue returned `sceneMood=1`, rose returned `sceneMood=2` and the selected Thai label.
- Pause shows a stationary scene; decorative burst is disabled. Reduced-motion emulation returned `reduced-motion` with the frame count remaining 1331 across separate reads. Offscreen rendering stops and returns to ready on entering the viewport.
- After returning to the visible hero, real mouse down/move/up events changed the host's dragging flag true → false while frames advanced 491 → 492. The canvas declares `touch-action: pan-y`; physical touch hardware was not benchmarked.
- The primary CTA focuses the `begin` section. Submitting an empty form focuses `birth-name` and shows its Thai required-field error.
- Returning home after `/#begin` now removes the hash as well as scrolling to the top. The browser verified `http://127.0.0.1:5187/`; this fixes a stale-anchor reload found during this check.

Build, lint and 43 tests / 4 files passed. The tests establish pending-engine behavior, date handling, content validation and safe result rendering; they do not validate an unprovided formula. Static build checks also verify no draft fixtures, unsafe markup sinks, persistence or telemetry are shipped.

The fresh reviewer returned `ship` for the homepage captures, sampled source and current product/design documentation. That is not a Figma verification or a physical-device performance claim. No Lighthouse score, measured FPS or deployment is claimed. The independent reviewer and documenter were general agents substituting for unavailable typed roles.

The new Figma import is separately recorded in `figma-status.md`: no new fantasy page was verified because the MCP quota was exhausted and the editor connection failed during script insertion. The prepared native builder includes the final artwork and scene stills. The old Figma page remains the earlier Amber design.
