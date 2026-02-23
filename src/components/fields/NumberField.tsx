interface Props {
	fieldKey: string;
	label: string;
	value: number;
	onChange: (v: number) => void;
	error?: string;
	description?: string;
}

export default function NumberField({
	fieldKey,
	label,
	value,
	onChange,
	error,
	description,
}: Props) {
	return (
		<div className="flex flex-col gap-1 w-full">
			<label className="text-sm font-medium" htmlFor={fieldKey}>
				{label}
			</label>
			{description && (
				<p className="text-xs text-base-content/60">{description}</p>
			)}
			<input
				id={fieldKey}
				type="number"
				className={`input input-bordered w-full ${error ? "input-error" : ""}`}
				value={value ?? ""}
				onChange={(e) => onChange(parseFloat(e.target.value))}
			/>
			{error && <p className="text-xs text-error">{error}</p>}
		</div>
	);
}
