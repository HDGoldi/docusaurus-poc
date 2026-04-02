# Phase 8: Branding & Visual Alignment - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 08-branding-visual-alignment
**Areas discussed:** Favicon & logo sourcing, Dark mode cleanup scope, External navbar links, Navbar title & branding

---

## Favicon & Logo Sourcing

| Option | Description | Selected |
|--------|-------------|----------|
| Extract from 1nce.com | Download favicon and SVG logo from live 1nce.com site | |
| Use existing 1nce-logo.svg | Verify existing repo asset and add favicon separately | |
| I'll provide the files | User supplies exact files | |

**User's choice:** Extract from 1nce.com

**Follow-up: Source site for favicon**

| Option | Description | Selected |
|--------|-------------|----------|
| From help.1nce.com | Use the original Developer Hub's favicon | |
| From 1nce.com | Use the main corporate site's favicon | |
| You decide | Claude picks whichever is cleanest | |

**User's choice:** From 1nce.com
**Notes:** Both favicon (120x120 PNG) and logo SVG to be extracted from 1nce.com corporate site.

---

## Dark Mode Cleanup Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Full cleanup | Disable toggle + strip all dark CSS rules | |
| Config-only | Just set colorMode to light-only, leave dark CSS as dead code | |
| Full cleanup + swizzle | Full CSS cleanup plus swizzle ColorModeToggle to no-op | |

**User's choice:** Config-only
**Notes:** Simplest approach — set defaultMode light, disableSwitch true, remove respectPrefersColorScheme. Dark CSS in custom.css left as harmless dead code.

---

## External Navbar Links

**Position:**

| Option | Description | Selected |
|--------|-------------|----------|
| Right side | External links on right, doc tabs on left | |
| Left side after doc tabs | External links after doc tabs on left | |
| You decide | Match original help.1nce.com layout | |

**User's choice:** Right side

**URLs:**

| Option | Description | Selected |
|--------|-------------|----------|
| Match original hub header | Same URLs as original help.1nce.com header | |
| I'll provide exact URLs | User specifies exact URLs | |
| You decide | Claude extracts from original hub | |

**User's choice:** Match original hub header

**Style:**

| Option | Description | Selected |
|--------|-------------|----------|
| Text-only | Simple text labels | |
| Text + external link icon | Text with arrow icon | |
| You decide | Match original hub | |

**User's choice:** Text-only

---

## Navbar Title & Branding

**Title:**

| Option | Description | Selected |
|--------|-------------|----------|
| Keep title text | Show '1NCE Developer Hub' next to logo | |
| Logo only | Remove text, just logo | |
| You decide | Match original help.1nce.com | |

**User's choice:** Keep title text

**Social card:**

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, create 1NCE-branded card | Replace default with 1NCE-branded OG image | |
| Not in this phase | Keep current, address later | |
| You decide | Based on effort vs impact | |

**User's choice:** Yes, create 1NCE-branded card

---

## Claude's Discretion

- Exact external link URL paths (regional prefix like /en-eu/)
- Social card image design (1NCE branding, appropriate OG dimensions)

## Deferred Ideas

None — discussion stayed within phase scope.
