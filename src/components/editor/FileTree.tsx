import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react";
import { useMemo, useState } from "react";
import type { ConfigFileMatch } from "../../lib/scanner";

// ── Tree data structure ──────────────────────────────────────────────────────

interface DirNode {
	name: string;
	path: string;
	dirs: Map<string, DirNode>;
	files: ConfigFileMatch[];
}

function buildTree(files: ConfigFileMatch[], rootPath: string): DirNode {
	const root: DirNode = {
		name: "",
		path: rootPath,
		dirs: new Map(),
		files: [],
	};

	for (const file of files) {
		const rel = file.path.startsWith(`${rootPath}/`)
			? file.path.slice(rootPath.length + 1)
			: file.path;
		const parts = rel.split("/");
		let node = root;
		for (let i = 0; i < parts.length - 1; i++) {
			const seg = parts[i];
			if (!node.dirs.has(seg)) {
				node.dirs.set(seg, {
					name: seg,
					path: `${node.path}/${seg}`,
					dirs: new Map(),
					files: [],
				});
			}
			// biome-ignore lint/style/noNonNullAssertion: just set above
			node = node.dirs.get(seg)!;
		}
		node.files.push(file);
	}

	return root;
}

function containsPath(node: DirNode, target: string): boolean {
	if (node.files.some((f) => f.path === target)) return true;
	for (const child of node.dirs.values()) {
		if (containsPath(child, target)) return true;
	}
	return false;
}

function sortedDirs(node: DirNode): DirNode[] {
	return [...node.dirs.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function sortedFiles(node: DirNode): ConfigFileMatch[] {
	return [...node.files].sort((a, b) => a.filename.localeCompare(b.filename));
}

// ── Row components ───────────────────────────────────────────────────────────

function FileRow({
	file,
	depth,
	isSelected,
	onSelect,
}: {
	file: ConfigFileMatch;
	depth: number;
	isSelected: boolean;
	onSelect: (f: ConfigFileMatch) => void;
}) {
	return (
		<button
			type="button"
			className={`flex items-center gap-1.5 w-full py-1.5 text-sm text-left rounded transition-colors hover:bg-base-200 ${
				isSelected ? "bg-base-300 font-medium" : ""
			}`}
			style={{ paddingLeft: depth * 16 + 8 }}
			onClick={() => onSelect(file)}
		>
			{/* Spacer matching chevron width so file icon aligns with folder icons */}
			<span className="w-[17px] shrink-0" />
			<FileText size={13} className="shrink-0 text-base-content/40" />
			<span className="truncate">{file.filename}</span>
		</button>
	);
}

function DirRow({
	node,
	depth,
	selectedPath,
	onSelect,
}: {
	node: DirNode;
	depth: number;
	selectedPath: string | null;
	onSelect: (f: ConfigFileMatch) => void;
}) {
	const [open, setOpen] = useState(
		depth === 0 || (selectedPath !== null && containsPath(node, selectedPath)),
	);

	const dirs = sortedDirs(node);
	const files = sortedFiles(node);

	return (
		<div>
			<button
				type="button"
				className="flex items-center gap-1.5 w-full py-1.5 text-sm text-left rounded hover:bg-base-200 transition-colors text-base-content/70"
				style={{ paddingLeft: depth * 16 + 8 }}
				onClick={() => setOpen((v) => !v)}
			>
				{open ? (
					<ChevronDown size={13} className="shrink-0" />
				) : (
					<ChevronRight size={13} className="shrink-0" />
				)}
				<Folder size={13} className="shrink-0 text-base-content/40" />
				<span className="truncate font-medium">{node.name}</span>
			</button>
			{open && (
				<div>
					{files.map((f) => (
						<FileRow
							key={f.path}
							file={f}
							depth={depth + 1}
							isSelected={f.path === selectedPath}
							onSelect={onSelect}
						/>
					))}
					{dirs.map((d) => (
						<DirRow
							key={d.path}
							node={d}
							depth={depth + 1}
							selectedPath={selectedPath}
							onSelect={onSelect}
						/>
					))}
				</div>
			)}
		</div>
	);
}

// ── Main export ──────────────────────────────────────────────────────────────

interface Props {
	files: ConfigFileMatch[];
	rootPath: string;
	selectedFile: ConfigFileMatch | null;
	onSelect: (file: ConfigFileMatch) => void;
}

export default function FileTree({
	files,
	rootPath,
	selectedFile,
	onSelect,
}: Props) {
	const tree = useMemo(() => buildTree(files, rootPath), [files, rootPath]);
	const selectedPath = selectedFile?.path ?? null;
	const rootFiles = sortedFiles(tree);
	const rootDirs = sortedDirs(tree);

	return (
		<div className="py-1">
			{rootFiles.map((f) => (
				<FileRow
					key={f.path}
					file={f}
					depth={0}
					isSelected={f.path === selectedPath}
					onSelect={onSelect}
				/>
			))}
			{rootDirs.map((d) => (
				<DirRow
					key={d.path}
					node={d}
					depth={0}
					selectedPath={selectedPath}
					onSelect={onSelect}
				/>
			))}
		</div>
	);
}
