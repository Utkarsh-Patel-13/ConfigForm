import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RecordEntryProps {
	entryKey: string;
	entryValue: string;
	onUpdate: (oldKey: string, newKey: string, newValue: string) => void;
	onRemove: (key: string) => void;
}

function RecordEntry({
	entryKey,
	entryValue,
	onUpdate,
	onRemove,
}: RecordEntryProps) {
	const [localKey, setLocalKey] = useState(entryKey);
	const [localVal, setLocalVal] = useState(entryValue);

	// Sync if parent value changes (e.g. file reloaded)
	useEffect(() => {
		setLocalKey(entryKey);
	}, [entryKey]);
	useEffect(() => {
		setLocalVal(entryValue);
	}, [entryValue]);

	function commit() {
		if (localKey !== entryKey || localVal !== entryValue) {
			onUpdate(entryKey, localKey.trim() || entryKey, localVal);
		}
	}

	return (
		<tr>
			<td className="py-0.5 pr-1 w-2/5">
				<input
					type="text"
					className="input input-xs input-ghost w-full font-mono focus:bg-base-100"
					value={localKey}
					onChange={(e) => setLocalKey(e.target.value)}
					onBlur={commit}
					onKeyDown={(e) => e.key === "Enter" && commit()}
					aria-label="Key"
				/>
			</td>
			<td className="py-0.5 px-1">
				<input
					type="text"
					className="input input-xs input-ghost w-full focus:bg-base-100"
					value={localVal}
					onChange={(e) => setLocalVal(e.target.value)}
					onBlur={commit}
					onKeyDown={(e) => e.key === "Enter" && commit()}
					aria-label="Value"
				/>
			</td>
			<td className="py-0.5 pl-1 w-7">
				<button
					type="button"
					className="btn btn-ghost btn-xs btn-circle"
					onClick={() => onRemove(entryKey)}
					aria-label={`Remove ${entryKey}`}
				>
					<X size={12} />
				</button>
			</td>
		</tr>
	);
}

interface Props {
	fieldKey: string;
	label: string;
	value: Record<string, string>;
	onChange: (v: Record<string, string>) => void;
	error?: string;
	description?: string;
}

export default function RecordField({
	fieldKey,
	label,
	value,
	onChange,
	error,
	description,
}: Props) {
	const entries = Object.entries(value ?? {});
	const [newKey, setNewKey] = useState("");
	const [newVal, setNewVal] = useState("");
	const newKeyInputRef = useRef<HTMLInputElement>(null);

	function handleUpdate(oldKey: string, newKey: string, newValue: string) {
		// Rebuild preserving insertion order, renaming key if needed
		const next: Record<string, string> = {};
		for (const [k, v] of Object.entries(value ?? {})) {
			const resolvedKey = k === oldKey ? newKey : k;
			next[resolvedKey] = k === oldKey ? newValue : v;
		}
		onChange(next);
	}

	function handleRemove(key: string) {
		const next = { ...value };
		delete next[key];
		onChange(next);
	}

	function handleAdd() {
		const trimmed = newKey.trim();
		if (!trimmed) return;
		onChange({ ...(value ?? {}), [trimmed]: newVal });
		setNewKey("");
		setNewVal("");
		newKeyInputRef.current?.focus();
	}

	return (
		<div className="flex flex-col gap-2 w-full">
			<span className="text-sm font-medium" id={`${fieldKey}-label`}>
				{label}
			</span>
			{description && (
				<p className="text-xs text-base-content/60">{description}</p>
			)}
			<div className="border border-base-300 rounded-lg overflow-hidden">
				{entries.length > 0 && (
					<table
						className="table table-xs w-full"
						aria-labelledby={`${fieldKey}-label`}
					>
						<thead>
							<tr className="bg-base-200 text-base-content/60">
								<th className="w-2/5 font-normal">Key</th>
								<th className="font-normal">Value</th>
								<th className="w-7" />
							</tr>
						</thead>
						<tbody>
							{entries.map(([k, v]) => (
								<RecordEntry
									key={k}
									entryKey={k}
									entryValue={v}
									onUpdate={handleUpdate}
									onRemove={handleRemove}
								/>
							))}
						</tbody>
					</table>
				)}
				{/* Add new entry row */}
				<div
					className={`flex items-center gap-2 px-2 py-1.5 ${entries.length > 0 ? "border-t border-base-300" : ""} bg-base-50`}
				>
					<input
						ref={newKeyInputRef}
						type="text"
						className="input input-xs input-bordered flex-[2] font-mono"
						placeholder="key"
						value={newKey}
						onChange={(e) => setNewKey(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAdd()}
						aria-label="New key"
					/>
					<input
						type="text"
						className="input input-xs input-bordered flex-[3]"
						placeholder="value"
						value={newVal}
						onChange={(e) => setNewVal(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAdd()}
						aria-label="New value"
					/>
					<button
						type="button"
						className="btn btn-xs btn-ghost shrink-0"
						onClick={handleAdd}
						disabled={!newKey.trim()}
						aria-label="Add entry"
					>
						<Plus size={13} />
					</button>
				</div>
			</div>
			{error && <p className="text-xs text-error">{error}</p>}
		</div>
	);
}
