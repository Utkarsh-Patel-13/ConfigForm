import type { ConfigTypeDefinition } from "./types";

const env: ConfigTypeDefinition = {
	id: "env",
	displayName: ".env",
	patterns: [".env"],
	format: "env",
	// Fields are empty — env files use dynamic field generation.
	// VisualForm generates a "secret" field per parsed key at render time.
	fields: [],
	dynamic: true,
};

export default env;
