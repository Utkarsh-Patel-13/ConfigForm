interface Props {
	fieldKey: string;
	label: string;
	value: boolean;
	onChange: (v: boolean) => void;
	error?: string;
	description?: string;
}

export default function BooleanField({
	fieldKey,
	label,
	value,
	onChange,
	error,
	description,
}: Props) {
	return (
		<div className="flex flex-col gap-1">
			{description && (
				<p className="text-xs text-base-content/60">{description}</p>
			)}
			<div className="flex items-center gap-3">
				<input
					id={fieldKey}
					type="checkbox"
					className="toggle"
					checked={value ?? false}
					onChange={(e) => onChange(e.target.checked)}
				/>
				<label
					className="text-sm font-medium cursor-pointer"
					htmlFor={fieldKey}
				>
					{label}
				</label>
			</div>
			{error && <p className="text-xs text-error">{error}</p>}
		</div>
	);
}
