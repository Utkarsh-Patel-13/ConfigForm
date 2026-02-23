import type { ConfigTypeDefinition } from "./types";

const npmrc: ConfigTypeDefinition = {
	id: "npmrc",
	displayName: ".npmrc",
	patterns: [".npmrc"],
	format: "env",
	fields: [
		// ── Registry ─────────────────────────────────────────────────────────────
		{
			key: "registry",
			label: "Registry",
			type: "string",
			group: "Registry",
			description:
				"Base URL for package downloads and publishing. Default: https://registry.npmjs.org/",
		},
		{
			key: "save-exact",
			label: "Save Exact",
			type: "boolean",
			group: "Registry",
			description:
				"Save exact package versions in package.json instead of using ^ or ~ ranges.",
		},
		{
			key: "save-prefix",
			label: "Save Prefix",
			type: "enum",
			options: ["^", "~", ""],
			allowCustom: true,
			group: "Registry",
			description:
				'Version range prefix when saving dependencies. Default: "^".',
		},
		{
			key: "package-lock",
			label: "Package Lock",
			type: "boolean",
			group: "Registry",
			description: "Generate package-lock.json during install. Default: true.",
		},
		{
			key: "lockfile-version",
			label: "Lockfile Version",
			type: "number",
			group: "Registry",
			description: "Format version for package-lock.json. Default: 3.",
		},
		// ── Install ──────────────────────────────────────────────────────────────
		{
			key: "legacy-peer-deps",
			label: "Legacy Peer Deps",
			type: "boolean",
			group: "Install",
			description:
				"Ignore peer dependency conflicts during install (npm 7+ behavior). Default: false.",
		},
		{
			key: "strict-peer-deps",
			label: "Strict Peer Deps",
			type: "boolean",
			group: "Install",
			description:
				"Treat peer dependency conflicts as install failures. Default: false.",
		},
		{
			key: "optional",
			label: "Install Optional",
			type: "boolean",
			group: "Install",
			description: "Install optionalDependencies. Default: true.",
		},
		{
			key: "peer",
			label: "Install Peer",
			type: "boolean",
			group: "Install",
			description:
				"Auto-install missing non-optional peer dependencies. Default: true.",
		},
		{
			key: "engine-strict",
			label: "Engine Strict",
			type: "boolean",
			group: "Install",
			description:
				"Fail install if engines field in package.json does not match Node.js version. Default: false.",
		},
		{
			key: "bin-links",
			label: "Bin Links",
			type: "boolean",
			group: "Install",
			description:
				"Create symlinks for package bin files in node_modules/.bin/. Default: true.",
		},
		{
			key: "ignore-scripts",
			label: "Ignore Scripts",
			type: "boolean",
			group: "Install",
			description:
				"Skip all lifecycle scripts (preinstall, postinstall, etc.). Default: false.",
		},
		{
			key: "script-shell",
			label: "Script Shell",
			type: "string",
			group: "Install",
			description:
				"Shell to use for package.json scripts. Default: /bin/sh on Unix, cmd.exe on Windows.",
		},
		// ── Cache ────────────────────────────────────────────────────────────────
		{
			key: "cache",
			label: "Cache Directory",
			type: "string",
			group: "Cache",
			description: "npm cache directory path. Default: ~/.npm",
		},
		{
			key: "prefer-offline",
			label: "Prefer Offline",
			type: "boolean",
			group: "Cache",
			description:
				"Use cached packages if available, skip staleness checks. Default: false.",
		},
		{
			key: "prefer-online",
			label: "Prefer Online",
			type: "boolean",
			group: "Cache",
			description:
				"Always check for updates, even when cached. Default: false.",
		},
		{
			key: "offline",
			label: "Offline",
			type: "boolean",
			group: "Cache",
			description:
				"Force offline mode — no network requests at all. Default: false.",
		},
		// ── Logging ──────────────────────────────────────────────────────────────
		{
			key: "loglevel",
			label: "Log Level",
			type: "enum",
			options: [
				"silent",
				"error",
				"warn",
				"notice",
				"http",
				"timing",
				"info",
				"verbose",
				"silly",
			],
			group: "Logging",
			description: "Verbosity of npm output. Default: notice.",
		},
		{
			key: "progress",
			label: "Progress Bar",
			type: "boolean",
			group: "Logging",
			description:
				"Show progress bar during time-intensive operations. Default: true.",
		},
		{
			key: "color",
			label: "Color",
			type: "boolean",
			group: "Logging",
			description:
				"Colorized output. true = always, false = never, auto = TTY detection. Default: auto.",
		},
		// ── Network ──────────────────────────────────────────────────────────────
		{
			key: "proxy",
			label: "HTTP Proxy",
			type: "string",
			group: "Network",
			description: "HTTP proxy URL for http:// registry requests.",
		},
		{
			key: "https-proxy",
			label: "HTTPS Proxy",
			type: "string",
			group: "Network",
			description: "HTTPS proxy URL for https:// registry requests.",
		},
		{
			key: "no-proxy",
			label: "No Proxy",
			type: "string",
			group: "Network",
			description: "Comma-separated hostnames/domains that bypass the proxy.",
		},
		{
			key: "maxsockets",
			label: "Max Sockets",
			type: "number",
			group: "Network",
			description:
				"Maximum concurrent HTTP/HTTPS connections to the registry. Default: 50.",
		},
		{
			key: "fetch-timeout",
			label: "Fetch Timeout (ms)",
			type: "number",
			group: "Network",
			description:
				"Milliseconds to wait for registry HTTP responses. Default: 300000 (5 min).",
		},
		// ── Audit ────────────────────────────────────────────────────────────────
		{
			key: "audit",
			label: "Run Audit",
			type: "boolean",
			group: "Audit",
			description:
				"Submit audit reports to the registry during npm install. Default: true.",
		},
		{
			key: "audit-level",
			label: "Audit Level",
			type: "enum",
			options: ["info", "low", "moderate", "high", "critical"],
			group: "Audit",
			description:
				"Minimum vulnerability severity that causes npm audit to exit with error. Default: moderate.",
		},
		// ── Publishing ───────────────────────────────────────────────────────────
		{
			key: "access",
			label: "Access",
			type: "enum",
			options: ["public", "restricted"],
			group: "Publishing",
			description:
				"npm publish access level for scoped packages. Default: restricted.",
		},
		{
			key: "tag",
			label: "Tag",
			type: "string",
			group: "Publishing",
			description: 'Distribution tag used when publishing. Default: "latest".',
		},
		{
			key: "git-tag-version",
			label: "Git Tag Version",
			type: "boolean",
			group: "Publishing",
			description:
				"Create a git commit and tag when running npm version. Default: true.",
		},
		{
			key: "tag-version-prefix",
			label: "Tag Version Prefix",
			type: "string",
			group: "Publishing",
			description:
				'Prefix for version git tags (e.g. "v" → v1.0.0). Default: v.',
		},
		// ── pnpm ─────────────────────────────────────────────────────────────────
		{
			key: "node-linker",
			label: "Node Linker",
			type: "enum",
			options: ["isolated", "hoisted", "pnp"],
			group: "pnpm",
			description:
				"(pnpm) Dependency resolution strategy. isolated = symlinks, hoisted = flat, pnp = Plug'n'Play. Default: isolated.",
		},
		{
			key: "shamefully-hoist",
			label: "Shamefully Hoist",
			type: "boolean",
			group: "pnpm",
			description:
				"(pnpm) Hoist all packages to the root node_modules. Equivalent to node-linker=hoisted. Default: false.",
		},
		{
			key: "strict-peer-dependencies",
			label: "Strict Peer Dependencies",
			type: "boolean",
			group: "pnpm",
			description:
				"(pnpm) Fail install if peer dependency tree has missing or conflicting packages. Default: false.",
		},
		{
			key: "auto-install-peers",
			label: "Auto Install Peers",
			type: "boolean",
			group: "pnpm",
			description:
				"(pnpm) Automatically install missing peer dependencies. Default: false.",
		},
		{
			key: "store-dir",
			label: "Store Directory",
			type: "string",
			group: "pnpm",
			description:
				"(pnpm) Directory where all packages are saved. Default: ~/.local/share/pnpm/store.",
		},
		{
			key: "link-workspace-packages",
			label: "Link Workspace Packages",
			type: "boolean",
			group: "pnpm",
			description:
				"(pnpm) Symlink workspace packages instead of downloading from registry. Default: true.",
		},
		// ── Misc ─────────────────────────────────────────────────────────────────
		{
			key: "fund",
			label: "Show Funding",
			type: "boolean",
			group: "Misc",
			description:
				"Display funding information messages after install. Default: true.",
		},
		{
			key: "update-notifier",
			label: "Update Notifier",
			type: "boolean",
			group: "Misc",
			description: "Check for npm updates and notify. Default: true.",
		},
		{
			key: "node-options",
			label: "Node Options",
			type: "string",
			group: "Misc",
			description:
				"Command-line flags passed to Node.js (e.g. --max-old-space-size=4096).",
		},
	],
};

export default npmrc;
