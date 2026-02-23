import { useRef, useState } from "react";
import type { ConfigFileMatch, ProjectScanResult } from "../../lib/scanner";
import FileTree from "./FileTree";

interface Props {
	result: ProjectScanResult | null;
	loading: boolean;
	selectedFile: ConfigFileMatch | null;
	onSelect: (file: ConfigFileMatch) => void;
	isDirty: boolean;
}

export default function Sidebar({
	result,
	loading,
	selectedFile,
	onSelect,
	isDirty,
}: Props) {
	const [pendingFile, setPendingFile] = useState<ConfigFileMatch | null>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);

	function handleSelect(file: ConfigFileMatch) {
		if (isDirty && selectedFile?.path !== file.path) {
			setPendingFile(file);
			dialogRef.current?.showModal();
			return;
		}
		onSelect(file);
	}

	function handleDiscard() {
		dialogRef.current?.close();
		if (pendingFile) {
			onSelect(pendingFile);
		}
		setPendingFile(null);
	}

	function handleCancel() {
		dialogRef.current?.close();
		setPendingFile(null);
	}

	if (loading) {
		return (
			<aside className="w-56 shrink-0 border-r border-base-300 p-3 flex flex-col gap-2">
				{["s1", "s2", "s3", "s4", "s5"].map((k) => (
					<div key={k} className="skeleton h-7 w-full rounded" />
				))}
			</aside>
		);
	}

	const allFiles = result?.packages.flatMap((pkg) => pkg.files) ?? [];

	if (allFiles.length === 0) {
		return (
			<aside className="w-56 shrink-0 border-r border-base-300 p-4 flex items-center justify-center">
				<p className="text-sm text-base-content/50 text-center">
					No config files found
				</p>
			</aside>
		);
	}

	return (
		<>
			<aside className="w-56 shrink-0 border-r border-base-300 overflow-y-auto">
				<div className="px-1 py-2">
					<FileTree
						files={allFiles}
						rootPath={result?.projectPath ?? ""}
						selectedFile={selectedFile}
						onSelect={handleSelect}
					/>
				</div>
			</aside>

			<dialog ref={dialogRef} className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Unsaved changes</h3>
					<p className="py-4">
						You have unsaved changes. Discard and switch files?
					</p>
					<div className="modal-action">
						<button
							type="button"
							className="btn btn-ghost"
							onClick={handleCancel}
						>
							Cancel
						</button>
						<button
							type="button"
							className="btn btn-error"
							onClick={handleDiscard}
						>
							Discard
						</button>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button type="submit" onClick={handleCancel}>
						close
					</button>
				</form>
			</dialog>
		</>
	);
}
