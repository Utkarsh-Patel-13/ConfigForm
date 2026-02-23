import type { FieldDefinition } from "../../registry/types";
// FieldRenderer is imported lazily to avoid circular dependency at module evaluation time.
// By the time ObjectField renders, FieldRenderer is fully loaded.
import FieldRenderer from "./FieldRenderer";

interface Props {
	fieldKey: string;
	label: string;
	fields: FieldDefinition[];
	value: Record<string, unknown>;
	onChange: (v: Record<string, unknown>) => void;
	error?: string;
	description?: string;
}

export default function ObjectField({
	fieldKey: _fieldKey,
	label,
	fields,
	value,
	onChange,
	error,
	description,
}: Props) {
	if (fields.length === 0) {
		return null;
	}

	function handleSubChange(subKey: string, subValue: unknown) {
		onChange({ ...value, [subKey]: subValue });
	}

	return (
		<div className="flex flex-col gap-1 w-full">
			<span className="text-sm font-medium">{label}</span>
			{description && (
				<p className="text-xs text-base-content/60">{description}</p>
			)}
			<div className="border-l-2 border-base-300 pl-4 flex flex-col gap-0">
				{fields.map((field) => (
					<FieldRenderer
						key={field.key}
						field={field}
						value={value?.[field.key]}
						onChange={handleSubChange}
						error={undefined}
					/>
				))}
			</div>
			{error && <p className="text-xs text-error">{error}</p>}
		</div>
	);
}
