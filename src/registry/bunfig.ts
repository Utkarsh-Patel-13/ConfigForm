import type { ConfigTypeDefinition } from "./types";

const bunfig: ConfigTypeDefinition = {
	id: "bunfig",
	displayName: "bunfig.toml",
	patterns: ["bunfig.toml"],
	format: "toml",
	fields: [
		// ── Root ─────────────────────────────────────────────────────────────────
		{
			key: "logLevel",
			label: "Log Level",
			type: "enum",
			options: ["debug", "warn", "error"],
			group: "Root",
			description: "Bun runtime log verbosity. Default: warn.",
		},
		{
			key: "smol",
			label: "Smol Mode",
			type: "boolean",
			group: "Root",
			description:
				"Reduce memory usage at the cost of performance. Default: false.",
		},
		{
			key: "preload",
			label: "Preload Scripts",
			type: "array",
			itemType: "string",
			group: "Root",
			description:
				"Scripts or plugins to execute before running any file (e.g. setup files, global mocks).",
		},
		// ── Install ──────────────────────────────────────────────────────────────
		{
			key: "install.optional",
			label: "Install Optional",
			type: "boolean",
			group: "Install",
			description: "Install optionalDependencies. Default: true.",
		},
		{
			key: "install.dev",
			label: "Install Dev",
			type: "boolean",
			group: "Install",
			description: "Install devDependencies. Default: true.",
		},
		{
			key: "install.peer",
			label: "Install Peer",
			type: "boolean",
			group: "Install",
			description: "Install peerDependencies. Default: true.",
		},
		{
			key: "install.production",
			label: "Production Mode",
			type: "boolean",
			group: "Install",
			description:
				"Install in production mode — skip devDependencies. Default: false.",
		},
		{
			key: "install.lockfile",
			label: "Generate Lockfile",
			type: "boolean",
			group: "Install",
			description: "Generate bun.lock during bun install. Default: true.",
		},
		{
			key: "install.linkWorkspacePackages",
			label: "Link Workspace Packages",
			type: "boolean",
			group: "Install",
			description:
				"Link workspace packages from the monorepo root into each package's node_modules. Default: true.",
		},
		{
			key: "install.linker",
			label: "Linker",
			type: "enum",
			options: ["isolated", "hoisted"],
			group: "Install",
			description:
				"Dependency layout strategy. isolated = symlinks (default for workspaces), hoisted = flat.",
		},
		{
			key: "install.generateLockfileNonBun",
			label: "Generate Non-Bun Lockfile",
			type: "enum",
			options: ["yarn"],
			allowCustom: false,
			group: "Install",
			description:
				'Also generate a yarn-compatible lockfile alongside bun.lock. Only "yarn" is supported.',
		},
		// ── Run ──────────────────────────────────────────────────────────────────
		{
			key: "run.shell",
			label: "Script Shell",
			type: "enum",
			options: ["bun", "system"],
			group: "Run",
			description:
				'Shell used for package.json scripts. "bun" uses Bun\'s built-in shell. Default: system on Unix, bun on Windows.',
		},
		{
			key: "run.allowlist",
			label: "Node Allowlist",
			type: "boolean",
			group: "Run",
			description:
				"Prepend $PATH with a node symlink pointing to bun so scripts expecting node still work. Default: false.",
		},
		// ── Test ─────────────────────────────────────────────────────────────────
		{
			key: "test.root",
			label: "Test Root",
			type: "string",
			group: "Test",
			description:
				"Root directory where bun test searches for test files. Default: .",
		},
		{
			key: "test.coverage",
			label: "Coverage",
			type: "boolean",
			group: "Test",
			description: "Enable coverage reporting. Default: false.",
		},
		{
			key: "test.reporter",
			label: "Reporter",
			type: "enum",
			options: ["default", "dots"],
			group: "Test",
			description:
				'Test output format. "dots" is compact, "default" is verbose. Default: default.',
		},
		{
			key: "test.coverageThresholdExclude",
			label: "Coverage Exclude",
			type: "array",
			itemType: "string",
			group: "Test",
			description: "Glob patterns for files to exclude from coverage reports.",
		},
	],
};

export default bunfig;
