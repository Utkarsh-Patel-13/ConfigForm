import type { ConfigFormat, FieldDefinition } from "../registry/types";

export function stripJsonComments(s: string): string {
	let result = "";
	let i = 0;
	let inString = false;

	while (i < s.length) {
		const ch = s[i];
		const next = s[i + 1];

		if (inString) {
			// Handle escape sequences inside strings
			if (ch === "\\" && i + 1 < s.length) {
				result += ch + s[i + 1];
				i += 2;
				continue;
			}
			if (ch === '"') inString = false;
			result += ch;
			i++;
			continue;
		}

		if (ch === '"') {
			inString = true;
			result += ch;
			i++;
			continue;
		}

		// Line comment
		if (ch === "/" && next === "/") {
			while (i < s.length && s[i] !== "\n") i++;
			continue;
		}

		// Block comment
		if (ch === "/" && next === "*") {
			i += 2;
			while (i < s.length - 1 && !(s[i] === "*" && s[i + 1] === "/")) i++;
			i += 2;
			continue;
		}

		result += ch;
		i++;
	}

	// Remove trailing commas before } or ]
	return result.replace(/,(\s*[}\]])/g, "$1");
}

export function parseEnv(content: string): Record<string, string> {
	const result: Record<string, string> = {};
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eqIdx = trimmed.indexOf("=");
		if (eqIdx === -1) continue;
		const key = trimmed.slice(0, eqIdx).trim();
		const value = trimmed.slice(eqIdx + 1).trim();
		result[key] = value;
	}
	return result;
}

function getPath(obj: unknown, dotKey: string): unknown {
	const keys = dotKey.split(".");
	let current: unknown = obj;
	for (const key of keys) {
		if (current === null || typeof current !== "object") return undefined;
		current = (current as Record<string, unknown>)[key];
	}
	return current;
}

export function setPath(obj: unknown, dotKey: string, value: unknown): void {
	const keys = dotKey.split(".");
	let current = obj as Record<string, unknown>;
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (
			current[key] === null ||
			current[key] === undefined ||
			typeof current[key] !== "object"
		) {
			current[key] = {};
		}
		current = current[key] as Record<string, unknown>;
	}
	current[keys[keys.length - 1]] = value;
}

export function parseFile(
	content: string,
	format: ConfigFormat,
	fields: FieldDefinition[],
): { values: Record<string, unknown>; unknownFields: Record<string, unknown> } {
	if (format === "env") {
		const parsed = parseEnv(content);
		const values: Record<string, unknown> = { ...parsed };
		return { values, unknownFields: {} };
	}

	const stripped = format === "jsonc" ? stripJsonComments(content) : content;
	const parsed = JSON.parse(stripped) as Record<string, unknown>;

	const values: Record<string, unknown> = {};
	for (const field of fields) {
		const v = getPath(parsed, field.key);
		if (v !== undefined) {
			values[field.key] = v;
		} else if (field.default !== undefined) {
			values[field.key] = field.default;
		}
	}

	// unknownFields stores the full original parsed object and acts as the base
	// for serialization — unknown keys are preserved on round-trip
	const unknownFields = JSON.parse(JSON.stringify(parsed)) as Record<
		string,
		unknown
	>;
	return { values, unknownFields };
}

export function serializeFile(
	values: Record<string, unknown>,
	unknownFields: Record<string, unknown>,
	format: ConfigFormat,
): string {
	if (format === "env") {
		return `${Object.entries(values)
			.map(([k, v]) => `${k}=${String(v)}`)
			.join("\n")}\n`;
	}

	// Clone the base object (unknownFields = full original parsed object)
	const base = JSON.parse(JSON.stringify(unknownFields)) as Record<
		string,
		unknown
	>;
	// Deep-merge registry values back in
	for (const [dotKey, value] of Object.entries(values)) {
		setPath(base, dotKey, value);
	}

	return `${JSON.stringify(base, null, 2)}\n`;
}
