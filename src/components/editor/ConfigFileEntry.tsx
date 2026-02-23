import { FileText } from "lucide-react";
import type { ConfigFileMatch } from "../../lib/scanner";

interface Props {
	file: ConfigFileMatch;
	isSelected: boolean;
	onClick: (file: ConfigFileMatch) => void;
}

export default function ConfigFileEntry({ file, isSelected, onClick }: Props) {
	return (
		<button
			type="button"
			className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left rounded transition-colors hover:bg-base-200 ${
				isSelected ? "bg-base-300 font-medium" : ""
			}`}
			onClick={() => onClick(file)}
		>
			<FileText size={14} className="shrink-0 text-base-content/50" />
			<span className="truncate">{file.filename}</span>
		</button>
	);
}
