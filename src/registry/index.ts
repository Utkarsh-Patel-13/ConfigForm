import env from "./env";
import eslintrc from "./eslintrc";
import packageJson from "./package-json";
import prettierrc from "./prettierrc";
import tsconfig from "./tsconfig";
import type { ConfigTypeDefinition } from "./types";

export const CONFIG_REGISTRY: ConfigTypeDefinition[] = [
	packageJson,
	tsconfig,
	eslintrc,
	prettierrc,
	env,
];

export function allPatterns(): string[] {
	return CONFIG_REGISTRY.flatMap((entry) => entry.patterns);
}
