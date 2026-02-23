import type { FieldDefinition } from "../registry/types";

export interface ValidationResult {
	valid: boolean;
	/** Keyed by field key; only contains entries for fields with errors */
	errors: Record<string, string>;
}

export function validate(
	fields: FieldDefinition[],
	values: Record<string, unknown>,
): ValidationResult {
	const errors: Record<string, string> = {};

	for (const field of fields) {
		if (!field.validate?.length) continue;
		const value = values[field.key];

		for (const rule of field.validate) {
			if (rule.rule === "required") {
				if (value === undefined || value === null || value === "") {
					errors[field.key] = rule.message;
					break;
				}
			} else if (rule.rule === "minLength") {
				if (
					typeof value === "string" &&
					value.length < (rule.value as number)
				) {
					errors[field.key] = rule.message;
					break;
				}
			} else if (rule.rule === "maxLength") {
				if (
					typeof value === "string" &&
					value.length > (rule.value as number)
				) {
					errors[field.key] = rule.message;
					break;
				}
			} else if (rule.rule === "min") {
				if (typeof value === "number" && value < (rule.value as number)) {
					errors[field.key] = rule.message;
					break;
				}
			} else if (rule.rule === "max") {
				if (typeof value === "number" && value > (rule.value as number)) {
					errors[field.key] = rule.message;
					break;
				}
			} else if (rule.rule === "pattern") {
				if (
					typeof value === "string" &&
					!new RegExp(rule.value as string).test(value)
				) {
					errors[field.key] = rule.message;
					break;
				}
			}
		}
	}

	return { valid: Object.keys(errors).length === 0, errors };
}
