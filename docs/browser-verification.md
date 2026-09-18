# Browser verification — 9 September 2026

Target: local `app-3d`, Chrome, `http://127.0.0.1:5187/`. The original `app/` was not used as evidence for this variant.

- Inspected complete pages at CSS widths 1440, 390 and 1197 px. Final evidence is `.impeccable/review/desktop.png`, `mobile.png`, `user-1197.png`, and `hero-final.png`. Chrome's 80% page zoom required compensated capture coordinates; the 1197 CSS layout produces a 1198-pixel PNG through rounding. Temporary metrics, scrollbar and media overrides were reset afterward.
- Real Three.js geometry rendered. Pause stopped its frame counter (1866 in two reads) and preserved the image. The final renderer also skips redundant buffer resizing and redraws synchronously after real resizing, preventing blank static scenes during repaint.
- Reduced motion exposed `data-scene-state="reduced-motion"`; the counter remained at 23 across later reads without continuous animation. Resizing can legitimately trigger a static redraw. Screenshots confirm the model remains visible.
- Required form fields prevented an empty submission and focused the name field. A leap-day selection, 29 February 2543 BE, remained 29 February 2000 after switching to CE.
- A synthetic name containing an image tag and event-handler text appeared literally in the result heading. The result remained visibly pending, with no personal code or scent recommendation.
- Reset cleared name, day, month and year values; a fresh tab also started with empty fields.
- Final independent review confirmed edge antialiasing and the five corrected contrast pairs. See `.impeccable/review/review.md` and its verdict continuation. A fresh general reviewer substituted for the unavailable dedicated reviewer type. No FORM seed or approved UI comp was recorded for this variant.

The orange Alibaba Lens control and cursor halo in captures belong to the existing browser extension and are not application UI.

These checks are not a measured frame-rate benchmark, physical-device test or Lighthouse audit. No Lighthouse score is claimed. They do not validate the unprovided calculation formula or authorize publication.
