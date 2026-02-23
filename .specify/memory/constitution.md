<!--
SYNC IMPACT REPORT
==================
Version change: N/A (initial population) → 1.0.0
Modified principles: All (initial definition — no prior version existed)
Added sections:
  - Core Principles (I–V)
  - Performance Standards
  - Development Workflow
  - Governance
Removed sections: All placeholder tokens replaced; no sections removed
Templates requiring updates:
  ✅ .specify/memory/constitution.md (this file)
  ✅ .specify/templates/plan-template.md — "Constitution Check" placeholder is intentional;
     updated to list explicit gate items referencing Principles I–V
  ✅ .specify/templates/spec-template.md — generic structure; no changes required
  ✅ .specify/templates/tasks-template.md — generic structure; no changes required
Follow-up TODOs: None — all placeholders resolved
-->

# ConfigForm Constitution

## Core Principles

### I. Registry-First Architecture

Every supported config type MUST be defined entirely within the config registry. Adding
support for a new config file type means adding one registry entry — detection rule, field
schema, and component mapping all live there. Core rendering logic MUST NOT contain
per-file-type branches or special cases. If a change requires touching core rendering code
to handle a specific config type, the registry definition is incomplete.

**Rationale**: The registry is the explicit extension contract. Violating it creates hidden
coupling between config knowledge and rendering logic, making the system harder to extend,
test, and reason about.

### II. Type-Safe Field Rendering

Every field in the registry MUST declare an explicit type (`string`, `number`, `boolean`,
`enum`, `array`, `object`, `secret`). Each declared type MUST map to exactly one input
component class. A field's declared type MUST be respected at all times — silent coercion
of user input to a different type is prohibited. Validation MUST be applied and MUST pass
before any write operation is permitted.

**Rationale**: ConfigForm's core value is treating configuration as typed, structured data.
Allowing type ambiguity or silent coercion undermines the safety guarantees users rely on
and makes the app no better than a text editor.

### III. Explicit Save — No Auto-Write

The application MUST NOT write to disk without explicit user action (the Save button).
Auto-save is prohibited. Validation MUST run in full before any file write is attempted.
Validation errors MUST be surfaced inline, adjacent to the offending field — not only in a
global toast or modal.

**Rationale**: Config files are load-bearing. Unexpected writes — even correct ones — break
user trust. The explicit save model keeps users in control and makes application behavior
predictable.

### IV. Visual Consistency Across Config Types

All config types MUST be rendered using the shared component system. Per-config-type
custom UI is prohibited. Booleans MUST render as toggles, enums MUST render as dropdowns,
secrets MUST render with masked input — consistently across every config file the app
supports. UX patterns established in the component system MUST NOT be overridden for
individual config files.

**Rationale**: Users should not have to re-learn the interface when switching between config
files. Consistency reduces errors and builds familiarity.

### V. Offline-First, Local-Only

ConfigForm is a local desktop application. It MUST function entirely without network
access. No runtime CDN imports, no external API calls, and no cloud dependencies are
permitted for any core functionality. All fonts, assets, and dependencies MUST be bundled
at build time. This principle applies to styling assets (fonts, icons) as well as code.

**Rationale**: Developer machines are not always online. Config files are sensitive. Network
dependencies in a local editing tool are both unreliable and a security risk.

## Performance Standards

All thresholds apply to the local machine running ConfigForm and MUST be met without
network access:

- **App startup**: Reaches interactive state (project loaded, sidebar populated) in
  under 2 seconds on a standard development machine.
- **File load**: Selecting a config file in the sidebar renders the visual form in
  under 200 ms.
- **Save round-trip**: After the user triggers Save, validation + disk write completes
  and the UI reflects the saved state in under 500 ms.
- **Sidebar scan**: Detecting all config files in a project (including monorepo packages)
  completes in under 1 second for projects with up to 100 packages.
- **Memory**: The application does not exceed 200 MB resident memory during normal
  editing sessions.

## Development Workflow

- New config type support MUST be implemented as a registry entry; no feature branch may
  touch core rendering logic to accommodate a specific config type.
- Validation logic for a config field MUST be co-located with its registry definition.
- Visual mode and raw mode MUST remain independently testable; a change to one MUST NOT
  require changes to the other.
- The three-panel layout (sidebar + editor + top bar) is a fixed constraint; changes to
  information architecture require a constitution amendment.
- All feature specs and implementation plans MUST include a Constitution Check section
  verifying compliance with Principles I–V before implementation begins.

## Governance

This constitution supersedes all other project practices. Any deviation from the
principles above MUST be documented in the plan's Complexity Tracking section with
explicit justification. Amendments require:

1. A pull request that updates this file.
2. A version bump per semantic versioning:
   - MAJOR — principle removal or redefinition
   - MINOR — new principle or section added
   - PATCH — clarifications, wording, non-semantic refinements
3. A Sync Impact Report embedded as an HTML comment at the top of this file.
4. Updates to any templates or guidance files affected by the change.

All PRs MUST verify compliance with the active constitution version before merge.
Complexity introduced in violation of a principle MUST be justified before a plan is
approved — not after.

**Version**: 1.0.0 | **Ratified**: 2026-02-22 | **Last Amended**: 2026-02-22
