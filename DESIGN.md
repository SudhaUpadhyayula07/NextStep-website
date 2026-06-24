---
name: Premium Career Guidance System
colors:
  surface: '#fff9ed'
  surface-dim: '#e2dabf'
  surface-bright: '#fff9ed'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf3d8'
  surface-container: '#f7eed3'
  surface-container-high: '#f1e8cd'
  surface-container-highest: '#ebe2c8'
  on-surface: '#1f1c0b'
  on-surface-variant: '#45464d'
  inverse-surface: '#35301e'
  inverse-on-surface: '#f9f0d5'
  outline: '#76777e'
  outline-variant: '#c6c6ce'
  surface-tint: '#535e7d'
  primary: '#010a26'
  on-primary: '#ffffff'
  primary-container: '#16213d'
  on-primary-container: '#7e89aa'
  inverse-primary: '#bbc6ea'
  secondary: '#556340'
  on-secondary: '#ffffff'
  secondary-container: '#d8e9bc'
  on-secondary-container: '#5b6946'
  tertiary: '#0e0d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#25230b'
  on-tertiary-container: '#8e8b6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#bbc6ea'
  on-primary-fixed: '#0f1a36'
  on-primary-fixed-variant: '#3b4664'
  secondary-fixed: '#d8e9bc'
  secondary-fixed-dim: '#bccca2'
  on-secondary-fixed: '#131f04'
  on-secondary-fixed-variant: '#3e4b2b'
  tertiary-fixed: '#e9e4be'
  tertiary-fixed-dim: '#ccc8a4'
  on-tertiary-fixed: '#1e1c05'
  on-tertiary-fixed-variant: '#4a482c'
  background: '#fff9ed'
  on-background: '#1f1c0b'
  surface-variant: '#ebe2c8'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  container-max: 1200px
---

## Brand & Style

This design system is built on the pillars of **Executive Clarity** and **Sophisticated Growth**. It targets high-achieving professionals seeking their next career milestone, evoking a sense of calm authority, intentionality, and premium curation.

The visual style is a fusion of **Minimalism** and **Editorial Design**. It prioritizes generous whitespace and a rhythmic vertical cadence to reduce cognitive load. By utilizing a "Soft Layered" approach, the interface avoids harsh divisions, instead using subtle tonal shifts and organic shadows to guide the eye. The aesthetic is professional yet warm, moving away from cold corporate tech toward a more bespoke, human-centric advisory experience.

## Colors

The color palette is rooted in a "New Academic" aesthetic—combining the stability of Dark Navy with the organic growth associated with Deep Moss Green.

- **Primary (Dark Navy):** Used for core branding, primary calls to action, and high-level headings. It provides the "anchor" for the UI.
- **Accent (Deep Moss Green):** Reserved for highlights, success states, and meaningful iconography. It represents progression and vitality.
- **Background (Warm Cream):** Replaces clinical whites to provide a premium, paper-like feel that reduces eye strain during long reading sessions.
- **Secondary Background (Soft Sage):** Used for sectioning content and creating "container" logic within the layout.
- **Surface (Subtle Off-White):** Employed for cards and interactive elements to lift them visually from the Warm Cream background.

## Typography

The typography strategy leverages the geometric strength of **Sora** for impact and the refined legibility of **Manrope** for utility.

- **Headlines (Sora):** Set with tight tracking and generous line heights to create an editorial feel. Display sizes should be used sparingly for hero sections to maintain a premium atmosphere.
- **Body & Stats (Manrope):** Chosen for its high x-height and modern proportions. It remains legible at smaller scales, making it ideal for data-heavy career stats and long-form guidance articles.
- **Numeric Data:** Use Manrope with tabular lining figures when displaying salary ranges or growth percentages to ensure perfect vertical alignment in tables and lists.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to ensure content remains centered and digestible, mirroring the layout of a high-end magazine.

- **Grid System:** A 12-column grid is used for desktop (1200px max-width), transitioning to a 4-column grid for mobile.
- **Rhythm:** An 8px base unit governs all spacing. Vertical margins between sections should be generous (80px or 120px) to allow the "Warm Cream" background to provide visual breathing room.
- **Padding:** Content containers (Cards) use a minimum of 32px padding to maintain an airy, premium feel.

## Elevation & Depth

This design system avoids heavy drop shadows in favor of **Tonal Layers** and **Ambient Depth**. 

- **Layering:** Hierarchy is primarily established by placing `Surface` (#F8F3ED) cards on `Background` (#F7EED3) or `Secondary Background` (#D1CCA8) areas.
- **Shadows:** When used, shadows must be extremely diffused: `0px 10px 30px rgba(22, 33, 61, 0.04)`. The shadow color should always be a tinted version of the Primary Navy, never pure black, to maintain the soft "layered" aesthetic.
- **Borders:** Subtle, low-contrast borders (1px) in `Secondary Background` (#D1CCA8) are used to define card boundaries where tonal shifts are too minimal for accessibility.

## Shapes

The shape language is consistently **Rounded (Level 2)**. This softens the professional tone of the Dark Navy and creates an approachable, modern environment. 

- **Buttons & Inputs:** Use the base 0.5rem (8px) radius.
- **Content Cards:** Use the `rounded-lg` (1rem / 16px) radius to create a distinct container feel.
- **Avatars & Icons:** Use full "Pill" rounding for a friendly, human-centric touch within the career guidance context.

## Components

### Buttons
- **Primary:** Dark Navy background with White text. No border. Smooth 200ms transition to a slightly lighter navy on hover.
- **Secondary:** Transparent background with a 1.5px Dark Navy border.
- **Ghost:** Deep Moss Green text with no background, used for less prominent actions.

### Cards
Cards are the primary content vehicle. They feature the `Surface` color, 16px corner radius, and a subtle 1px border in the Sage tone. On hover, cards should lift slightly using the ambient shadow defined in the Elevation section.

### Input Fields
Inputs use a minimal "underline" or "soft-box" style. They feature the Warm Cream background with a bottom border in Soft Sage. On focus, the border transitions to Dark Navy with a 2px thickness.

### Chips & Tags
Used for skills and categories. These use the Soft Sage background with Manrope-Medium typography. They should be small and unobtrusive, using a pill-shaped radius.

### Progress Indicators
For career paths, use the Deep Moss Green for "Completed" states and a desaturated Sage for "Upcoming" states, utilizing thin, 4px rounded bars to maintain the minimal aesthetic.