# Theme System

This document covers two concerns:
1. **Token catalog** — the semantic tokens stored per event in the database that drive visual appearance.
2. **Legibility requirements** — the PR quality gate that every theme must pass before merging.

---

## Overview

The three public-facing pages use two distinct base themes:

| Route | Zone | Base palette |
|---|---|---|
| `/fiesta/[eventToken]` | A — FotoBooth | Light pink / rose / purple |
| `/inspiracion/[token]` | A — FotoBooth | Light pink / rose / purple |
| `/mis-fotos/[sessionToken]` | B — Session Gallery | Dark navy / indigo |

Zone A and Zone B each have their own token set. Both share the same semantic naming convention so the DB schema can use one table with a `zone` discriminator.

---

## Zone A — FotoBooth / Public Experience

**Pages:** `/fiesta/[eventToken]`, `/inspiracion/[token]`

**CSS files affected:**
- `src/assets/css/fotobooth.module.css`
- `src/assets/css/fotobooth-overview.module.css`
- `src/assets/css/inspiration-v2.module.css`
- `src/assets/css/social-media-cta.module.css`
- `src/features/party/components/PostActionConfirmation.module.css`

### Token definitions

| Token | Type | Default | Role |
|---|---|---|---|
| `pageBackground` | color | `#fff5f7` | Root page background for all three CSS shells |
| `primaryFrom` | color | `#ec4899` | Start of the primary pink→purple gradient |
| `primaryTo` | color | `#a855f7` | End of the primary pink→purple gradient |
| `ctaFrom` | color | `#9d174d` | Start of the main CTA / action button gradient |
| `ctaTo` | color | `#6b21a8` | End of the main CTA / action button gradient |
| `btnSecondaryBorder` | color | `#f9a8d4` | Border and active tint for secondary / outline buttons |
| `textDeep` | color | `#831843` | Headings, sheet titles, confirmation card title |
| `textAccent` | color | `#be185d` | Medium-emphasis labels, active tab, error icon |
| `textWine` | color | `#9d174d` | Secondary label copy, export event name |
| `textBody` | color | `#4a4a4a` | Regular body copy |
| `textMuted` | color | `#9ca3af` | Timestamps, placeholders, minor captions |
| `overlayScrim` | color | `rgba(44,16,34,0.42)` | Backdrop behind bottom sheets and modals |
| `sheetBackground` | gradient | `linear-gradient(180deg, #fff8fb 0%, #ffffff 100%)` | Bottom sheet and modal surface |
| `cardSurface` | color | `#fce7f3` | Session cards, tutorial cards, tip boxes |
| `mirrorHeroBackground` | color | `#130d16` | Dark fullscreen cover section in the overview hero |

### Per-token class mapping

#### `pageBackground`
- `fotobooth.module.css` → `.screen`
- `fotobooth-overview.module.css` → `.page`, `.centerPage`, `.heroHeader`, `.heroActions`, `.pageBody`
- `inspiration-v2.module.css` → `.pageRoot` (also sets `--bp2-bg`)

#### `primaryFrom` + `primaryTo` (gradient `135deg primaryFrom → primaryTo`)
- `fotobooth.module.css` → `.splashLogoRing`, `.dotActive`, `.effectChipActive`, `.viewerRetryBtn`, `.effectConfetti` (nth-child 1)
- `fotobooth.module.css` → `.carouselLogo` (gradient text), `.splashSpark` (gradient text)
- `fotobooth-overview.module.css` → `.sessionsDot`, `.sessionPlaceholder`
- `fotobooth-overview.module.css` → `.eventName`, `.emptyTitle`, `.emptyEventName` (gradient text)
- `inspiration-v2.module.css` → `.logoPill`, `.tabIndicator`, `.tutorialStepIcon`, `.tutorialDotActive`, `.personBtnActive`
- `inspiration-v2.module.css` → `.eventName`, `.frasesTitle` (gradient text), `--bp2-gradient`
- `inspiration-v2.module.css` → `.phraseCardLeft`, `.tipDot`
- `social-media-cta.module.css` → `.pageSocialBtnIg` (uses `#f9a8d4` → `#c084fc`; derived from primaryFrom/primaryTo tints)
- `Overview.tsx` → SVG `IconStack` stroke, `IconCamera` stroke (hardcoded inline — see Inline Styles section)

#### `ctaFrom` + `ctaTo` (gradient `135deg ctaFrom → ctaTo`)
- `fotobooth.module.css` → `.btnShare`, `.shareFallbackPrimary`
- `fotobooth.module.css` → `.splashName` (gradient text, `#9d174d → #6b21a8`)
- `fotobooth-overview.module.css` → `.btnPrimary`, `.viewAllBtn`
- `fotobooth-overview.module.css` → `.mirrorActions .btnPrimary` (via `.btnPrimary` selector)
- `PostActionConfirmation.module.css` → `.continueBtn` (uses `#be185d → #7e22ce`, a tint variant)

#### `btnSecondaryBorder`
- `fotobooth.module.css` → `.btnSave` (border color)
- `fotobooth-overview.module.css` → `.btnSecondary` (border), `.mirrorActions .btnSecondary` override (border, via parent context)
- `fotobooth-overview.module.css` → `.retryBtn`, `.mirrorOval`, `.sectionDivider`, `.shareToast` (border/background tints)

#### `textDeep`
- `fotobooth.module.css` → `.exportSheetTitle`, `.shareFallbackTitle`, `.exportOptionLabel`
- `fotobooth-overview.module.css` → (none directly; derived via gradient text classes)
- `inspiration-v2.module.css` → `.tutorialTitle`, `.tutorialStepTitle`, `.frasesSubtitle strong`, `--bp2-text-deep`
- `PostActionConfirmation.module.css` → `.title`

#### `textAccent`
- `fotobooth.module.css` → `.viewerHint`, `.viewerErrorIcon`, `.viewerErrorText`, `.downloadToast`
- `fotobooth-overview.module.css` → `.shareToast`, `.brandCtaTitle`, `.mirrorBase` (via `#fbcfe8` / `#f5d0fe` tints)
- `inspiration-v2.module.css` → `.chevron`, `.tabBtnActive`, `--bp2-text-accent`
- `social-media-cta.module.css` → `.pageTitulo`, `.sheetTitulo`, `.sheetCloseBtn` (color), `.pageSocialBtnIg` (color)

#### `textWine`
- `fotobooth.module.css` → `.shareFallbackSecondary`, `.exportPreviewEventName`
- `fotobooth-overview.module.css` → `.btnSecondary` (color), `.mirrorActions .btnSecondary` (color)
- `inspiration-v2.module.css` → `.tutorialProgressLabel`, `.tutorialStepLabel`, `.personBtnNum`, `--bp2-text-wine`
- `social-media-cta.module.css` → `.compactTitulo`, `.pageFollowNote` (derived)

#### `textBody`
- `inspiration-v2.module.css` → `.pageRoot` color, `.tutorialStepDesc`, `.frasesSubtitle`, `--bp2-text-body`

#### `textMuted`
- `inspiration-v2.module.css` → `.tabBtn`, `.personBtnLabel`, `--bp2-text-muted`

#### `overlayScrim`
- `fotobooth.module.css` → `.exportSheetOverlay`, `.shareFallbackOverlay`, `.successCtaOverlay`

#### `sheetBackground`
- `fotobooth.module.css` → `.exportSheet`, `.shareFallbackModal`, `.successCtaModal`

#### `cardSurface`
- `fotobooth-overview.module.css` → `.sessionCard`, `.carouselPlaceholder` (tint), `.brandCta` (tint with purple end)
- `inspiration-v2.module.css` → `.tutorialStep`, `.tutorialCompactIcon` (tint), `.poseCard` (tint)
- `social-media-cta.module.css` → `.pageCard`, `.sheetCloseBtn` (background), `.sheetSocialBtn` (background)

#### `mirrorHeroBackground`
- `fotobooth-overview.module.css` → `.mirrorHero`

---

## Zone B — Session Gallery Shell (dark)

**Page:** `/mis-fotos/[sessionToken]`

**CSS file affected:**
- `src/assets/css/party-public.module.css`

### Token definitions

| Token | Type | Default | Role |
|---|---|---|---|
| `pageBackground` | color | `#0b0b15` | Root page background, cover image fill |
| `primaryFrom` | color | `#6b5cff` | Start of the primary blue-indigo CTA gradient |
| `primaryTo` | color | `#1aa7ff` | End of the primary blue-indigo CTA gradient |
| `accentPurple` | color | `#8b84ff` | Sticker tray handle, step progress dots, tool button hover |
| `dedicateFrom` | color | `#9d174d` | Start of the Dedicar button gradient |
| `dedicateTo` | color | `#86198f` | End of the Dedicar button gradient |
| `textPrimary` | color | `#f5f6ff` | Main text, headings |
| `textMuted` | color | `rgba(190,198,255,0.7)` | Subheadings, meta labels, hints |
| `cardSurface` | color | `rgba(255,255,255,0.06)` | Gallery cards, preview rail items, grid cells |
| `overlayScrim` | color | `rgba(0,0,0,0.92)` | Lightbox overlay, modal backdrops |
| `yarlBackdrop` | color | `rgba(0,0,0,0.95)` | YARL lightbox `--yarl__color_backdrop` CSS variable |

### Per-token class mapping

#### `pageBackground`
- `.pageRoot`, `.fiestaPage`, `.coverImage`, `.mobileHero`

#### `primaryFrom` + `primaryTo` (gradient `120deg primaryFrom → primaryTo`)
- `.primaryBtn`, `.mobileHeroCta`, `.shareConfirmBtn`
- `.shareHighlight` (gradient text)

#### `accentPurple`
- `.stickerTrayHandle`, `.dedicateStepDotActive`, `.dedicateToolBtn:hover`
- `.stickerPaletteItemVertical:hover` (tint), `.phraseGridItem:hover` (tint)

#### `dedicateFrom` + `dedicateTo`
- `.btnDedicar` (gradient `135deg dedicateFrom → dedicateTo`)

#### `textPrimary`
- `.heroKicker`, `.heroContent h2`, `.introTitle`, `.misFotosTitle`, `.emptyTitle`, `.mobileHeroTitle`, `.mobileHeroSubtitle`, `.viewerClose` (color), `.btnIcon` (opacity variant)

#### `textMuted`
- `.misFotosKicker`, `.misFotosDate`, `.heroKicker` (variant), `.mobileHeroDescription`, `.galleryHeader p`, `.emptySubtitle`

#### `cardSurface`
- `.previewCard`, `.card`, `.mobileMasonryCard`

#### `overlayScrim`
- `.lightbox`, `.viewerOverlay`, `.postDescargaCard` (tint), `.shareConfirmCard` (tint)

#### `yarlBackdrop`
- `PhotoViewerLightbox` — injected as inline `--yarl__color_backdrop` on the YARL root styles object (see Inline Styles section)

---

## Inline Styles and Non-CSS-Module Colors

Three color sources live outside CSS modules and must be updated when implementing the CSS variable injection:

### 1. YARL lightbox backdrop — `PhotoViewerLightbox.tsx`
`ExperienceConfig.pageBackground` is already passed as `backdropColor` prop and injected as:
```ts
styles: { root: { '--yarl__color_backdrop': backdropColor } }
```
Zone A pages pass `#fff5f7`; Zone B passes `rgba(0,0,0,0.95)`. This is already token-driven — no change needed, just keep `ExperienceConfig.pageBackground` in sync with the `pageBackground` token.

### 2. Confetti palette — `FotoBoothSplash.tsx`
```ts
const CONFETTI_COLORS = ["#ec4899","#f9a8d4","#a855f7","#c084fc","#fb7185","#818cf8","#f0abfc"]
```
Hardcoded inline `style.background` per confetti piece. For full theming, derive this array from `primaryFrom` and `primaryTo` tints at runtime.

### 3. SVG icon strokes — `Overview.tsx` (FotoBoothOverview)
```tsx
// IconStack
stroke="#ec4899"               // → should become primaryFrom
stroke="rgba(236,72,153,0.4)"  // → rgba(primaryFrom, 0.4)

// IconCamera
stroke="rgba(236,72,153,0.3)"  // → rgba(primaryFrom, 0.3)

// IconCheck
stroke="#22c55e"               // success color — not themed
```
These are hardcoded JSX props. When converting to CSS variables, these SVGs need `currentColor` or a CSS variable prop.

---

## Legibility Requirements (PR Quality Gate)

Every PR that touches `src/assets/css/fotobooth*.module.css`, `src/assets/css/inspiration*.module.css`, or `src/features/party/experiences/*/` must pass these checks before merge.

### Required checks

1. **Main text contrast** — body and headline text must meet at least **4.5:1** against its real rendered background.
2. **Primary CTA contrast** — primary action buttons must meet at least **7:1** between text and button/background colors.
3. **Minimum important copy size** — important mobile copy must be at least **14px**; CTA copy must be at least **16px**.
4. **Real device review** — validate on an iPhone or equivalent mobile screen at roughly **50% brightness**.
5. **External readability test** — show the screen for 2 seconds and ask someone what the button says. If they cannot read it, the theme fails.

### Recommended tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Browser DevTools color picker for the final rendered hex values.
- Mobile screenshot review under realistic event lighting when possible.

### PR description requirement

Include the tested color pairs and their contrast ratios when a PR changes text, buttons, overlays, or theme backgrounds.

**Default theme pairs to always verify (Zone A):**

| Pair | Expected ratio |
|---|---|
| `textDeep` (`#831843`) on `pageBackground` (`#fff5f7`) | ≥ 7:1 |
| white on `ctaFrom` (`#9d174d`) | ≥ 7:1 |
| `textAccent` (`#be185d`) on `pageBackground` (`#fff5f7`) | ≥ 4.5:1 |
| `textWine` (`#9d174d`) on `cardSurface` (`#fce7f3`) | ≥ 4.5:1 |

**Default theme pairs to always verify (Zone B):**

| Pair | Expected ratio |
|---|---|
| `textPrimary` (`#f5f6ff`) on `pageBackground` (`#0b0b15`) | ≥ 7:1 |
| white on `primaryFrom` (`#6b5cff`) | ≥ 4.5:1 |
