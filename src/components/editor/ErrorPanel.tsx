import { AlertCircle } from "lucide-react";

interface Props {
	parseError: string;
	filePath: string;
}

export default function ErrorPanel({ parseError, filePath }: Props) {
	return (
		<div role="alert" className="alert alert-error">
			<AlertCircle className="shrink-0 w-6 h-6" />
			<div>
				<h3 className="font-bold">Could not parse file</h3>
				<p className="text-sm opacity-90">{filePath}</p>
				<p className="text-sm mt-1 font-mono opacity-80">{parseError}</p>
				<p className="text-sm mt-2 opacity-70">
					Raw mode is active — you can view the file content in the panel below.
				</p>
			</div>
		</div>
	);
}
