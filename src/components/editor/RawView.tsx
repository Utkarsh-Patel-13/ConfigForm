interface Props {
	rawContent: string;
	isDirty: boolean;
}

export default function RawView({ rawContent, isDirty }: Props) {
	return (
		<div className="flex flex-col h-full gap-3">
			{isDirty && (
				<div role="alert" className="alert alert-info py-2">
					<span className="text-sm">
						Showing saved file — unsaved changes not reflected
					</span>
				</div>
			)}
			<pre className="flex-1 bg-base-200 rounded-lg p-4 overflow-auto text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
				<code>{rawContent}</code>
			</pre>
		</div>
	);
}
