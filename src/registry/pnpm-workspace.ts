import type { ConfigTypeDefinition } from "./types";

const pnpmWorkspace: ConfigTypeDefinition = {
	id: "pnpm-workspace",
	displayName: "pnpm-workspace.yaml",
	patterns: ["pnpm-workspace.yaml"],
	format: "yaml",
	fields: [
		// ── Workspace ────────────────────────────────────────────────────────────
		{
			key: "packages",
			label: "Packages",
			type: "array",
			itemType: "string",
			group: "Workspace",
			description:
				'Glob patterns for workspace package directories (e.g. ["packages/*", "apps/*"]). Use !pattern to exclude.',
		},
		// ── Catalog ──────────────────────────────────────────────────────────────
		{
			key: "catalog",
			label: "Default Catalog",
			type: "record",
			group: "Catalog",
			description:
				'Default catalog of shared dependency versions. Reference with "catalog:" in package.json (e.g. "chalk": "catalog:"). Requires pnpm 9.5+.',
		},
	],
};

export default pnpmWorkspace;
