# Life Code — The Amber Atelier: Figma handoff

File: https://www.figma.com/design/LqRPvQwLT21JOqbGjazCyh

**Status: complete native desktop and mobile page content created and structurally verified in the ordinary Figma editor.** The current native page contains the hero with actual Three.js scene stills, Higgsfield editorial artwork, pending-form section, number references, and footer. The file is an editable design representation, not a pixel-perfect browser capture.

The Figma MCP Starter quota was reached during the initial draft. Work continued through the authenticated editor's Scripter plugin with the normal native Figma API. No upgrade, payment, publishing, or further MCP mutation was performed.

## Current native design

- [Desktop · 1440 × 3492](https://www.figma.com/design/LqRPvQwLT21JOqbGjazCyh?node-id=18-16)
- [Mobile · 390 × 3574](https://www.figma.com/design/LqRPvQwLT21JOqbGjazCyh?node-id=18-177)
- Page `18:8`: `02 · Native web design`.
- The original first-page draft is preserved as history. Use the links above for the current design.

The actual editor report is saved in [figma-verification.json](figma-verification.json). The read-only verification found **zero text nodes outside their parent bounds** and **zero horizontal auto-layout rows shorter than 10 px** in either artboard. Both use Cormorant Garamond and Noto Sans Thai.

| Verified property | Desktop | Mobile |
|---|---:|---:|
| Total descendant nodes | 160 | 150 |
| Editable text nodes | 67 | 64 |
| Component instances | 4 | 4 |
| Editable vector nodes | 20 | 12 |
| Image fills | 2 | 2 |
| Auto-layout containers | 44 | 46 |

The native reusable Action component supplies the controls. The new layout has corrected button text sizing; the earlier draft's inherited button-width issue does not apply to these artboards.

| Current node | Desktop | Mobile |
|---|---|---|
| Artboard | `18:16` | `18:177` |
| Hero | `18:38` | `18:198` |
| Actual Three.js scene image fill | `18:55` (811 × 658) | `18:216` (390 × 350) |
| Higgsfield editorial image | `18:73` | `18:234` |
| Pending formula form | `18:81` | `18:242` |

The two editorial fills contain the original Higgsfield PNG hash `3530cad4d9429fa32ab80c3ac019571a9b216c4b`. The hero fills now contain actual transparent exports from the live Three.js canvas: desktop hash `59937ae4e6ba0d43fb2a3308214d4f573a13867d`, mobile hash `be1ed7277993b4c582ad976171bdbc8f1615edd8`. See [figma-scenes-verification.json](figma-scenes-verification.json) for the native editor's successful mutation report and [figma-desktop-editor.png](figma-desktop-editor.png) for the rendered editable layout. These stills were captured before the final antialiasing/contrast polish; geometry and layout are unchanged. Motion runs in the web application; Figma holds editable layout around static scene artwork.

## Preserved initial draft

- Page `0:1`: `01 · The Amber Atelier`.
- Desktop artboard `3:25`: 1440 px, native auto layout and editable text.
- Mobile artboard `3:26`: 390 px, native auto layout and editable text.
- Product fonts are verified available: Cormorant Garamond Regular; Noto Sans Thai Regular and Medium.
- Linked primary button instances from Figma's Simple Design System. Source component-set key: `cc8b558dc7d9684011b6b99ce8e6509399bc836b`.
- Eight scoped variables in collection `VariableCollectionId:3:11`, one Light mode `3:1`.
- Five text styles: Display/Desktop, Display/Mobile, Heading/Thai, Body/Thai, Label/Thai.
- Desktop and mobile editorial sections contain the actual Higgsfield-generated amber-glass image. Its original PNG was uploaded, and visible rendering was verified. The WebP upload produced a fill but did not render in the Figma screenshot service, so the PNG replaced it.

## Initial draft state ledger

| Entity | Node / ID |
|---|---|
| Desktop header | `3:27` |
| Desktop hero | `5:129` |
| Desktop hero copy | `5:130` |
| Desktop scene slot, still empty | `5:143` (636 × 600) |
| Desktop CTA | `5:134` |
| Desktop CTA label | `I5:134;4185:3781` |
| Mobile header | `5:144` |
| Mobile hero | `5:147` |
| Mobile hero copy | `5:148` |
| Mobile scene slot, still empty | `5:157` (342 × 360) |
| Mobile CTA | `5:152` |
| Mobile CTA label | `I5:152;4185:3781` |
| Desktop editorial section | `6:8` |
| Desktop Higgsfield image | `6:9` |
| Mobile editorial section | `6:14` |
| Mobile Higgsfield image | `6:15` |
| Original PNG image hash | `3530cad4d9429fa32ab80c3ac019571a9b216c4b` |

| Variable | ID | Value |
|---|---|---|
| color/base | `VariableID:3:12` | `#eee9df` |
| color/surface | `VariableID:3:13` | `#faf8f2` |
| color/ink | `VariableID:3:14` | `#272920` |
| color/ink-muted | `VariableID:3:15` | `#65685d` |
| color/amber | `VariableID:3:16` | `#9b5c28` |
| spacing/page | `VariableID:3:17` | 64 |
| spacing/sm | `VariableID:3:18` | 24 |
| radius/pill | `VariableID:3:19` | 999 |

## Historical initial draft repair (superseded by the native page)

The following notes describe the first-page draft only. The current native page already contains correctly sized native controls and the full form/content sections; use the current links above.

1. Fix the two CTA labels. They inherited a 124 px fixed width from the generic button. After switching to the real Thai font, they wrap to three lines. The blocked correction below must run after quota is available.
2. Capture the real localhost 5187 scene and application with `generate_figma_design` using this file key. Transfer the scene image hashes into the two existing native scene slots; set `placeholder = false`. Keep all text and controls native. A screenshot alone is not the design deliverable.
3. Match native layout, copy, sizing, and styles against the final running code, which is still being implemented in parallel. The present initial design is a design direction, not a verified pixel match.
4. Add the actual pending-form section to the native design and any essential UI states in scope. No invented code, medical measurements, percentages, scores, or formulas.
5. Recheck desktop and mobile section screenshots, Thai text heights, button sizing, native font families, and absence of placeholders. Remove only temporary capture nodes by their returned IDs once all assets are transferred and the native design is verified.

### Blocked correction script

Read the installed `figma-use` skill before calling `use_figma`. The last failed call made no changes.

```js
const pairs = [
  ['5:134', 'I5:134;4185:3781'],
  ['5:152', 'I5:152;4185:3781'],
];
const ids = [];
for (const [buttonId, textId] of pairs) {
  const [button, text] = await Promise.all([
    figma.getNodeByIdAsync(buttonId),
    figma.getNodeByIdAsync(textId),
  ]);
  for (const segment of text.getStyledTextSegments(['fontName'])) {
    await figma.loadFontAsync(segment.fontName);
  }
  text.textAutoResize = 'WIDTH_AND_HEIGHT';
  text.layoutSizingHorizontal = 'HUG';
  text.layoutSizingVertical = 'HUG';
  button.layoutSizingHorizontal = 'HUG';
  button.layoutSizingVertical = 'HUG';
  ids.push(button.id, text.id);
}
return { mutatedNodeIds: ids };
```

The same tool session showed that `resize(width, height)` after setting `textAutoResize = 'HEIGHT'` left text at a fixed height. Setting `textAutoResize = 'HEIGHT'` and `layoutSizingVertical = 'HUG'` afterward correctly recomputed the display heading to 244 px on desktop and 152 px on mobile. These heading-height corrections already succeeded.

## Recovery artifacts

- `docs/figma-plugin/`: small local development plugin to repair the two CTA labels and insert two supplied actual scene PNGs into the existing artboards.
- `figma-plugin/`: full native desktop/mobile builder based on the actual implementation, including form, footer, editable native Action component, and Higgsfield image. `scripter.js` was executed successfully in the authenticated browser editor and produced the verified current page. `build.mjs` also supports a standalone manifest variant with two optional scene PNG paths.
- `docs/figma-plugin/verify-scripter.js`: read-only verification script actually executed in the editor; its output is `docs/figma-verification.json`.
- The standalone manifest variants passed syntax checks but were not imported. They are recovery artifacts, not the execution path used to finish the current native page.
