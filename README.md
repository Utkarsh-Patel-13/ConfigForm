# ConfigForm

A local desktop app for editing project configuration files as structured data — not raw text.

## The Problem

Modern software projects are held together by configuration files. `package.json`, `tsconfig.json`, `.env`, `docker-compose.yml` — every tool has one, and most projects have dozens.

These files are structured by design. They have types, enums, required fields, and often formal schemas. But we edit them as plain text, which means:

- Syntax errors that only surface at runtime
- Valid files with invalid values
- No visibility into what options even exist
- Jumping between docs and your editor constantly

ConfigForm treats configuration as what it actually is: structured, typed data.

## What It Does

Open a project folder. ConfigForm finds your config files, understands their structure, and gives you a GUI to edit them safely — with the right input for each field type, validation before save, and no surprises.

For files with known schemas, you get full semantic editing: enums show as dropdowns, booleans as toggles, required fields are marked, and invalid values are caught before they reach your terminal.

For files without a schema, you get a clean key-value view. No enforcement, no magic — just a better way to look at the file.

## How It Works

ConfigForm is built around a **config registry**. Each supported config type is a self-contained definition: what files to detect, what schema to use, what component to render for each field type. The app is a renderer. The knowledge lives in the registry.

This means adding support for a new config type is additive — write a registry entry, and the app supports it. No core changes required.

## Current Support (MVP)

JS/TS frontend and fullstack projects:

- `package.json`
- `tsconfig.json`
- `.eslintrc` / `eslint.config.js`
- `.prettierrc`
- `vite.config.ts`
- `.env`
- `jest.config` / `vitest.config`

Monorepo-aware: ConfigForm scans the full project tree and surfaces configs across all packages, not just the root.

## Non-Goals

ConfigForm is not an IDE, a DevOps dashboard, a deployment tool, or a cloud service.

It doesn't replace your config files. It makes editing them less painful.

## Tech Stack

- [Tauri](https://tauri.app/) — lightweight desktop runtime
- React — UI
- Local only — no network requests, no telemetry, no accounts

## Status

Early development. MVP focused on JS/TS projects.

## Contributing

The easiest way to contribute is to add a new config type to the registry. Documentation for the registry format is coming as the architecture stabilizes.

## License

MIT