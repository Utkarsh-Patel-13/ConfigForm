import type { FieldDefinition } from "../../registry/types";
import ArrayField from "./ArrayField";
import BooleanField from "./BooleanField";
import EnumField from "./EnumField";
import NumberField from "./NumberField";
import ObjectField from "./ObjectField";
import RecordField from "./RecordField";
import SecretField from "./SecretField";
import StringField from "./StringField";

interface Props {
	field: FieldDefinition;
	value: unknown;
	onChange: (key: string, v: unknown) => void;
	error?: string;
}

export default function FieldRenderer({
	field,
	value,
	onChange,
	error,
}: Props) {
	switch (field.type) {
		case "string":
			return (
				<div className="mb-4">
					<StringField
						fieldKey={field.key}
						label={field.label}
						value={(value as string) ?? ""}
						onChange={(v) => onChange(field.key, v)}
						error={error}
						description={field.description}
						required={field.required}
					/>
				</div>
			);

		case "number":
			return (
				<div className="mb-4">
					<NumberField
						fieldKey={field.key}
						label={field.label}
						value={(value as number) ?? 0}
						onChange={(v) => onChange(field.key, v)}
						error={error}
						description={field.description}
					/>
				</div>
			);

		case "boolean":
			return (
				<div className="mb-4">
					<BooleanField
						fieldKey={field.key}
						label={field.label}
						value={(value as boolean) ?? false}
						onChange={(v) => onChange(field.key, v)}
						error={error}
						description={field.description}
					/>
				</div>
			);

		case "enum":
			return (
				<div className="mb-4">
					<EnumField
						fieldKey={field.key}
						label={field.label}
						value={(value as string) ?? ""}
						options={field.options ?? []}
						allowCustom={field.allowCustom}
						onChange={(v) => onChange(field.key, v)}
						error={error}
						description={field.description}
					/>
				</div>
			);

		case "secret":
			return (
				<div className="mb-4">
					<SecretField
						fieldKey={field.key}
						label={field.label}
						value={(value as string) ?? ""}
						onChange={(v) => onChange(field.key, v)}
						error={error}
						description={field.description}
					/>
				</div>
			);

		case "array":
			return (
				<div className="mb-4">
					<ArrayField
						fieldKey={field.key}
						label={field.label}
						value={(value as unknown[]) ?? []}
						itemType={field.itemType ?? "string"}
						onChange={(v) => onChange(field.key, v)}
						error={error}
						description={field.description}
					/>
				</div>
			);

		case "object":
			return (
				<div className="mb-4">
					<ObjectField
						fieldKey={field.key}
						label={field.label}
						fields={field.fields ?? []}
						value={(value as Record<string, unknown>) ?? {}}
						onChange={(v) => onChange(field.key, v)}
						error={error}
						description={field.description}
					/>
				</div>
			);

		case "record":
			return (
				<div className="mb-4">
					<RecordField
						fieldKey={field.key}
						label={field.label}
						value={(value as Record<string, string>) ?? {}}
						onChange={(v) => onChange(field.key, v)}
						error={error}
						description={field.description}
					/>
				</div>
			);

		default:
			return null;
	}
}
