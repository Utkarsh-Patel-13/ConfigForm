# ConfigForm

A local desktop app for editing project configuration files as structured data — not raw text.

---

## The Problem

Modern software projects are held together by configuration files. `package.json`, `tsconfig.json`, `.env`, `biome.json` — every tool has one, and most projects have dozens.

These files are structured by design. They have types, enums, required fields, and often formal schemas. But we edit them as plain text, which means syntax errors that only surface at runtime, valid files with invalid values, and constant tab-switching between docs and your editor.

ConfigForm treats configuration as what it actually is: structured, typed data.

## What It Does

Open a project folder. ConfigForm finds your config files, understands their structure, and gives you a form-based GUI to edit them safely — with the right input for each field type, validation before save, and no surprises.

For files with known schemas you get full semantic editing: enums show as dropdowns, booleans as toggles, required fields are marked, and invalid values are caught before they reach your terminal.

## Supported Config Files

| File | Description |
|------|-------------|
| `package.json` | npm / bun package manifest |
| `tsconfig.json` | TypeScript compiler options |
| `.eslintrc` / `eslint.config.*` | ESLint configuration |
| `.prettierrc` | Prettier formatting rules |
| `biome.json` | Biome linter and formatter |
| `turbo.json` | Turborepo pipeline config |
| `.editorconfig` | Editor normalization rules |
| `.npmrc` | npm registry and behavior settings |
| `bunfig.toml` | Bun runtime configuration |
| `pnpm-workspace.yaml` | pnpm monorepo workspace definition |
| `.env` | Environment variables |

Monorepo-aware: ConfigForm scans the full project tree and surfaces configs across all packages, not just the root.

## Tech Stack

- [Tauri 2](https://tauri.app/) — lightweight desktop runtime (Rust backend)
- [React 19](https://react.dev/) — UI
- [TypeScript 5.8](https://www.typescriptlang.org/) — strict mode throughout
- [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/) — styling
- [Vite](https://vite.dev/) — frontend build tool
- [Bun](https://bun.sh/) — package manager and runtime
- [Biome](https://biomejs.dev/) — linting and formatting
- Local only — no network requests, no telemetry, no accounts

## Prerequisites

- [Rust](https://rustup.rs/) (stable toolchain)
- [Bun](https://bun.sh/) (`curl -fsSL https://bun.sh/install | bash`)
- [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your OS (system libraries, Xcode/WebView2/etc.)

## Getting Started

```sh
# Install dependencies
bun install

# Start the app in development mode (hot-reload)
bun tauri dev

# Build a production binary
bun tauri build
```

The development build opens a native window connected to the Vite dev server, so frontend changes reflect instantly without restarting Tauri.

## Project Structure

```
src/                    # React frontend
  components/           # UI components
  registry/             # Config type definitions (one file per config)
    index.ts            # Registry export
    types.ts            # ConfigTypeDefinition interface
    package-json.ts     # Example: package.json definition
    tsconfig.ts
    ...
  types/                # Shared TypeScript types
src-tauri/              # Rust / Tauri backend
  src/lib.rs            # Tauri commands (file I/O, recents, folder picker)
  Cargo.toml
```

### Adding a New Config Type

Each supported file type is a self-contained registry entry. To add support for a new config:

1. Create `src/registry/<name>.ts` implementing `ConfigTypeDefinition`
2. Import and add it to the `CONFIG_REGISTRY` array in `src/registry/index.ts`

No core changes required — the app is a renderer, the knowledge lives in the registry.

## Non-Goals

ConfigForm is not an IDE, a DevOps dashboard, a deployment tool, or a cloud service. It doesn't replace your config files. It makes editing them less painful.

## Status

Early development. MVP focused on JS/TS toolchain projects.

## License

MIT — see [LICENSE](./LICENSE)
