import type { ConfigTypeDefinition } from "./types";

const packageJson: ConfigTypeDefinition = {
	id: "package-json",
	displayName: "package.json",
	patterns: ["package.json"],
	format: "json",
	fields: [
		// ── Identity ───────────────────────────────────────────────────────────
		{
			key: "name",
			label: "Name",
			type: "string",
			required: true,
			group: "Identity",
			description: "The package name. Must be lowercase, URL-safe.",
			validate: [{ rule: "required", message: "Name is required" }],
		},
		{
			key: "version",
			label: "Version",
			type: "string",
			required: true,
			group: "Identity",
			description: "Semantic version string (e.g. 1.0.0).",
			validate: [
				{ rule: "required", message: "Version is required" },
				{
					rule: "pattern",
					value: "^\\d+\\.\\d+\\.\\d+",
					message: "Version must follow semver (e.g. 1.0.0)",
				},
			],
		},
		{
			key: "description",
			label: "Description",
			type: "string",
			group: "Identity",
			description: "A short human-readable description of the package.",
		},
		{
			key: "keywords",
			label: "Keywords",
			type: "array",
			itemType: "string",
			group: "Identity",
			description: "Keywords that help people find the package on npm.",
		},
		{
			key: "homepage",
			label: "Homepage",
			type: "string",
			group: "Identity",
			description: "URL of the project homepage.",
		},
		{
			key: "license",
			label: "License",
			type: "enum",
			allowCustom: true,
			group: "Identity",
			options: [
				"MIT",
				"ISC",
				"Apache-2.0",
				"BSD-2-Clause",
				"BSD-3-Clause",
				"GPL-2.0-only",
				"GPL-3.0-only",
				"LGPL-2.1-only",
				"LGPL-3.0-only",
				"MPL-2.0",
				"UNLICENSED",
			],
			description: "The SPDX license identifier, or UNLICENSED.",
		},
		{
			key: "author",
			label: "Author",
			type: "string",
			group: "Identity",
			description: 'Package author — "Name <email> (url)" format.',
		},
		{
			key: "repository",
			label: "Repository",
			type: "string",
			group: "Identity",
			description:
				"URL or GitHub shorthand (e.g. github:user/repo) for the source repository.",
		},
		{
			key: "bugs",
			label: "Bugs URL",
			type: "string",
			group: "Identity",
			description: "URL where users can report bugs.",
		},
		{
			key: "contributors",
			label: "Contributors",
			type: "array",
			itemType: "string",
			group: "Identity",
			description:
				'Additional contributors — "Name <email> (url)" format per entry.',
		},
		{
			key: "funding",
			label: "Funding",
			type: "string",
			group: "Identity",
			description: "URL or package name for project funding information.",
		},
		// ── Entry Points ───────────────────────────────────────────────────────
		{
			key: "main",
			label: "Main",
			type: "string",
			group: "Entry Points",
			description: "CJS entry point for Node.js (require).",
		},
		{
			key: "module",
			label: "Module",
			type: "string",
			group: "Entry Points",
			description: "ESM entry point (used by bundlers like Vite, Rollup).",
		},
		{
			key: "browser",
			label: "Browser",
			type: "string",
			group: "Entry Points",
			description: "Browser-specific entry point override.",
		},
		{
			key: "types",
			label: "Types",
			type: "string",
			group: "Entry Points",
			description: "Path to the TypeScript declaration file.",
		},
		{
			key: "typings",
			label: "Typings",
			type: "string",
			group: "Entry Points",
			description: "Alias for types (legacy TypeScript field).",
		},
		{
			key: "files",
			label: "Files",
			type: "array",
			itemType: "string",
			group: "Entry Points",
			description: "Glob patterns for files to include when publishing to npm.",
		},
		{
			key: "bin",
			label: "Bin",
			type: "record",
			group: "Entry Points",
			description:
				'CLI command name → script path mappings (e.g. { "my-cli": "./bin/cli.js" }).',
		},
		{
			key: "directories",
			label: "Directories",
			type: "object",
			group: "Entry Points",
			description: "Hint at package directory layout (informational for npm).",
			fields: [
				{ key: "bin", label: "Bin Directory", type: "string" },
				{ key: "doc", label: "Doc Directory", type: "string" },
				{ key: "example", label: "Example Directory", type: "string" },
				{ key: "lib", label: "Lib Directory", type: "string" },
				{ key: "man", label: "Man Directory", type: "string" },
				{ key: "test", label: "Test Directory", type: "string" },
			],
		},
		// ── Module ─────────────────────────────────────────────────────────────
		{
			key: "type",
			label: "Module Type",
			type: "enum",
			options: ["commonjs", "module"],
			group: "Module",
			description:
				'Determines how .js files are interpreted — "module" for ESM, "commonjs" for CJS.',
		},
		{
			key: "private",
			label: "Private",
			type: "boolean",
			group: "Module",
			description: "Prevent accidental publish to npm when set to true.",
		},
		{
			key: "sideEffects",
			label: "Side Effects",
			type: "boolean",
			group: "Module",
			description:
				"Set false to hint bundlers that the package is side-effect-free (enables tree-shaking).",
		},
		{
			key: "packageManager",
			label: "Package Manager",
			type: "string",
			group: "Module",
			description:
				"Declares the expected package manager and version (e.g. bun@1.0.0).",
		},
		// ── Scripts ────────────────────────────────────────────────────────────
		{
			key: "scripts",
			label: "Scripts",
			type: "record",
			group: "Scripts",
			description:
				"Lifecycle scripts and custom commands runnable via the package manager.",
		},
		// ── Dependencies ───────────────────────────────────────────────────────
		{
			key: "dependencies",
			label: "Dependencies",
			type: "record",
			group: "Dependencies",
			description: "Production runtime dependencies.",
		},
		{
			key: "devDependencies",
			label: "Dev Dependencies",
			type: "record",
			group: "Dependencies",
			description:
				"Development-only dependencies (not installed by consumers).",
		},
		{
			key: "peerDependencies",
			label: "Peer Dependencies",
			type: "record",
			group: "Dependencies",
			description:
				"Dependencies that consumers must install alongside this package.",
		},
		{
			key: "optionalDependencies",
			label: "Optional Dependencies",
			type: "record",
			group: "Dependencies",
			description: "Dependencies that are allowed to fail installation.",
		},
		{
			key: "bundledDependencies",
			label: "Bundled Dependencies",
			type: "array",
			itemType: "string",
			group: "Dependencies",
			description: "Packages bundled inside the tarball when publishing.",
		},
		{
			key: "overrides",
			label: "Overrides",
			type: "record",
			group: "Dependencies",
			description: "Force specific versions of nested dependencies (npm).",
		},
		{
			key: "resolutions",
			label: "Resolutions",
			type: "record",
			group: "Dependencies",
			description: "Force specific versions of nested dependencies (yarn/bun).",
		},
		// ── Config & Environment ───────────────────────────────────────────────
		{
			key: "engines",
			label: "Engines",
			type: "record",
			group: "Config",
			description:
				'Required runtime versions (e.g. { "node": ">=18", "bun": ">=1" }).',
		},
		{
			key: "os",
			label: "OS",
			type: "array",
			itemType: "string",
			group: "Config",
			description: 'Allowed operating systems (e.g. ["darwin", "linux"]).',
		},
		{
			key: "cpu",
			label: "CPU",
			type: "array",
			itemType: "string",
			group: "Config",
			description: 'Allowed CPU architectures (e.g. ["x64", "arm64"]).',
		},
		{
			key: "config",
			label: "Config",
			type: "record",
			group: "Config",
			description:
				"Package-level config values exposed to scripts via npm_package_config_*.",
		},
		// ── Publish ────────────────────────────────────────────────────────────
		{
			key: "publishConfig",
			label: "Publish Config",
			type: "record",
			group: "Publish",
			description:
				"Configuration overrides applied only when publishing to npm.",
		},
		{
			key: "access",
			label: "Access",
			type: "enum",
			options: ["public", "restricted"],
			group: "Publish",
			description: "npm access level for scoped packages.",
		},
	],
};

export default packageJson;
