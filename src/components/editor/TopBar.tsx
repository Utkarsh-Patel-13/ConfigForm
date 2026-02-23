import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { EditorMode, SaveStatus } from "../../hooks/useEditorState";

interface Props {
	fileName: string | null;
	saveStatus: SaveStatus;
	errorCount: number;
	onSave: () => void;
	mode: EditorMode;
	onModeChange: (m: EditorMode) => void;
	parseError: boolean;
	onClose: () => void;
}

export default function TopBar({
	fileName,
	saveStatus,
	errorCount,
	onSave,
	mode,
	onModeChange,
	parseError,
	onClose,
}: Props) {
	const [showSaved, setShowSaved] = useState(false);

	useEffect(() => {
		if (saveStatus === "saved") {
			setShowSaved(true);
			const id = setTimeout(() => setShowSaved(false), 2000);
			return () => clearTimeout(id);
		}
		setShowSaved(false);
	}, [saveStatus]);

	return (
		<div className="navbar bg-base-200 border-b border-base-300 min-h-14 px-3 shrink-0">
			<div className="navbar-start gap-2 min-w-0 flex-1">
				<button
					type="button"
					className="btn btn-ghost btn-sm btn-circle shrink-0"
					onClick={onClose}
					aria-label="Close project"
				>
					<ArrowLeft size={16} />
				</button>
				<span className="text-sm text-base-content/80 truncate">
					{fileName ?? "No file selected"}
				</span>
			</div>

			<div className="navbar-center">
				<div className="join">
					<button
						type="button"
						className={`btn btn-sm join-item ${mode === "visual" ? "btn-active" : ""}`}
						disabled={parseError}
						onClick={() => onModeChange("visual")}
					>
						Visual
					</button>
					<button
						type="button"
						className={`btn btn-sm join-item ${mode === "raw" ? "btn-active" : ""}`}
						onClick={() => onModeChange("raw")}
					>
						Raw
					</button>
				</div>
			</div>

			<div className="navbar-end gap-3 flex-1 justify-end">
				{saveStatus === "dirty" && (
					<span className="hidden sm:flex items-center gap-1.5 text-sm text-base-content/60">
						<span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
						Unsaved changes
					</span>
				)}
				{saveStatus === "saving" && (
					<span className="hidden sm:flex items-center gap-1.5 text-sm text-base-content/60">
						<span className="loading loading-spinner loading-xs" />
						Saving…
					</span>
				)}
				{showSaved && (
					<span className="hidden sm:flex items-center gap-1.5 text-sm text-success">
						<Check size={14} />
						Saved
					</span>
				)}
				{saveStatus === "error" && (
					<span className="hidden sm:flex items-center gap-1.5 text-sm text-error">
						<span className="badge badge-error badge-sm">{errorCount}</span>
						Save failed
					</span>
				)}
				<button
					type="button"
					className="btn btn-primary btn-sm"
					onClick={onSave}
					disabled={
						!fileName || saveStatus === "clean" || saveStatus === "saving"
					}
				>
					Save
				</button>
			</div>
		</div>
	);
}
