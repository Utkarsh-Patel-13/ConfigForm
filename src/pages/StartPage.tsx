import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { FileText, FolderOpen, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import RecentList from "../components/RecentList";
import { useRecent } from "../hooks/useRecent";

interface StartPageProps {
	onOpen: (path: string, kind: "project" | "file") => void;
}

function StartPage({ onOpen }: StartPageProps) {
	const [error, setError] = useState<string | null>(null);
	const [dragging, setDragging] = useState(false);
	const { entries, loading, error: recentError, addEntry, removeEntry, clearAll } = useRecent();

	async function handleOpenProject() {
		try {
			const path = await invoke<string | null>("open_folder_dialog");
			if (path !== null) {
				await addEntry(path, "project");
				onOpen(path, "project");
			}
		} catch (err) {
			setError(String(err));
		}
	}

	async function handleOpenFile() {
		try {
			const path = await invoke<string | null>("open_file_dialog");
			if (path !== null) {
				await addEntry(path, "file");
				onOpen(path, "file");
			}
		} catch (err) {
			setError(String(err));
		}
	}

	useEffect(() => {
		let unlisten: (() => void) | null = null;
		getCurrentWebview()
			.onDragDropEvent((event) => {
				if (event.payload.type === "drop") {
					setDragging(false);
					const path = event.payload.paths[0];
					if (path) {
						addEntry(path, "file")
							.then(() => onOpen(path, "file"))
							.catch((err) => setError(String(err)));
					}
				}
			})
			.then((fn) => {
				unlisten = fn;
			});
		return () => unlisten?.();
	}, [addEntry, onOpen]);

	return (
		<main className="min-h-screen flex items-center justify-center p-6 overflow-y-auto">
			<div className="w-full max-w-[520px] flex flex-col gap-8 my-auto">

				{/* Branding */}
				<div className="flex flex-col items-center gap-2 text-center select-none">
					<div className="btn btn-primary btn-circle pointer-events-none mb-1">
						<Settings size={20} />
					</div>
					<h1 className="text-xl font-bold">ConfigForm</h1>
					<p className="text-sm text-base-content/50">Config editor for your projects</p>
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-4">
					{error !== null && (
						<div role="alert" className="alert alert-error">
							<span>{error}</span>
							<button
								type="button"
								className="btn btn-ghost btn-xs"
								onClick={() => setError(null)}
							>
								✕
							</button>
						</div>
					)}

					{/* Drop Zone */}
					<button
						type="button"
						onClick={handleOpenFile}
						onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
						onDragLeave={() => setDragging(false)}
						onDrop={(e) => { e.preventDefault(); setDragging(false); }}
						className={`w-full flex flex-col items-center gap-4 border-2 border-dashed rounded-box py-14 transition-colors cursor-pointer ${
							dragging ? "border-primary bg-primary/5" : "border-base-300 hover:border-primary hover:bg-base-200/60"
						}`}
					>
						<FileText size={28} className="text-base-content/30" />
						<div className="text-center">
							<p className="font-semibold text-base-content">Drop config file here</p>
							<p className="text-xs text-base-content/40 font-mono uppercase mt-1">JSON · YAML · TOML</p>
						</div>
					</button>

					<div className="divider text-xs font-mono uppercase my-0">or</div>

					<button
						type="button"
						className="btn btn-primary w-full"
						onClick={handleOpenProject}
					>
						<FolderOpen size={16} />
						Open Project Folder
					</button>
				</div>

				{/* Recent */}
				<RecentList
					onOpen={onOpen}
					entries={entries}
					loading={loading}
					error={recentError}
					removeEntry={removeEntry}
					clearAll={clearAll}
				/>

				{/* Footer */}
				<p className="text-center text-[10px] text-base-content/30 font-mono">
					ConfigForm · v0.1.0
				</p>

			</div>
		</main>
	);
}

export default StartPage;
