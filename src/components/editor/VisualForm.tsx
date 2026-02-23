import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { getPath } from "../../lib/parser";
import { useMemo, useState } from "react";
import type { ConfigTypeDefinition, FieldType } from "../../registry/types";
import ArrayField from "../fields/ArrayField";
import BooleanField from "../fields/BooleanField";
import FieldRenderer from "../fields/FieldRenderer";
import NumberField from "../fields/NumberField";
import RecordField from "../fields/RecordField";
import SecretField from "../fields/SecretField";
import StringField from "../fields/StringField";
import AddFieldPanel from "./AddFieldPanel";

interface Props {
	configType: ConfigTypeDefinition;
	values: Record<string, unknown>;
	unknownFields: Record<string, unknown>;
	errors: Record<string, string>;
	onFieldChange: (key: string, value: unknown) => void;
}

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({
	title,
	defaultOpen,
	badge,
	children,
}: {
	title: string;
	defaultOpen: boolean;
	badge?: number;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div className="border border-base-300 rounded-lg mb-3 overflow-hidden">
			<button
				type="button"
				className="w-full flex items-center gap-2 px-4 py-2.5 bg-base-200 hover:bg-base-300 transition-colors text-left"
				onClick={() => setOpen((v) => !v)}
			>
				{open ? (
					<ChevronDown size={14} className="shrink-0 text-base-content/60" />
				) : (
					<ChevronRight size={14} className="shrink-0 text-base-content/60" />
				)}
				<span className="font-medium text-sm flex-1">{title}</span>
				{badge !== undefined && badge > 0 && (
					<span className="badge badge-sm badge-ghost text-base-content/50">
						{badge}
					</span>
				)}
			</button>
			{open && <div className="p-4 flex flex-col gap-0">{children}</div>}
		</div>
	);
}

// ── Auto-detect type of an unknown value ────────────────────────────────────

function detectType(value: unknown): FieldType {
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "number") return "number";
	if (Array.isArray(value)) return "array";
	if (typeof value === "object" && value !== null) {
		const vals = Object.values(value as object);
		if (vals.length === 0 || vals.every((v) => typeof v === "string"))
			return "record";
	}
	return "string";
}

// ── Renderer for keys not in the schema ─────────────────────────────────────

function ExtraField({
	fieldKey,
	value,
	onChange,
	error,
}: {
	fieldKey: string;
	value: unknown;
	onChange: (key: string, v: unknown) => void;
	error?: string;
}) {
	const type = detectType(value);

	switch (type) {
		case "boolean":
			return (
				<div className="mb-4">
					<BooleanField
						fieldKey={fieldKey}
						label={fieldKey}
						value={(value as boolean) ?? false}
						onChange={(v) => onChange(fieldKey, v)}
						error={error}
					/>
				</div>
			);
		case "number":
			return (
				<div className="mb-4">
					<NumberField
						fieldKey={fieldKey}
						label={fieldKey}
						value={(value as number) ?? 0}
						onChange={(v) => onChange(fieldKey, v)}
						error={error}
					/>
				</div>
			);
		case "array":
			return (
				<div className="mb-4">
					<ArrayField
						fieldKey={fieldKey}
						label={fieldKey}
						value={(value as unknown[]) ?? []}
						itemType="string"
						onChange={(v) => onChange(fieldKey, v)}
						error={error}
					/>
				</div>
			);
		case "record":
			return (
				<div className="mb-4">
					<RecordField
						fieldKey={fieldKey}
						label={fieldKey}
						value={(value as Record<string, string>) ?? {}}
						onChange={(v) => onChange(fieldKey, v)}
						error={error}
					/>
				</div>
			);
		default:
			// Complex objects fall back to JSON textarea
			if (typeof value === "object" && value !== null) {
				return (
					<div className="mb-4 flex flex-col gap-1">
						<span className="text-sm font-medium">{fieldKey}</span>
						<textarea
							className="textarea textarea-bordered w-full font-mono text-xs"
							rows={5}
							defaultValue={JSON.stringify(value, null, 2)}
							onBlur={(e) => {
								try {
									onChange(fieldKey, JSON.parse(e.target.value));
								} catch {
									// ignore invalid JSON
								}
							}}
						/>
						{error && <p className="text-xs text-error">{error}</p>}
					</div>
				);
			}
			return (
				<div className="mb-4">
					<StringField
						fieldKey={fieldKey}
						label={fieldKey}
						value={String(value ?? "")}
						onChange={(v) => onChange(fieldKey, v)}
						error={error}
					/>
				</div>
			);
	}
}

// ── Default value for newly added fields ────────────────────────────────────

function defaultForType(type: FieldType): unknown {
	switch (type) {
		case "boolean":
			return false;
		case "number":
			return 0;
		case "array":
			return [];
		case "record":
		case "object":
			return {};
		default:
			return "";
	}
}

// ── Main VisualForm component ────────────────────────────────────────────────

export default function VisualForm({
	configType,
	values,
	unknownFields,
	errors,
	onFieldChange,
}: Props) {
	const [showAddPanel, setShowAddPanel] = useState(false);

	// All useMemo hooks must be called unconditionally before any early returns

	// Group schema fields by their group property
	const groups = useMemo(() => {
		const map = new Map<string, typeof configType.fields>();
		for (const field of configType.fields) {
			const g = field.group ?? "General";
			if (!map.has(g)) map.set(g, []);
			map.get(g)?.push(field);
		}
		return map;
	}, [configType.fields]);

	// Top-level keys covered by the schema
	const schemaTopKeys = useMemo(
		() => new Set(configType.fields.map((f) => f.key.split(".")[0])),
		[configType.fields],
	);

	// Extra keys: in the parsed file or added via values, but not in schema
	const extraKeys = useMemo(() => {
		const fromFile = Object.keys(unknownFields).filter(
			(k) => !schemaTopKeys.has(k),
		);
		const fromValues = Object.keys(values).filter(
			(k) => !schemaTopKeys.has(k) && !(k in unknownFields),
		);
		return [...fromFile, ...fromValues];
	}, [unknownFields, values, schemaTopKeys]);

	// Keys currently present (in file or in values), used by AddFieldPanel
	const presentKeys = useMemo(() => {
		const keys = new Set<string>();
		for (const field of configType.fields) {
			const topKey = field.key.split(".")[0];
			if (
				unknownFields[topKey] !== undefined ||
				values[field.key] !== undefined
			) {
				keys.add(field.key);
			}
		}
		return keys;
	}, [configType.fields, unknownFields, values]);

	// Dynamic mode: .env files
	if (configType.dynamic) {
		const entries = Object.entries(values);
		if (entries.length === 0) {
			return (
				<div className="text-center text-base-content/50 py-8 text-sm">
					No variables found in this file.
				</div>
			);
		}
		return (
			<div>
				{entries.map(([key, val]) => (
					<div key={key} className="mb-4">
						<SecretField
							fieldKey={key}
							label={key}
							value={(val as string) ?? ""}
							onChange={(v) => onFieldChange(key, v)}
							error={errors[key]}
						/>
					</div>
				))}
			</div>
		);
	}

	// Count how many fields in a group have values in the file
	function countPresent(fields: typeof configType.fields) {
		return fields.filter((f) => {
			const topKey = f.key.split(".")[0];
			return unknownFields[topKey] !== undefined || values[f.key] !== undefined;
		}).length;
	}

	// Is a group's section open by default?
	function isGroupOpen(fields: typeof configType.fields) {
		return fields.some((f) => {
			const topKey = f.key.split(".")[0];
			return unknownFields[topKey] !== undefined || values[f.key] !== undefined;
		});
	}

	if (configType.fields.length === 0 && extraKeys.length === 0) {
		return (
			<div className="text-center text-base-content/50 py-8 text-sm">
				No fields defined for this config type.
			</div>
		);
	}

	return (
		<div>
			{/* Schema field sections */}
			{[...groups.entries()].map(([group, fields]) => {
				const present = countPresent(fields);
				return (
					<Section
						key={group}
						title={group}
						defaultOpen={isGroupOpen(fields)}
						badge={present}
					>
						{fields.map((field) => (
							<FieldRenderer
								key={field.key}
								field={field}
								value={
									values[field.key] ?? getPath(unknownFields, field.key)
								}
								onChange={onFieldChange}
								error={errors[field.key]}
							/>
						))}
					</Section>
				);
			})}

			{/* Extra keys not covered by schema */}
			{extraKeys.length > 0 && (
				<Section title="Other" defaultOpen={true} badge={extraKeys.length}>
					{extraKeys.map((key) => (
						<ExtraField
							key={key}
							fieldKey={key}
							value={values[key] ?? unknownFields[key]}
							onChange={onFieldChange}
							error={errors[key]}
						/>
					))}
				</Section>
			)}

			{/* Add field button */}
			<button
				type="button"
				className="btn btn-ghost btn-sm gap-1.5 text-base-content/60 hover:text-base-content mt-1"
				onClick={() => setShowAddPanel(true)}
			>
				<Plus size={14} />
				Add field
			</button>

			{/* Add field panel */}
			{showAddPanel && (
				<AddFieldPanel
					configType={configType}
					presentKeys={presentKeys}
					onAdd={(keys, customKey) => {
						for (const key of keys) {
							const field = configType.fields.find((f) => f.key === key);
							onFieldChange(
								key,
								field?.default ?? defaultForType(field?.type ?? "string"),
							);
						}
						if (customKey) {
							onFieldChange(customKey, "");
						}
						setShowAddPanel(false);
					}}
					onClose={() => setShowAddPanel(false)}
				/>
			)}
		</div>
	);
}
