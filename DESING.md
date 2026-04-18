# Design System Strategy: Digital Brutalism & The Sovereign Console

## 1. Overview & Creative North Star

The North Star for this design system is **"The Sovereign Console."**

We are moving away from the "friendly" web of rounded corners and soft pastels. Instead, we are leaning into a high-end, editorial interpretation of a Terminal User Interface (TUI). This system treats the screen as a high-density command deck, where information is power and the aesthetic is uncompromisingly functional.

By combining the raw, structural honesty of Digital Brutalism with sophisticated typographic scales, we create an experience that feels like a premium tool for an elite operator. We break the "template" look through intentional asymmetry, massive typographic contrast, and a "modular block" layout that favors information density over white space.

## 2. Colors: Phosphor & The Void

The palette is built on the high-contrast relationship between **The Void** (our deep charcoal backgrounds) and **The Phosphor** (our vibrant Matrix-green highlights).

### Surface Hierarchy & Nesting

To create depth without relying on traditional shadows, we use a "stacked block" approach.

* **Base Layer:** `surface` (#101418) or `surface_container_lowest` (#0a0f13) represents the absolute depth of the console.
* **Active Modules:** Use `surface_container` (#1c2025) for primary content areas.
* **Elevated Details:** Use `surface_container_highest` (#31353a) for floating panels or temporary overlays.

### The "No-Line" Rule

Standard 1px solid CSS borders are strictly prohibited for sectioning. They feel "web-standard" and cheap. Instead:

1. **Define boundaries through tonal shifts:** Place a `surface_container_low` block directly against a `surface` background.
2. **Character Strokes:** If a boundary is required, use "ASCII-inspired" strokes—thick 4px or 8px blocks of `outline_variant` (#3b4b37) or actual character-based dividers (e.g., a row of `_` or `|` characters).

### The "Glass & Gradient" Rule

To elevate the retro-tech vibe, we introduce "Buffer Transparency." Floating elements should use a semi-transparent `surface_container_high` with a `backdrop-blur`. This simulates a high-end CRT glass overlay.
**Signature Texture:** Apply a subtle vertical linear gradient to the `primary_container` (#00ff41), transitioning slightly toward `primary_fixed` (#72ff70). This creates a "glow" effect reminiscent of vintage phosphor screens.

## 3. Typography: The Technical Editorial

We utilize **Space Grotesk** across all scales. Its wide stance and geometric terminal-like qualities provide a "high-end technical" feel that standard monospaced fonts lack.

* **Display Scales (Large):** Use `display-lg` for data-heavy hero moments. These should feel like a system readout.
* **Headline & Title:** Use these to create a clear hierarchy. Headlines should always be in all-caps or preceded by a terminal prompt symbol (`>_`).
* **Body & Labels:** `body-md` is your workhorse. Use `label-sm` for metadata—think of it as the "fine print" in a technical manual.

The hierarchy is not just about size; it's about **Intentional Asymmetry**. Pair a massive `display-md` headline on the far left with a small, dense block of `label-sm` metadata on the far right to create a sophisticated, unbalanced editorial layout.

## 4. Elevation & Depth: Tonal Layering

In a TUI, depth is perceived through luminosity, not just physics.

* **The Layering Principle:** Stacking is the primary method of hierarchy. A `surface_container_lowest` card sitting on a `surface_container_low` section creates a recessed "sunken" feel, while the opposite creates a "raised" block.
* **Ambient Glow (Shadows):** Traditional drop shadows are replaced by "Glow." When an element must float, use a shadow with a large blur (20px+) at a very low opacity (5-8%), using the `surface_tint` (#00e639) color. This mimics the light bleed of a bright screen.
* **The Ghost Border Fallback:** For interactive states (like focus), use a "Ghost Border"—the `outline` token at 20% opacity. This provides a hint of structure without breaking the monolithic block aesthetic.

## 5. Components

### Buttons

* **Primary:** Solid block of `primary_container` (#00ff41) with `on_primary_container` (#007117) text. Zero border-radius.
* **Secondary:** A "Ghost" style. No background, but a 2px `outline` border. On hover, the background fills with `surface_container_highest`.
* **Tertiary:** Text-only, preceded by a `[` and followed by a `]` to simulate a bracketed terminal command.

### Inputs & Text Fields

* **Visual Style:** Inputs should never look like "boxes." They are underlined areas using `outline` or recessed blocks using `surface_container_lowest`.
* **The Prompt:** Every input must have a `>` or `$` prefix using the `primary` color to signal interactivity.

### Chips & Tags

* **Selection Chips:** Use `secondary_container` (#0067d7) with high-contrast text. They should look like "tags" in a file system.
* **Status Chips:** Use `error_container` (#93000a) for alerts. No rounding; keep them blocky and aggressive.

### Lists & Navigation

* **The Divider Rule:** Forbid the use of line-dividers. Use 16px or 24px of vertical space (from the spacing scale) or shift the background color of alternating rows (`surface` to `surface_container_low`).
* **Active State:** Mark active list items with a solid vertical bar (4px wide) of `primary` color on the left edge.

### Additional Component: The "Data Grid"

A bespoke component for this system. A dense table where every cell is separated by "ghost" character strokes (`|`) and headers are always `label-md` in all-caps with a `primary_fixed` background.

## 6. Do's and Don'ts

### Do

* **Do** use 0px border-radius for everything. Hard edges are mandatory.
* **Do** lean into high density. Users of this system should feel they have a "God-view" of the data.
* **Do** use monospaced formatting for numbers and timestamps to ensure vertical alignment in lists.
* **Do** use the `primary` green sparingly for "Call to Action" only. If everything glows, nothing glows.

### Don't

* **Don't** use standard "web" shadows. They ruin the flat, technical aesthetic.
* **Don't** use 1px solid lines for decoration. Use whitespace or background tonal shifts.
* **Don't** use centered layouts. Stick to a rigid, left-aligned grid with occasional right-aligned metadata for an editorial feel.
* **Don't** use animations that feel "bouncy" or "organic." Use "stepped" or "linear" transitions to mimic terminal rendering speeds.
