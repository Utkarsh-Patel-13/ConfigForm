interface Props {
	fieldKey: string;
	label: string;
	value: string;
	options: string[];
	allowCustom?: boolean;
	onChange: (v: string) => void;
	error?: string;
	description?: string;
}

export default function EnumField({
	fieldKey,
	label,
	value,
	options,
	allowCustom,
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
			{allowCustom ? (
				<>
					<input
						id={fieldKey}
						type="text"
						list={`${fieldKey}-opts`}
						className={`input input-bordered w-full ${error ? "input-error" : ""}`}
						value={value ?? ""}
						placeholder={`Select or type ${label}…`}
						onChange={(e) => onChange(e.target.value)}
					/>
					<datalist id={`${fieldKey}-opts`}>
						{options.map((opt) => (
							<option key={opt} value={opt} />
						))}
					</datalist>
				</>
			) : (
				<select
					id={fieldKey}
					className={`select select-bordered w-full ${error ? "select-error" : ""}`}
					value={value ?? ""}
					onChange={(e) => onChange(e.target.value)}
				>
					{!value && (
						<option value="" disabled>
							Select {label}…
						</option>
					)}
					{options.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			)}
			{error && <p className="text-xs text-error">{error}</p>}
		</div>
	);
}
