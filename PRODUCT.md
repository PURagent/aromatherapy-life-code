# Aromatherapy Life Code — The Celestial Sanctuary

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Vite, React, TypeScript, Tailwind v4, Zod, Vitest and Three.js. This independent variant lives in `app-3d/`; the original `../app/` is a separate design. Cloudflare static hosting is the eventual target. This task does not authorize publication.

## Users
Thai-speaking visitors arriving from QR posters and social media, mostly on mobile. The journey is short and account-free: discover the brand, enter a date and understand the status of its number and scent concepts.

## Product Purpose
A prototype of the Aromatherapy Life Code journey by หมอเน่ mornaenae. Support an eventual owner-approved calculation and confirmed product catalogue. The current deliverable combines an editorial landing page, live decorative 3D, a usable form, an explicit pending result, catalogue preview, privacy information and owner review evidence.

## Capabilities and Constraints
- Required name and birthday, with a Buddhist/Gregorian year toggle preserving the same date. Birth time is optional.
- Personal input stays in React state in browser memory. There is no database, authentication, lead collection, telemetry, personal query parameter or browser storage. Refresh discards the session; reset clears the draft and result.
- The user says the formula has been confirmed and will be supplied. No written calculation rules or approved examples are present in this project; `src/content/engine-fixtures.json` is `[]`. The engine returns `pending-confirmation` without calculating a number.
- All 34 draft records remain pending: nine numbers, fourteen scents, seven chakras and four domains; zero are confirmed. Development may show clearly labelled catalogue previews. The production catalogue exposes only confirmed content and currently shows an honest empty state.
- Number pages are reference navigation, never a result inferred from a visitor's birthday. Do not infer numerology, supply a fixed sample result or invent a personal scent recommendation.
- Do not add chakra percentages, levels, bars, scores, diagnoses or medical interpretations.
- A downloadable status image contains only the brand's pending message, without a name, birthday, birth time or computed number.
- Purchase details, contact destinations and product specifications remain unconfirmed. There are no purchases, new account connections or publication in this task.

## Brand Commitments
Retain Aromatherapy Life Code and หมอเน่ mornaenae with Thai-first instructions and readable Thai typography. The owner rejected the ivory variant and requested the supplied posters' own theme, expanded into lavish fantasy with real 3D and interactive details. **The Celestial Sanctuary** uses purple-black depth, champagne gold frames and lettering, rainbow sacred geometry, aroma vessels and a gold altar. Cormorant Garamond remains the expressive display face; Noto Sans Thai carries instructions and native controls.

The Three.js mandala, seven lotus seals, engraved 1–9 ring and three cut-crystal concept bottles are decorative. Mood choices change artistic lighting, not personal recommendations. The Higgsfield artwork is a fantasy concept image, not product photography, a health illustration or evidence for a formula. Source poster text, contradictory number mappings and medical claims do not establish verified product facts.

## Evidence on Hand
`../_plan/00-requirements.md`, `../_plan/assets/` and `../docs/discovery/` contain extracted source evidence. `src/content/*.json` contains draft content; a scaffold flag is not owner approval. No confirmed shop URL, price, SKU specification, production domain or real product photography has been supplied.

Higgsfield provenance is in `docs/fantasy/higgsfield-provenance.json`; the current asset is `public/images/celestial-sanctuary.webp` (2200 × 1228, 311,498 bytes). Completed job `f863ef61-bc37-4b74-b7da-49c3b1bc117b` used an uploaded owner poster as a style reference. It requested `nano_banana_pro` and reported `nano_banana_2`; retain that distinction. `docs/THREEUI-SOURCES.md` and `THIRD_PARTY_NOTICES.md` identify the adapted MIT Community lifecycle/renderer foundation; the fantasy geometry and textures are authored locally.

The persisted authority is `docs/fantasy/direction.md`. It records the source posters, chosen world, visitor path, interaction, boundaries and direction seed `0eccc689` (assigned index 6, overridden by the owner's explicit poster world). This is a code-led reconstruction, with no independently approved UI comp or QUALITY BAR card. `DESIGN.md` and its schema-2 sidecar record the current implementation. All 184 detector advisories compare against the prior ivory DESIGN and are historical evidence.

Figma page `18:8` and its previous desktop/mobile frames are the superseded ivory design. The new fantasy Figma page is being prepared separately; its verified link is pending. Figma scene stills do not run the live WebGL interaction.

## Product Principles
Be honest about missing calculations and content approval. Make the Thai form and recovery actions clear. Present only approved factual content outside explicitly marked development previews. Keep personal input separate from markup and external requests. The landing surface invites exploration (Persuade); the form and pending-result surface support a direct task (Operate).

## Accessibility & Inclusion
Thai-readable type, keyboard navigation, text labels, visible focus, adjacent error corrections, reduced motion support, at least 44px primary touch targets and usable interaction at 360px. The decorative scene is hidden from assistive technology, has an explicit pause control and stops continuous rendering for reduced motion, hidden tabs and offscreen scenes. A local image fallback preserves the introduction if WebGL is unavailable.
