import { parse as parseToml, stringify as stringifyToml } from "smol-toml";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import type {
	ConfigFormat,
	FieldDefinition,
	FieldType,
} from "../registry/types";

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
		if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(";"))
			continue;
		const eqIdx = trimmed.indexOf("=");
		if (eqIdx === -1) continue;
		const key = trimmed.slice(0, eqIdx).trim();
		const value = trimmed.slice(eqIdx + 1).trim();
		result[key] = value;
	}
	return result;
}

// ── INI (editorconfig) ───────────────────────────────────────────────────────

function parseIniValue(value: string): unknown {
	const lower = value.toLowerCase();
	if (lower === "true") return true;
	if (lower === "false") return false;
	if (value !== "" && !Number.isNaN(Number(value))) return Number(value);
	return lower; // editorconfig spec: values are lowercased
}

export function parseIni(content: string): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	let currentSection: Record<string, unknown> | null = null;

	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(";"))
			continue;

		if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
			const sectionName = trimmed.slice(1, -1);
			const section: Record<string, unknown> = {};
			result[sectionName] = section;
			currentSection = section;
			continue;
		}

		const eqIdx = trimmed.indexOf("=");
		if (eqIdx === -1) continue;
		const key = trimmed.slice(0, eqIdx).trim().toLowerCase();
		const value = trimmed.slice(eqIdx + 1).trim();

		if (currentSection !== null) {
			currentSection[key] = parseIniValue(value);
		} else {
			result[key] = parseIniValue(value);
		}
	}

	return result;
}

function iniValueToString(value: unknown): string {
	if (typeof value === "boolean") return value ? "true" : "false";
	return String(value);
}

export function serializeIni(obj: Record<string, unknown>): string {
	let result = "";
	const sections: Array<[string, Record<string, unknown>]> = [];

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			sections.push([key, value as Record<string, unknown>]);
		} else {
			result += `${key} = ${iniValueToString(value)}\n`;
		}
	}

	for (const [sectionName, sectionValues] of sections) {
		result += `\n[${sectionName}]\n`;
		for (const [k, v] of Object.entries(sectionValues)) {
			result += `${k} = ${iniValueToString(v)}\n`;
		}
	}

	return result;
}

// ── Path helpers ──────────────────────────────────────────────────────────────

export function getPath(obj: unknown, dotKey: string): unknown {
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

// ── Type coercion for env/ini string values ───────────────────────────────────

function coerceValue(value: string, type: FieldType): unknown {
	if (type === "boolean") return value === "true";
	if (type === "number") {
		const n = Number(value);
		return Number.isNaN(n) ? value : n;
	}
	return value;
}

// ── parseFile ─────────────────────────────────────────────────────────────────

export function parseFile(
	content: string,
	format: ConfigFormat,
	fields: FieldDefinition[],
): { values: Record<string, unknown>; unknownFields: Record<string, unknown> } {
	// ── ENV (flat key=value, e.g. .env, .npmrc) ──────────────────────────────
	if (format === "env") {
		const parsed = parseEnv(content);

		if (fields.length === 0) {
			// Dynamic mode (.env): all keys go into values
			return {
				values: { ...parsed } as Record<string, unknown>,
				unknownFields: {},
			};
		}

		// Schema-based mode (.npmrc): extract + coerce known fields, preserve rest
		const values: Record<string, unknown> = {};
		for (const field of fields) {
			const v = parsed[field.key];
			if (v !== undefined) {
				values[field.key] = coerceValue(v, field.type);
			}
		}
		return { values, unknownFields: { ...parsed } as Record<string, unknown> };
	}

	// ── INI (editorconfig) ───────────────────────────────────────────────────
	if (format === "ini") {
		const parsed = parseIni(content);
		const values: Record<string, unknown> = {};
		for (const field of fields) {
			const v = getPath(parsed, field.key);
			if (v !== undefined) {
				values[field.key] = v;
			}
		}
		const unknownFields = JSON.parse(JSON.stringify(parsed)) as Record<
			string,
			unknown
		>;
		return { values, unknownFields };
	}

	// ── TOML (bunfig.toml) ───────────────────────────────────────────────────
	if (format === "toml") {
		const parsed = parseToml(content) as Record<string, unknown>;
		const values: Record<string, unknown> = {};
		for (const field of fields) {
			const v = getPath(parsed, field.key);
			if (v !== undefined) {
				values[field.key] = v;
			}
		}
		const unknownFields = JSON.parse(JSON.stringify(parsed)) as Record<
			string,
			unknown
		>;
		return { values, unknownFields };
	}

	// ── YAML (pnpm-workspace.yaml) ───────────────────────────────────────────
	if (format === "yaml") {
		const parsed = (parseYaml(content) ?? {}) as Record<string, unknown>;
		const values: Record<string, unknown> = {};
		for (const field of fields) {
			const v = getPath(parsed, field.key);
			if (v !== undefined) {
				values[field.key] = v;
			}
		}
		const unknownFields = JSON.parse(JSON.stringify(parsed)) as Record<
			string,
			unknown
		>;
		return { values, unknownFields };
	}

	// ── JSON / JSONC ─────────────────────────────────────────────────────────
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

// ── serializeFile ─────────────────────────────────────────────────────────────

export function serializeFile(
	values: Record<string, unknown>,
	unknownFields: Record<string, unknown>,
	format: ConfigFormat,
): string {
	// ── ENV ──────────────────────────────────────────────────────────────────
	if (format === "env") {
		if (Object.keys(unknownFields).length === 0) {
			// Dynamic .env mode
			return `${Object.entries(values)
				.map(([k, v]) => `${k}=${String(v)}`)
				.join("\n")}\n`;
		}
		// Schema-based .npmrc mode: merge values into original key set
		const merged: Record<string, string> = {};
		for (const [k, v] of Object.entries(unknownFields)) {
			merged[k] = String(v);
		}
		for (const [k, v] of Object.entries(values)) {
			merged[k] = String(v);
		}
		return `${Object.entries(merged)
			.map(([k, v]) => `${k}=${v}`)
			.join("\n")}\n`;
	}

	// ── INI ──────────────────────────────────────────────────────────────────
	if (format === "ini") {
		const base = JSON.parse(JSON.stringify(unknownFields)) as Record<
			string,
			unknown
		>;
		for (const [dotKey, value] of Object.entries(values)) {
			setPath(base, dotKey, value);
		}
		return serializeIni(base);
	}

	// ── TOML ─────────────────────────────────────────────────────────────────
	if (format === "toml") {
		const base = JSON.parse(JSON.stringify(unknownFields)) as Record<
			string,
			unknown
		>;
		for (const [dotKey, value] of Object.entries(values)) {
			setPath(base, dotKey, value);
		}
		return stringifyToml(base);
	}

	// ── YAML ─────────────────────────────────────────────────────────────────
	if (format === "yaml") {
		const base = JSON.parse(JSON.stringify(unknownFields)) as Record<
			string,
			unknown
		>;
		for (const [dotKey, value] of Object.entries(values)) {
			setPath(base, dotKey, value);
		}
		return stringifyYaml(base);
	}

	// ── JSON / JSONC ─────────────────────────────────────────────────────────
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
