import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
	fieldKey: string;
	label: string;
	value: string;
	onChange: (v: string) => void;
	error?: string;
	description?: string;
}

export default function SecretField({
	fieldKey,
	label,
	value,
	onChange,
	error,
	description,
}: Props) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="flex flex-col gap-1 w-full">
			<label className="text-sm font-medium" htmlFor={fieldKey}>
				{label}
			</label>
			{description && (
				<p className="text-xs text-base-content/60">{description}</p>
			)}
			<div className="relative">
				<input
					id={fieldKey}
					type={visible ? "text" : "password"}
					className={`input input-bordered w-full pr-10 ${error ? "input-error" : ""}`}
					value={value ?? ""}
					onChange={(e) => onChange(e.target.value)}
				/>
				<button
					type="button"
					className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
					onClick={() => setVisible((v) => !v)}
					aria-label={visible ? "Hide value" : "Show value"}
				>
					{visible ? <EyeOff size={14} /> : <Eye size={14} />}
				</button>
			</div>
			{error && <p className="text-xs text-error">{error}</p>}
		</div>
	);
}
