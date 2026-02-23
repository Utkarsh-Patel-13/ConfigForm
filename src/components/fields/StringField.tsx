interface Props {
	fieldKey: string;
	label: string;
	value: string;
	onChange: (v: string) => void;
	error?: string;
	description?: string;
	required?: boolean;
}

export default function StringField({
	fieldKey,
	label,
	value,
	onChange,
	error,
	description,
	required,
}: Props) {
	return (
		<div className="flex flex-col gap-1 w-full">
			<label className="text-sm font-medium" htmlFor={fieldKey}>
				{label}
				{required && <span className="text-error ml-1">*</span>}
			</label>
			{description && (
				<p className="text-xs text-base-content/60">{description}</p>
			)}
			<input
				id={fieldKey}
				type="text"
				className={`input input-bordered w-full ${error ? "input-error" : ""}`}
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
			/>
			{error && <p className="text-xs text-error">{error}</p>}
		</div>
	);
}
