import biome from "./biome";
import bunfig from "./bunfig";
import editorconfig from "./editorconfig";
import env from "./env";
import eslintrc from "./eslintrc";
import npmrc from "./npmrc";
import packageJson from "./package-json";
import pnpmWorkspace from "./pnpm-workspace";
import prettierrc from "./prettierrc";
import tsconfig from "./tsconfig";
import turbo from "./turbo";
import type { ConfigTypeDefinition } from "./types";

export const CONFIG_REGISTRY: ConfigTypeDefinition[] = [
	packageJson,
	tsconfig,
	eslintrc,
	prettierrc,
	biome,
	turbo,
	editorconfig,
	npmrc,
	bunfig,
	pnpmWorkspace,
	env,
];

export function allPatterns(): string[] {
	return CONFIG_REGISTRY.flatMap((entry) => entry.patterns);
}
