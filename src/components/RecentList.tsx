import { FileText, FolderOpen, X } from "lucide-react";
import { useState } from "react";
import type { RecentEntryWithStatus } from "../types/recent";

interface RecentListProps {
	onOpen: (path: string, kind: "project" | "file") => void;
	entries: RecentEntryWithStatus[];
	loading: boolean;
	error: string | null;
	removeEntry: (path: string) => Promise<void>;
	clearAll: () => Promise<void>;
}

function parentDir(fullPath: string, displayName: string): string {
	const idx = fullPath.lastIndexOf(displayName);
	if (idx <= 0) return fullPath;
	return fullPath.slice(0, idx).replace(/[/\\]$/, "");
}

function RecentList({
	onOpen,
	entries,
	loading,
	error,
	removeEntry,
	clearAll,
}: RecentListProps) {
	const [inaccessibleAlert, setInaccessibleAlert] = useState<string | null>(
		null,
	);

	if (loading) {
		return (
			<div className="flex justify-center py-6">
				<span className="loading loading-spinner loading-sm" />
			</div>
		);
	}

	if (error !== null) {
		return (
			<div role="alert" className="alert alert-error">
				<span>{error}</span>
			</div>
		);
	}

	if (entries.length === 0) return null;

	return (
		<div className="flex flex-col gap-2">
			{/* Header */}
			<div className="flex items-center justify-between px-1">
				<span className="text-xs font-mono text-base-content/40 uppercase tracking-wider">
					Recent
				</span>
				<button
					type="button"
					className="btn btn-ghost btn-xs text-primary"
					onClick={clearAll}
				>
					Clear History
				</button>
			</div>

			{/* Inaccessible warning */}
			{inaccessibleAlert !== null && (
				<div role="alert" className="alert alert-warning">
					<span>{inaccessibleAlert}</span>
					<button
						type="button"
						className="btn btn-ghost btn-xs"
						onClick={() => setInaccessibleAlert(null)}
					>
						✕
					</button>
				</div>
			)}

			{/* List */}
			<ul className="menu bg-base-200 rounded-box p-0 gap-0 w-full">
				{entries.map((entry) => (
					<li key={entry.path} className={entry.accessible ? "" : "opacity-50"}>
						<div className="group flex items-center gap-2 pr-2 rounded-none">
							<button
								type="button"
								className="flex items-center gap-3 flex-1 min-w-0 text-left"
								onClick={() => {
									if (!entry.accessible) {
										setInaccessibleAlert(
											"This path no longer exists on your system",
										);
										return;
									}
									onOpen(entry.path, entry.kind as "project" | "file");
								}}
							>
								{entry.kind === "project" ? (
									<FolderOpen size={16} className="shrink-0" />
								) : (
									<FileText size={16} className="shrink-0" />
								)}
								<span className="flex flex-col min-w-0">
									<span className="truncate text-sm font-semibold font-mono">
										{entry.displayName}
										{!entry.accessible && (
											<span className="badge badge-ghost badge-sm ml-2 font-sans font-normal">
												Not found
											</span>
										)}
									</span>
									<span className="truncate text-xs text-base-content/40">
										{parentDir(entry.path, entry.displayName)}
									</span>
								</span>
							</button>
							<button
								type="button"
								aria-label="Remove"
								className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 shrink-0"
								onClick={(e) => {
									e.stopPropagation();
									removeEntry(entry.path);
								}}
							>
								<X size={14} />
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default RecentList;
