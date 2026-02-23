import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ConfigFileMatch, PackageGroup } from "../../lib/scanner";
import ConfigFileEntry from "./ConfigFileEntry";

interface Props {
	group: PackageGroup;
	selectedFile: ConfigFileMatch | null;
	onSelect: (file: ConfigFileMatch) => void;
}

export default function SidebarGroup({ group, selectedFile, onSelect }: Props) {
	const [expanded, setExpanded] = useState(true);

	return (
		<div>
			<button
				type="button"
				className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs font-semibold text-base-content/60 uppercase tracking-wide hover:bg-base-200 transition-colors"
				onClick={() => setExpanded((e) => !e)}
				aria-expanded={expanded}
			>
				{expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
				<span className="truncate flex-1 text-left">{group.name}</span>
				<span className="badge badge-sm badge-ghost shrink-0">
					{group.files.length}
				</span>
			</button>
			{expanded && (
				<div className="pl-2">
					{group.files.map((file) => (
						<ConfigFileEntry
							key={file.path}
							file={file}
							isSelected={selectedFile?.path === file.path}
							onClick={onSelect}
						/>
					))}
				</div>
			)}
		</div>
	);
}
