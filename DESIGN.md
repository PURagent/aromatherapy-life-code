---
name: "Aromatherapy Life Code — The Celestial Sanctuary"
description: "A purple-black fantasy sanctuary with champagne gold, living sacred geometry and clear Thai controls."
colors:
  base: "#090611"
  base-deep: "#130b1d"
  elevated: "#1c1228"
  elevated-2: "#392343"
  gold-500: "#bc965d"
  gold-300: "#e5c994"
  gold-100: "#f1ddb2"
  ink: "#f1e6f5"
  ink-muted: "#bfb1ca"
  line: "#bc965d40"
  accent: "#d5b778"
  primary-start: "#e6c88c"
  primary-middle: "#caa35e"
  primary-end: "#efdaa5"
  primary-ink: "#221426"
  primary-hover: "#f1dba8"
  secondary-ink: "#ebd4a7"
  secondary-hover: "#2a1a36"
  focus: "#f0d39e"
  control-bg: "#100b18"
  control-ink: "#f1e5fb"
  control-border: "#75637d"
  placeholder: "#b6a3c6"
  calendar-tray: "#0f0a17"
  calendar-selected: "#533957"
  calendar-selected-ink: "#f3deae"
  mood-lunar: "#c29aff"
  mood-stellar: "#83d9fa"
  mood-rose: "#f3a5cd"
  error: "#ffacb8"
typography:
  display:
    fontFamily: "'Cormorant Garamond Variable', 'Noto Sans Thai Variable', serif"
    fontSize: "clamp(54px, 6.3vw, 90px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  section-display:
    fontFamily: "'Cormorant Garamond Variable', 'Noto Sans Thai Variable', serif"
    fontSize: "clamp(58px, 6vw, 80px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Noto Sans Thai Variable', system-ui, sans-serif"
    fontSize: "clamp(28px, 2.8vw, 41px)"
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "'Noto Sans Thai Variable', system-ui, sans-serif"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "'Noto Sans Thai Variable', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "'Noto Sans Thai Variable', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.75
  action:
    fontFamily: "'Noto Sans Thai Variable', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.75
rounded:
  action: "4px"
  field: "5px"
  toggle: "7px"
  panel: "14px"
  mood: "24px"
  circular: "50%"
spacing:
  tight: "8px"
  small: "12px"
  regular: "16px"
  content: "20px"
  large: "24px"
  panel: "32px"
  story: "64px"
components:
  button-primary:
    textColor: "{colors.primary-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: "13px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-ink}"
    rounded: "{rounded.action}"
    padding: "13px 20px"
  input:
    backgroundColor: "{colors.control-bg}"
    textColor: "{colors.control-ink}"
    rounded: "{rounded.field}"
    padding: "10px 13px"
    height: "50px"
  form-panel:
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "32px"
  calendar-toggle:
    backgroundColor: "{colors.calendar-tray}"
    rounded: "{rounded.toggle}"
    padding: "3px"
  calendar-selected:
    backgroundColor: "{colors.calendar-selected}"
    textColor: "{colors.calendar-selected-ink}"
    rounded: "{rounded.field}"
  mood-switch:
    backgroundColor: "transparent"
    rounded: "{rounded.mood}"
    padding: "8px 12px"
    height: "44px"
  navigation:
    textColor: "#d8cadd"
  reference-link:
    textColor: "#eace99"
    width: "64px"
    height: "70px"
---

# Design System: Aromatherapy Life Code — The Celestial Sanctuary

## Overview

**Creative North Star: "The Celestial Sanctuary"**

A purple-black sanctuary holds a luminous circular mandala, a layered gold and obsidian altar and three cut-crystal concept bottles. Champagne lettering and fine gold frames connect the interface to the owner’s posters. Jewel accents belong to the living geometry, while pale lavender Thai text makes the practical journey readable.

The scene invites exploration before the native form. Cormorant Garamond provides expressive English display lettering and Noto Sans Thai carries instructions, values and corrections. This code-led replacement follows the owner’s poster world; the previous ivory design is superseded.

**Key Characteristics:**

- Purple-black depth, pale lavender text and champagne gold actions.
- Concentric sacred geometry, seven lotus seals and three original concept bottles.
- Three artistic mood palettes, horizontal drag, pointer light and a gentle particle expansion.
- An arched Higgsfield concept image and framed native form.
- Explicit pause, reduced motion, pending calculation and recoverable form states.

This scan records the effective cascade in src/index.css, src/atelier.css and src/scene/scene.css, plus HomePage and the renderer. Frontmatter owns reusable primitives. The schema-2 sidecar carries gradients, shadows, motion, breakpoints and component examples. The authority and seed are in docs/fantasy/direction.md; neither an approved UI comp nor a QUALITY BAR card is implied.

## Colors

The palette uses black plum surfaces, pale lavender copy, champagne gold actions and focused jewel light.

### Primary

Champagne Gold (gold-300) leads brand marks, references and pending-result headings. The primary action uses the three primary gradient stops with Primary Ink; the sidecar records its complete gradient. Accent Gold marks ornaments and the small status dot. Focus Gold makes keyboard location visible.

### Secondary

Lunar Violet, Stellar Cyan and Night Rose are the three artistic mood swatches. Gold and rainbow material colors illuminate the scene. Secondary Gold supports outlined actions.

### Neutral

Night Ground, Deep Plum and Elevated Plum establish page and panel depth. Lavender Ink and Muted Lavender separate primary and supporting copy. The fine Gold Rule divides sections. Controls use their dedicated near-black ground, lavender values, mauve border and readable placeholder. The calendar has a dark tray and a plum selected segment with pale gold text. Error Rose accompanies invalid borders with adjacent correction text.

**The Ornamental Meaning Rule.** Treat sacred geometry, decorative numerals and jewel colors as art; they do not encode a visitor’s result.

Sidecar OKLCH ramps are synthesized palette previews, not additional application tokens.

## Typography

**Display Font:** Self-hosted Cormorant Garamond Variable, with Noto Sans Thai Variable and serif fallbacks.

**Body Font:** Self-hosted Noto Sans Thai Variable, with system-ui and sans-serif fallbacks.

The serif creates a ceremonial scale while Thai copy retains generous leading. Form labels and corrections stay distinct from ornamental display lettering.

### Hierarchy

- **Display:** The hero uses the frontmatter display role. At 760px and below it becomes clamp(44px, 10vw, 70px), with Life Code on its own larger line.
- **Section display:** The form introduction uses the section-display role; mobile uses 68px with the italic phrase below.
- **Headline and title:** The story uses the headline role; mobile uses 32px/1.5. The form title is 23px, then 22px.
- **Body and labels:** Body defaults to 16px/1.75, story copy is 14px/2, labels are 14px and values are 15px. Error text is 13px. Helper/disclosure text is smaller and is supporting information only.
- **Brand and footer:** The wordmark is 32px, then 28px on mobile. The signature is 76px/1, then 64px, with an italic 22px, then 20px tagline.

**The Thai Reading Rule.** Use Noto Sans Thai for instructions, labels, input values and corrections; reserve the English serif for expressive display and reference numerals.

## Layout

The page has a 320px minimum CSS width. Header and story are centered within 1336px; the hero title is centered above a 535px scene stage with a 1290px maximum width. The canvas area reaches 1020px. Actions and scene controls follow it in normal reading order. At 1120px annotations disappear and the stage becomes 520px high.

At 760px, the hero scene is 430px tall and spans the section gutters, the control console stacks and the story becomes one column. The arched image is 545px high on desktop, 480px at the middle breakpoint and 430px on mobile, cropped at 78% horizontal position. At 370px the scene becomes 400px and the image 380px.

The form section has a 1140px maximum width, .9fr/1fr columns, a 90px gap and 96px 40px 76px padding. The gap becomes 48px at 1120px. Mobile stacks story and form with 24px side gutters and 26px 21px panel padding. Birthday fields remain a three-column grid. The catalogue uses three, two and then one column through its existing responsive rules. Reference links wrap; touch controls have at least a 44px target.

## Elevation & Depth

Depth comes from layered plum gradients, lit gold and glass geometry, fine mist, particles and the arched concept image. The form uses a dark gradient and a fine illuminated top edge. Main actions carry a soft black shadow; the hero lettering has a restrained gold glow. Exact gradients and shadows live in the sidecar.

The scene supports pointer parallax and lighting, horizontal drag with vertical touch scrolling preserved, scroll dolly, rotating rings and floating ornaments. A burst resets the orbit and expands particles gently. The artwork has an entrance reveal and hover tilt; CSS stars pulse slowly. Pause freezes scene motion and CSS animation. Reduced motion additionally removes entrance/hover movement. Offscreen and hidden-tab guards stop the WebGL loop. The source caps it at 30fps, DPR 1.5 and 650,000 backing pixels; these are constraints, not measured performance.

**The Resting Scene Rule.** Pause and reduced motion stop continuous scene movement; palette controls remain available as static redraws.

## Shapes

Fine gold frames and circular mandala geometry establish the world. Actions have small 4px corners, native fields 5px corners and the form a 14px radius. Mood controls are pill-shaped. The artwork uses a tall arch with a second inset frame. Reference-number links echo the arch, with rounded tops and short square feet. These ornamental shapes do not turn the form into a diagram.

## Components

### Buttons

Primary actions use the gold gradient, dark plum text, a fine gold border and soft shadow. Hover lightens the fill and raises the action by 2px; active returns it to rest. Secondary actions have transparent fill and a gold border. Focus uses a 2px outline with a 4px offset. Reset is a text action with an underline.

### Inputs / Fields

Native inputs and selects have a near-black ground, lavender values, mauve border, 50px height and 10px 13px padding. Hover changes the border to gold. Errors use Error Rose with adjacent written help; labels stay visible. The Buddhist/Gregorian toggle uses native buttons and aria-pressed, preserving the same date.

### Cards / Containers

The form is a plum gradient surface with a thin gold border, 14px corners and 32px desktop inset. It has no floating-card shadow. The pending notice uses a divider and written status. The concept image is separately captioned as Higgsfield art.

### Navigation

The header combines the wordmark, reference navigation and a framed start link. Hover and focus remain visible. At the mobile breakpoint the ornamental world link hides, and the start link retains its 44px target. Reference-number links wrap into centered rows and rise on hover unless reduced motion is requested.

### Scene controls

Three native mood buttons show a colored swatch, Thai label and aria-pressed selection. The selected mood has a plum fill and mauve border. Burst and pause are native labeled buttons outside the aria-hidden canvas. Burst is disabled while paused or reduced motion is active. Palette changes still redraw the static scene. WebGL failure or context loss shows the local concept artwork; restoration recreates the renderer.

## Do's and Don'ts

### Do:

- **Do** preserve the purple-black, gold and jewel palette across the form, results, catalogue and privacy surfaces.
- **Do** keep Thai labels and errors in Noto Sans Thai with visible focus and at least 44px interactive controls.
- **Do** preserve pause, reduced motion, offscreen, hidden-tab and WebGL fallback behavior.
- **Do** identify generated imagery as concept artwork and keep formula status explicit.

### Don't:

- **Don't** restore the rejected ivory and olive identity in this variant.
- **Don't** turn decorative numbers, lotus seals, mood choices or bottle names into measured or personalized results.
- **Don't** invent a formula, scent recommendation, health score or verified product photograph.
- **Don't** treat a render cap, code-led direction or Figma still as a device benchmark or an approved UI comp.
