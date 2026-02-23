import type { ConfigTypeDefinition } from "./types";

const turbo: ConfigTypeDefinition = {
	id: "turbo",
	displayName: "turbo.json",
	patterns: ["turbo.json"],
	format: "jsonc",
	fields: [
		// ── Root ──────────────────────────────────────────────────────────────────
		{
			key: "$schema",
			label: "Schema",
			type: "string",
			group: "Root",
			description: "URL to the Turborepo JSON schema for editor autocomplete.",
		},
		{
			key: "packageManager",
			label: "Package Manager",
			type: "string",
			group: "Root",
			description:
				'Required in v2+. Package manager and version (e.g. "npm@9.0.0", "bun@1.1.0").',
		},
		{
			key: "envMode",
			label: "Env Mode",
			type: "enum",
			options: ["strict", "loose"],
			group: "Root",
			description:
				'"strict" filters env vars to the allowlist only. "loose" passes all env vars through. Default: strict.',
		},
		{
			key: "ui",
			label: "UI",
			type: "enum",
			options: ["tui", "stream"],
			group: "Root",
			description:
				'"tui" shows an interactive terminal UI. "stream" outputs logs in real time. Default: tui.',
		},
		{
			key: "cacheDir",
			label: "Cache Directory",
			type: "string",
			group: "Root",
			description: "Local cache directory. Default: .turbo/cache.",
		},
		// ── Global Cache ─────────────────────────────────────────────────────────
		{
			key: "globalDependencies",
			label: "Global Dependencies",
			type: "array",
			itemType: "string",
			group: "Global Cache",
			description:
				'Glob patterns relative to turbo.json. Changes to matching files bust ALL task caches (e.g. ["tsconfig.json"]).',
		},
		{
			key: "globalEnv",
			label: "Global Env",
			type: "array",
			itemType: "string",
			group: "Global Cache",
			description:
				"Env variable names that affect ALL task hashes. Changes bust every task cache.",
		},
		{
			key: "globalPassThroughEnv",
			label: "Global Pass-Through Env",
			type: "array",
			itemType: "string",
			group: "Global Cache",
			description:
				"Env variables available to all tasks in Strict Mode that do NOT affect cache keys (e.g. CI, GITHUB_TOKEN).",
		},
		// ── Remote Cache ─────────────────────────────────────────────────────────
		{
			key: "remoteCache.enabled",
			label: "Enabled",
			type: "boolean",
			group: "Remote Cache",
			description: "Enable remote caching. Requires turbo login.",
		},
		{
			key: "remoteCache.signature",
			label: "Artifact Signing",
			type: "boolean",
			group: "Remote Cache",
			description:
				"Sign cached artifacts with TURBO_REMOTE_CACHE_SIGNATURE_KEY to verify authenticity.",
		},
		{
			key: "remoteCache.preflight",
			label: "Preflight Requests",
			type: "boolean",
			group: "Remote Cache",
			description:
				"Send OPTIONS preflight HTTP requests before cache operations.",
		},
		{
			key: "remoteCache.timeout",
			label: "Timeout (seconds)",
			type: "number",
			group: "Remote Cache",
			description:
				"Seconds to wait for remote cache responses. 0 disables timeout.",
		},
		{
			key: "remoteCache.url",
			label: "Custom URL",
			type: "string",
			group: "Remote Cache",
			description: "URL of a custom remote cache server.",
		},
	],
};

export default turbo;
