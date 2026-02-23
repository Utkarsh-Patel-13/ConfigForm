export type FieldType =
	| "string"
	| "number"
	| "boolean"
	| "enum"
	| "array"
	| "object"
	| "record"
	| "secret";

export type ConfigFormat = "json" | "jsonc" | "env";

export interface ValidationRule {
	rule: "required" | "minLength" | "maxLength" | "pattern" | "min" | "max";
	value?: string | number;
	message: string;
}

export interface FieldDefinition {
	/** Dot-notation path in the parsed config object, e.g. "compilerOptions.strict" */
	key: string;
	/** Human-readable label for the form */
	label: string;
	type: FieldType;
	required?: boolean;
	/** Default value used when the key is absent from the parsed file */
	default?: unknown;
	/** Short description shown as form help text */
	description?: string;
	/** Enum options (only when type === "enum") */
	options?: string[];
	/** Allow free-text entry in addition to preset options (only when type === "enum") */
	allowCustom?: boolean;
	/** Type of each item in the list (only when type === "array") */
	itemType?: Exclude<FieldType, "array" | "object" | "record">;
	/** Nested fields (only when type === "object") */
	fields?: FieldDefinition[];
	/** Validation rules evaluated before save */
	validate?: ValidationRule[];
	/** Collapsible section grouping in the visual form */
	group?: string;
}

export interface ConfigTypeDefinition {
	/** Unique stable identifier, e.g. "package-json" */
	id: string;
	/** Displayed in sidebar and top bar, e.g. "package.json" */
	displayName: string;
	/**
	 * Filename patterns to match during project scan.
	 * Exact filenames only for MVP (e.g. ["package.json"]).
	 */
	patterns: string[];
	/** How the file content is parsed and serialized */
	format: ConfigFormat;
	/** Field definitions — the complete schema for visual mode */
	fields: FieldDefinition[];
	/** When true, fields are generated dynamically from parsed values (e.g. .env) */
	dynamic?: boolean;
}
