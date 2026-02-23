import { Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type {
	ConfigTypeDefinition,
	FieldDefinition,
} from "../../registry/types";

interface Props {
	configType: ConfigTypeDefinition;
	/** Keys already present in the file or in values */
	presentKeys: Set<string>;
	onAdd: (keys: string[], customKey?: string) => void;
	onClose: () => void;
}

export default function AddFieldPanel({
	configType,
	presentKeys,
	onAdd,
	onClose,
}: Props) {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [customKey, setCustomKey] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);

	// Available schema fields (not already in file)
	const available = useMemo(
		() => configType.fields.filter((f) => !presentKeys.has(f.key)),
		[configType.fields, presentKeys],
	);

	// Filter by query
	const filtered = useMemo(() => {
		const q = query.toLowerCase();
		return q
			? available.filter(
					(f) =>
						f.key.toLowerCase().includes(q) ||
						f.label.toLowerCase().includes(q) ||
						(f.description ?? "").toLowerCase().includes(q),
				)
			: available;
	}, [available, query]);

	// Group filtered fields
	const groups = useMemo(() => {
		const map = new Map<string, FieldDefinition[]>();
		for (const f of filtered) {
			const g = f.group ?? "General";
			if (!map.has(g)) map.set(g, []);
			map.get(g)?.push(f);
		}
		return map;
	}, [filtered]);

	function toggle(key: string) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	}

	function handleAdd() {
		onAdd([...selected], customKey.trim() || undefined);
	}

	const hasSelection = selected.size > 0 || customKey.trim().length > 0;

	return (
		<dialog
			open
			className="modal modal-open"
			onKeyDown={(e) => e.key === "Escape" && onClose()}
		>
			<div className="modal-box max-w-md flex flex-col gap-4 max-h-[80vh]">
				<h3 className="font-semibold text-base">Add field</h3>

				{/* Search */}
				<label className="input input-bordered flex items-center gap-2 input-sm">
					<Search size={14} className="text-base-content/50 shrink-0" />
					<input
						ref={searchRef}
						type="text"
						className="grow"
						placeholder="Search fields…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						autoFocus
					/>
				</label>

				{/* Field list */}
				<div className="overflow-y-auto flex-1 -mx-2 px-2">
					{groups.size === 0 && !query && (
						<p className="text-sm text-base-content/50 py-4 text-center">
							All defined fields are already in the file.
						</p>
					)}
					{groups.size === 0 && query && (
						<p className="text-sm text-base-content/50 py-4 text-center">
							No matching fields.
						</p>
					)}
					{[...groups.entries()].map(([group, fields]) => (
						<div key={group} className="mb-4">
							<p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1.5">
								{group}
							</p>
							<div className="flex flex-col gap-0.5">
								{fields.map((field) => (
									<label
										key={field.key}
										className={`flex items-start gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-base-200 transition-colors ${selected.has(field.key) ? "bg-base-200" : ""}`}
									>
										<input
											type="checkbox"
											className="checkbox checkbox-xs mt-0.5 shrink-0"
											checked={selected.has(field.key)}
											onChange={() => toggle(field.key)}
										/>
										<div className="flex flex-col gap-0.5 min-w-0">
											<span className="text-sm font-medium leading-tight">
												{field.label}
											</span>
											<span className="text-xs text-base-content/50 font-mono">
												{field.key}
											</span>
											{field.description && (
												<span className="text-xs text-base-content/50 leading-snug">
													{field.description}
												</span>
											)}
										</div>
									</label>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Custom key */}
				<div className="border-t border-base-300 pt-3 flex flex-col gap-1.5">
					<p className="text-xs text-base-content/60">
						Or add a custom key not in the schema:
					</p>
					<input
						type="text"
						className="input input-bordered input-sm font-mono w-full"
						placeholder="custom-key"
						value={customKey}
						onChange={(e) => setCustomKey(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && hasSelection && handleAdd()}
					/>
				</div>

				<div className="modal-action mt-0">
					<button
						type="button"
						className="btn btn-ghost btn-sm"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						type="button"
						className="btn btn-primary btn-sm"
						disabled={!hasSelection}
						onClick={handleAdd}
					>
						Add{selected.size > 0 ? ` (${selected.size})` : ""}
					</button>
				</div>
			</div>
			{/* Backdrop */}
			<form method="dialog" className="modal-backdrop">
				<button type="button" onClick={onClose}>
					close
				</button>
			</form>
		</dialog>
	);
}
