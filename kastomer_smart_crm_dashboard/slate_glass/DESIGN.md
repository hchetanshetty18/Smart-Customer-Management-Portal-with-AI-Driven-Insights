# Design System Specification: The Architectural CRM

## 1. Overview & Creative North Star

### The Creative North Star: "The Digital Curator"
This design system moves away from the cluttered, "utility-first" appearance of traditional SaaS platforms. Instead, it adopts the persona of **The Digital Curator**. We are building a space that feels like a high-end gallery for data—where information is not just displayed, but exhibited with intention. 

By leveraging sophisticated **Tonal Layering**, **Glassmorphism**, and **Intentional Asymmetry**, we break the rigid "box-on-box" grid. The goal is a workspace that feels calm, authoritative, and expensive. We prioritize "breathing room" (generous whitespace) to reduce cognitive load, ensuring that the primary deep navy and vibrant teal accents command attention only where it is deserved.

---

## 2. Colors & Surface Logic

Our palette is rooted in a deep, authoritative navy (`on_primary_fixed`) and supported by high-energy accents. However, the secret to a premium feel lies in how we handle the "in-between" spaces.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or modules. Boundaries must be established through color shifts. 
- Use `surface_container_low` for secondary sidebar areas.
- Use `surface_container_lowest` (Pure White) for primary content cards.
- Use `surface` (`#f7f9fd`) for the global background.
*The eye should perceive a change in depth, not a line on a page.*

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
1.  **Base Layer:** `surface` (The foundation).
2.  **Sectional Layer:** `surface_container_low` (Used for grouped content areas).
3.  **Action Layer:** `surface_container_lowest` (The "Card" where data lives).
4.  **Floating Layer:** Glassmorphic elements (Navigation and Modals).

### The "Glass & Gradient" Rule
To prevent a "flat" appearance, apply a subtle linear gradient to primary action buttons, moving from `primary` (`#000000`) to `primary_container` (`#131b2e`). For the navigation, utilize a backdrop-blur (12px–20px) with a 60% opacity fill of `surface_container_lowest`.

---

## 3. Typography

We utilize **Inter** not as a standard font, but as an editorial tool. The hierarchy is designed to guide the eye through complex CRM data without friction.

*   **Display & Headline (The Authority):** Used for high-level metrics and page titles. These should feel bold and grounded.
    *   `display-lg` (3.5rem) / `headline-lg` (2.0rem): Tracking set to -0.02em for a tighter, premium feel.
*   **Title & Body (The Content):** Optimized for high readability.
    *   `title-md` (1.125rem): Use for card titles and section headers.
    *   `body-md` (0.875rem): The workhorse for all data entry and descriptions.
*   **Labels (The Utility):** 
    *   `label-md` (0.75rem): Always use `outline` color to ensure they remain secondary to the data they describe.

---

## 4. Elevation & Depth

Standard shadows are the mark of amateur design. This system uses **Tonal Layering** and **Ambient Light Physics**.

### The Layering Principle
Instead of a shadow, place a `surface_container_lowest` card on a `surface_container` background. This "soft lift" is more sophisticated than a drop shadow.

### Ambient Shadows
When an element must float (e.g., a dropdown or a floating action button), use a shadow color tinted with our primary navy:
- **Shadow Spec:** `0px 12px 32px rgba(15, 23, 42, 0.06)`
- This creates a natural, atmospheric depth rather than a "dirty" grey blur.

### The "Ghost Border" Fallback
If a container requires a boundary (e.g., in high-density data tables), use a **Ghost Border**: 
- `outline_variant` at **15% opacity**. 
- Never use a 100% opaque border; it creates visual "noise" that disrupts the editorial flow.

---

## 5. Components

### Navigation (Glassmorphism)
The primary sidebar or top-nav must use a semi-transparent `surface` fill with a `20px` backdrop-blur. 
- **Edge Treatment:** A 1px Ghost Border on the trailing edge to catch the light.

### Buttons
- **Primary:** `primary_container` background with `on_primary` text. `xl` (0.75rem) corner radius.
- **Accent (The Teal Spark):** Use `secondary` (`#006b5f`) for "Success" or "Create" actions to differentiate from the primary brand navy.
- **Secondary Accent (The Orange Pulse):** Use `tertiary` tokens specifically for time-sensitive notifications or "High-Value" lead indicators.

### Cards & Lists
- **No Dividers:** Prohibit the use of horizontal rules between list items. Use 16px–24px of vertical padding to separate entries.
- **Hover State:** On hover, transition the background from `surface_container_lowest` to `surface_container_low` for a tactile, responsive feel.

### Input Fields
- **Minimalist State:** Background should be `surface_container_low`. On focus, transition to `surface_container_lowest` with a `secondary` (Teal) Ghost Border.

---

## 6. Do's and Don'ts

### Do:
- **Do** use asymmetrical layouts for dashboards (e.g., a 70/30 split where the 30% column is a different surface tone).
- **Do** use `primary_fixed_dim` for "read-only" data labels to maintain a sophisticated color story.
- **Do** lean into `xl` (0.75rem) roundedness for large containers to soften the professional tone.

### Don't:
- **Don't** use pure black (#000000) for text. Always use `on_surface` or `on_background` for a softer, premium contrast.
- **Don't** use standard Material Design "Card Shadows." If the tone shift doesn't provide enough separation, increase the whitespace.
- **Don't** use "Default" blue for links. Every interactive element must be either `secondary` (Teal) or `primary` (Navy).
- **Don't** crowd the edges. If a component is within 24px of another, it is likely too close.