import { X } from "lucide-react";
import { useRef } from "react";
import type { FieldType } from "../../registry/types";
import BooleanField from "./BooleanField";
import NumberField from "./NumberField";
import SecretField from "./SecretField";
import StringField from "./StringField";

interface Props {
	fieldKey: string;
	label: string;
	value: unknown[];
	itemType: Exclude<FieldType, "array" | "object">;
	onChange: (v: unknown[]) => void;
	error?: string;
	description?: string;
}

function getDefaultValue(
	itemType: Exclude<FieldType, "array" | "object">,
): unknown {
	switch (itemType) {
		case "number":
			return 0;
		case "boolean":
			return false;
		default:
			return "";
	}
}

function ArrayItem({
	index,
	value,
	itemType,
	fieldKey,
	onChange,
	onRemove,
}: {
	index: number;
	value: unknown;
	itemType: Exclude<FieldType, "array" | "object">;
	fieldKey: string;
	onChange: (v: unknown) => void;
	onRemove: () => void;
}) {
	const key = `${fieldKey}-${index}`;

	return (
		<div className="flex items-start gap-2">
			<div className="flex-1">
				{(itemType === "string" || itemType === "enum") && (
					<StringField
						fieldKey={key}
						label=""
						value={(value as string) ?? ""}
						onChange={onChange}
					/>
				)}
				{itemType === "number" && (
					<NumberField
						fieldKey={key}
						label=""
						value={(value as number) ?? 0}
						onChange={onChange}
					/>
				)}
				{itemType === "boolean" && (
					<BooleanField
						fieldKey={key}
						label={`Item ${index + 1}`}
						value={(value as boolean) ?? false}
						onChange={onChange}
					/>
				)}
				{itemType === "secret" && (
					<SecretField
						fieldKey={key}
						label=""
						value={(value as string) ?? ""}
						onChange={onChange}
					/>
				)}
			</div>
			<button
				type="button"
				className="btn btn-ghost btn-sm btn-circle mt-1 shrink-0"
				onClick={onRemove}
				aria-label="Remove item"
			>
				<X size={14} />
			</button>
		</div>
	);
}

export default function ArrayField({
	fieldKey,
	label,
	value,
	itemType,
	onChange,
	error,
	description,
}: Props) {
	const items = value ?? [];

	// Stable IDs for list items so React keys don't depend on index
	const stableIdsRef = useRef<string[]>([]);
	const prevFieldKeyRef = useRef(fieldKey);
	const idCounterRef = useRef(0);

	// Reset when field identity changes (different file loaded)
	if (prevFieldKeyRef.current !== fieldKey) {
		prevFieldKeyRef.current = fieldKey;
		stableIdsRef.current = [];
		idCounterRef.current = 0;
	}

	// Grow to cover initial items (e.g. first render with existing values)
	while (stableIdsRef.current.length < items.length) {
		stableIdsRef.current.push(`${fieldKey}-${++idCounterRef.current}`);
	}
	// Shrink if externally reduced
	if (stableIdsRef.current.length > items.length) {
		stableIdsRef.current = stableIdsRef.current.slice(0, items.length);
	}

	function handleItemChange(index: number, newVal: unknown) {
		const next = [...items];
		next[index] = newVal;
		onChange(next);
	}

	function handleAdd() {
		stableIdsRef.current.push(`${fieldKey}-${++idCounterRef.current}`);
		onChange([...items, getDefaultValue(itemType)]);
	}

	function handleRemove(index: number) {
		stableIdsRef.current.splice(index, 1);
		onChange(items.filter((_, i) => i !== index));
	}

	return (
		<div className="flex flex-col gap-2 w-full">
			<span className="text-sm font-medium">{label}</span>
			{description && (
				<p className="text-xs text-base-content/60">{description}</p>
			)}
			<div className="flex flex-col gap-2">
				{items.map((item, i) => (
					<ArrayItem
						key={stableIdsRef.current[i]}
						index={i}
						value={item}
						itemType={itemType}
						fieldKey={fieldKey}
						onChange={(v) => handleItemChange(i, v)}
						onRemove={() => handleRemove(i)}
					/>
				))}
			</div>
			<button
				type="button"
				className="btn btn-ghost btn-sm w-fit"
				onClick={handleAdd}
			>
				+ Add item
			</button>
			{error && <p className="text-xs text-error">{error}</p>}
		</div>
	);
}
